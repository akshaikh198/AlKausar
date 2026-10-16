namespace AlKausar.Api.Models;

public sealed class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Role { get; set; } = "User";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Address> Addresses { get; set; } = [];
}

public sealed class Address
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Label { get; set; } = "Home";
    public string Recipient { get; set; } = "";
    public string Phone { get; set; } = "";
    public string AddressLine { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string Country { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public bool IsDefault { get; set; }
}

public sealed class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public List<Product> Products { get; set; } = [];
}

public sealed class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string Type { get; set; } = "";
    public string Size { get; set; } = "";
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public string NotesJson { get; set; } = "[]";
    public string Image { get; set; } = "";
    public string HoverImage { get; set; } = "";
    public string Description { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public byte[] RowVersion { get; set; } = [];
}

public sealed class WishlistItem
{
    public Guid UserId { get; set; }
    public int ProductId { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public Product Product { get; set; } = null!;
}

public sealed class Order
{
    public int Id { get; set; }
    public string Number { get; set; } = "";
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string PaymentMethod { get; set; } = "Cash on delivery";
    public decimal Subtotal { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }
    public string Recipient { get; set; } = "";
    public string Phone { get; set; } = "";
    public string AddressLine { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string Country { get; set; } = "";
    public string PostalCode { get; set; } = "";
    public List<OrderItem> Items { get; set; } = [];
    public byte[] RowVersion { get; set; } = [];
}

public sealed class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public string ProductImage { get; set; } = "";
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}
