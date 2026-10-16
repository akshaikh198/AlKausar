using System.Text;
using System.Security.Claims;
using AlKausar.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Set ConnectionStrings__DefaultConnection to a valid SQL Server connection string.");
}

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException("Set Jwt__Key to a random secret of at least 32 bytes.");
}

builder.Services.AddDbContext<ShopDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
    policy.WithOrigins(builder.Configuration.GetSection("FrontendOrigins").Get<string[]>() ?? ["http://localhost:5173"])
        .AllowAnyHeader()
        .AllowAnyMethod()));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "AlKausar",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "AlKausar.Web",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var subject = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!Guid.TryParse(subject, out var userId))
                {
                    context.Fail("The access token does not identify a valid account.");
                    return;
                }

                var db = context.HttpContext.RequestServices.GetRequiredService<ShopDbContext>();
                var account = await db.Users.AsNoTracking().SingleOrDefaultAsync(user => user.Id == userId);
                var role = context.Principal?.FindFirstValue(ClaimTypes.Role);
                if (account is null || !account.IsActive || account.Role != role)
                {
                    context.Fail("This account is no longer active.");
                }
            }
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => Results.Ok(new
{
    application = "Al-Kausar API",
    status = "Running",
    documentation = "/openapi/v1.json"
}));
app.MapControllers();

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db, builder.Configuration);
}

app.Run();
