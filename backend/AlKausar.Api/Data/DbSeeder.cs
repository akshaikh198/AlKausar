using System.Text.Json;
using AlKausar.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Data;

public static class DbSeeder
{
    private static readonly (string Name, string Type, string Size, decimal Price, string[] Notes, string Image, string Hover, string Description)[] SeedProducts =
    [
        ("Addictive Ambergris", "fregrance oil", "50ml", 399, ["Oud", "Saffron", "Amber"], "src/assets/product/Al-Kausar 100ml/bottle/Addictive Ambergris.jpeg", "src/assets/product/Al-Kausar 100ml/Addictive_Ambergris.jpeg", "A rich, resinous signature with smoky oud, saffron warmth, and a golden amber finish that lingers beautifully on skin."),
        ("Aqua 212", "Pure Attar", "50ml", 449, ["Musk", "jasmine", "Sandalwood"], "src/assets/product/Al-Kausar 100ml/bottle/Aqua_212.jpeg", "src/assets/product/Al-Kausar 100ml/Aqua_212.jpeg", "An elegant musky floral attar layered with rose and sandalwood for a warm and soft, intimate trail."),
        ("Aqua zoo", "Concentrated Attar", "50ml", 199, ["Saffron", "Leather", "Amber"], "src/assets/product/Al-Kausar 100ml/bottle/Aqua_Zoo.jpeg", "src/assets/product/Al-Kausar 100ml/Aqua_zoo.jpeg", "A bold and mysterious composition combining saffron glow with leather depth and amber warmth."),
        ("Black Heart", "Concentrated Attar", "100ml", 399, ["Rose", "Oud", "Musk"], "src/assets/product/Al-Kausar 100ml/bottle/Black_Heart (2).jpeg", "src/assets/product/Al-Kausar 100ml/bottle/Black_Heart.jpeg", "Romantic, dark, sensual luxury with warm cinematic lighting."),
        ("Dylan Blue", "Luxury Gift Set", "100ml", 299, ["Rose", "Amber", "Musk"], "src/assets/product/Al-Kausar 100ml/bottle/Dylan_Blue.jpeg", "src/assets/product/Al-Kausar 100ml/Dylan_Blue.jpeg", "A celebratory set crafted for gifting, with a floral-amber profile."),
        ("E Rouge", "Eau de Parfum", "100ml", 2799, ["Cedar", "Bergamot", "Patchouli"], "src/assets/product/Al-Kausar 100ml/bottle/E_Rouge.jpeg", "src/assets/product/Al-Kausar 100ml/E_Rouge.jpeg", "A fresh-to-woody statement with bright bergamot opening into cedar and patchouli."),
        ("Emarat Gold", "Pure Attar", "100ml", 299, ["Sandalwood", "Vanilla", "Musk"], "src/assets/product/Al-Kausar 100ml/bottle/Emarat_Gold.jpeg", "src/assets/product/Al-Kausar 100ml/Emarat_Gold.jpeg", "Smooth sandalwood softened by vanilla and musk for a creamy premium trail."),
        ("Good Night", "Pure Attar", "100ml", 249, ["Jasmine", "Oud", "White Musk"], "src/assets/product/Al-Kausar 100ml/bottle/good_night.jpeg", "src/assets/product/Al-Kausar 100ml/good_night.jpeg", "Floral depth meets Arabian oud in a balanced, modern mist."),
        ("Fantasia", "Attar Oil", "100ml", 299, ["Cedar", "Vetiver", "Patchouli"], "src/assets/product/Al-Kausar 100ml/bottle/Fantasia.jpeg", "src/assets/product/Al-Kausar 100ml/Fantasia.jpeg", "Clean woods-driven freshness with earthy depth and a long-lasting finish."),
        ("King Black", "Attar Oil", "100ml", 459, ["Oud", "Musk", "Amber"], "src/assets/product/Al-Kausar 100ml/bottle/King_Black.jpeg", "src/assets/product/Al-Kausar 100ml/King_Black.jpeg", "A collector-worthy fragrance with a deep, opulent oud signature."),
        ("Mud", "Attar Oil", "100ml", 1399, ["Amber", "Citrus", "Sandalwood"], "src/assets/product/Al-Kausar 100ml/bottle/Mud.jpeg", "src/assets/product/Al-Kausar 100ml/Mud.jpeg", "A bright, golden profile with citrus lift and warm sandalwood."),
        ("Mr Blueberry", "Attar Oil", "100ml", 399, ["Black Pepper", "Cherry", "Amber"], "src/assets/product/Al-Kausar 100ml/bottle/Mr_Blueberry.jpeg", "src/assets/product/Al-Kausar 100ml/Mr_Blueberry.jpeg", "A sleek fragrance with noir rose and soft spice."),
        ("Mukhallat Badar", "Pure Attar", "100ml", 799, ["Floral Musk", "Rose", "Amber"], "src/assets/product/Al-Kausar 100ml/bottle/Mukhallat_Badar.jpeg", "src/assets/product/Al-Kausar 100ml/Mukhallat_Badar.jpeg", "Soft rose petals and warm amber in a mellow, luxurious attar.")
    ];

    public static async Task SeedAsync(ShopDbContext db, IConfiguration configuration)
    {
        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(new[] { "Attar", "Gift Sets", "Perfume" }
                .Select(name => new Category { Name = name }));
            await db.SaveChangesAsync();
        }

        if (!await db.Products.AnyAsync())
        {
            var categories = await db.Categories.ToDictionaryAsync(category => category.Name, category => category.Id);
            foreach (var product in SeedProducts)
            {
                db.Products.Add(new Product
                {
                    Name = product.Name,
                    CategoryId = categories[product.Name == "Dylan Blue" ? "Gift Sets" : product.Name == "E Rouge" ? "Perfume" : "Attar"],
                    Type = product.Type,
                    Size = product.Size,
                    Price = product.Price,
                    Stock = 100,
                    NotesJson = JsonSerializer.Serialize(product.Notes),
                    Image = product.Image,
                    HoverImage = product.Hover,
                    Description = product.Description
                });
            }
            await db.SaveChangesAsync();
        }

        var adminEmail = configuration["AdminBootstrap:Email"]?.Trim().ToLowerInvariant();
        var adminPassword = configuration["AdminBootstrap:Password"];
        if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
        {
            if (System.Text.Encoding.UTF8.GetByteCount(adminPassword) > 72)
                throw new InvalidOperationException("AdminBootstrap:Password must not exceed 72 UTF-8 bytes.");

            var adminExists = await db.Users.AnyAsync(user => user.Email == adminEmail);
            if (!adminExists)
            {
                db.Users.Add(new User
                {
                    Email = adminEmail,
                    FullName = configuration["AdminBootstrap:FullName"] ?? "Store Administrator",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = "Admin"
                });
                await db.SaveChangesAsync();
            }
        }
    }
}
