
using AlKausar.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AlKausar.Api.Data;

public sealed class ShopDbContextFactory
    : IDesignTimeDbContextFactory<ShopDbContext>
{
    public ShopDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable(
                "ConnectionStrings__DefaultConnection");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Set the ConnectionStrings__DefaultConnection " +
                "environment variable before running EF Core tools.");
        }

        var options = new DbContextOptionsBuilder<ShopDbContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new ShopDbContext(options);
    }
}
