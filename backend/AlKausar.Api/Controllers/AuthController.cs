using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AlKausar.Api.Data;
using AlKausar.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AlKausar.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(ShopDbContext db, IConfiguration configuration) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (Encoding.UTF8.GetByteCount(request.Password) > 72)
            return BadRequest(new { message = "Password must not exceed 72 UTF-8 bytes." });

        var email = request.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(user => user.Email == email))
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        var user = new User
        {
            Email = email,
            FullName = request.FullName.Trim(),
            Phone = request.Phone?.Trim() ?? "",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(CreateResponse(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        if (Encoding.UTF8.GetByteCount(request.Password) > 72)
            return Unauthorized(new { message = "Email or password is incorrect." });

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await db.Users.SingleOrDefaultAsync(candidate => candidate.Email == email);
        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Email or password is incorrect." });
        }

        return Ok(CreateResponse(user));
    }

    private AuthResponse CreateResponse(User user)
    {
        var issuer = configuration["Jwt:Issuer"] ?? "AlKausar";
        var audience = configuration["Jwt:Audience"] ?? "AlKausar.Web";
        var key = configuration["Jwt:Key"]!;
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256));
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.Role, user.FullName, user.Email);
    }
}
