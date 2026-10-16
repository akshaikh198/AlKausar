using AlKausar.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Data;

public sealed class ShopDbContext(DbContextOptions<ShopDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique();
        modelBuilder.Entity<User>().Property(user => user.Email).HasMaxLength(254);
        modelBuilder.Entity<User>().Property(user => user.Role).HasMaxLength(16);
        modelBuilder.Entity<Category>().HasIndex(category => category.Name).IsUnique();
        modelBuilder.Entity<Category>().Property(category => category.Name).HasMaxLength(80);
        modelBuilder.Entity<Product>().Property(product => product.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Product>().Property(product => product.RowVersion).IsRowVersion();
        modelBuilder.Entity<Product>().HasOne(product => product.Category).WithMany(category => category.Products)
            .HasForeignKey(product => product.CategoryId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<WishlistItem>().HasKey(item => new { item.UserId, item.ProductId });
        modelBuilder.Entity<WishlistItem>().HasOne<User>().WithMany().HasForeignKey(item => item.UserId);
        modelBuilder.Entity<WishlistItem>().HasOne(item => item.Product).WithMany().HasForeignKey(item => item.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Order>().HasIndex(order => order.Number).IsUnique();
        modelBuilder.Entity<Order>().Property(order => order.Subtotal).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(order => order.Shipping).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(order => order.Total).HasPrecision(18, 2);
        modelBuilder.Entity<Order>().Property(order => order.RowVersion).IsRowVersion();
        modelBuilder.Entity<OrderItem>().Property(item => item.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<OrderItem>().HasOne(item => item.Order).WithMany(order => order.Items)
            .HasForeignKey(item => item.OrderId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Address>().HasOne(address => address.User).WithMany(user => user.Addresses)
            .HasForeignKey(address => address.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}
