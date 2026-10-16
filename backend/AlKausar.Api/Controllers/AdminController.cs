using System.Text.Json;
using AlKausar.Api.Data;
using AlKausar.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public sealed class AdminController(ShopDbContext db) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<IActionResult> Overview()
    {
        var orders = db.Orders.AsNoTracking();
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var recent = await orders.Include(order => order.Items).Include(order => order.User)
            .OrderByDescending(order => order.CreatedAt).Take(8)
            .Select(order => new
            {
                order.Id,
                order.Number,
                customer = order.User.FullName,
                order.CreatedAt,
                order.Status,
                order.Total,
                itemCount = order.Items.Sum(item => item.Quantity)
            }).ToListAsync();
        var salesByMonth = await orders.Where(order => order.Status != "Cancelled" && order.CreatedAt >= monthStart.AddMonths(-5))
            .GroupBy(order => new { order.CreatedAt.Year, order.CreatedAt.Month })
            .Select(group => new { group.Key.Year, group.Key.Month, Sales = group.Sum(order => order.Total) })
            .ToListAsync();
        return Ok(new
        {
            totalOrders = await orders.CountAsync(),
            pendingOrders = await orders.CountAsync(order => order.Status == "Pending"),
            totalCustomers = await db.Users.CountAsync(user => user.Role == "User"),
            productCount = await db.Products.CountAsync(),
            lowStockCount = await db.Products.CountAsync(product => product.Stock <= 5 && product.IsActive),
            salesToday = await orders.Where(order => order.Status != "Cancelled" && order.CreatedAt >= today).SumAsync(order => (decimal?)order.Total) ?? 0,
            salesThisMonth = await orders.Where(order => order.Status != "Cancelled" && order.CreatedAt >= monthStart).SumAsync(order => (decimal?)order.Total) ?? 0,
            recentOrders = recent,
            monthlySales = salesByMonth.OrderBy(row => row.Year).ThenBy(row => row.Month)
                .Select(row => new { month = $"{row.Year}-{row.Month:00}", row.Sales })
        });
    }

    [HttpGet("products")]
    public async Task<IActionResult> Products()
    {
        var products = await db.Products.AsNoTracking().Include(product => product.Category)
            .OrderBy(product => product.Id).ToListAsync();
        return Ok(products.Select(product => new
        {
            product.Id,
            product.Name,
            category = product.Category.Name,
            product.Type,
            product.Size,
            product.Price,
            product.Stock,
            notes = JsonSerializer.Deserialize<string[]>(product.NotesJson) ?? [],
            product.Image,
            hoverImage = product.HoverImage,
            product.Description,
            product.IsActive
        }));
    }

    [HttpPost("products")]
    public async Task<IActionResult> AddProduct(ProductRequest request)
    {
        var category = await GetOrAddCategory(request.Category);
        var product = MakeProduct(request, category.Id);
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return Created("/api/admin/products", product);
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductRequest request)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        var category = await GetOrAddCategory(request.Category);
        product.Name = request.Name.Trim();
        product.CategoryId = category.Id;
        product.Type = request.Type?.Trim() ?? "";
        product.Size = request.Size?.Trim() ?? "";
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.NotesJson = JsonSerializer.Serialize(request.Notes ?? []);
        product.Image = request.Image?.Trim() ?? "";
        product.HoverImage = request.HoverImage?.Trim() ?? "";
        product.Description = request.Description?.Trim() ?? "";
        product.IsActive = request.IsActive;
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(new { message = "This product changed in another request. Reload and retry your edit." });
        }
        return NoContent();
    }

    [HttpDelete("products/{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        if (await db.OrderItems.AnyAsync(item => item.ProductId == id))
        {
            product.IsActive = false;
            await db.SaveChangesAsync();
            return NoContent();
        }
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("categories")]
    public async Task<IActionResult> Categories() =>
        Ok(await db.Categories.AsNoTracking().OrderBy(category => category.Name)
            .Select(category => new { category.Id, category.Name, productCount = category.Products.Count }).ToListAsync());

    [HttpPost("categories")]
    public async Task<IActionResult> AddCategory(CategoryRequest request)
    {
        var name = request.Name.Trim();
        if (await db.Categories.AnyAsync(category => category.Name == name))
            return Conflict(new { message = "That category already exists." });
        var category = new Category { Name = name };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return Created("/api/admin/categories", category);
    }

    [HttpDelete("categories/{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await db.Categories.Include(item => item.Products).FirstOrDefaultAsync(item => item.Id == id);
        if (category is null) return NotFound();
        if (category.Products.Count != 0)
            return Conflict(new { message = "Move or remove this category's products before deleting it." });
        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("orders")]
    public async Task<IActionResult> Orders()
    {
        var orders = await db.Orders.AsNoTracking().Include(order => order.Items).Include(order => order.User)
            .OrderByDescending(order => order.CreatedAt).ToListAsync();
        return Ok(orders.Select(order => new
        {
            order.Id,
            order.Number,
            customer = order.User.FullName,
            email = order.User.Email,
            order.CreatedAt,
            order.Status,
            order.PaymentMethod,
            order.Subtotal,
            order.Shipping,
            order.Total,
            order.Recipient,
            order.Phone,
            order.AddressLine,
            order.City,
            order.State,
            order.Country,
            order.PostalCode,
            Items = order.Items.Select(item => new
            {
                item.Id,
                item.OrderId,
                item.ProductId,
                item.ProductName,
                item.ProductImage,
                item.UnitPrice,
                item.Quantity
            })
        }));
    }

    [HttpPatch("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var allowed = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
        if (!allowed.Contains(status, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "Status must be Pending, Processing, Shipped, Delivered, or Cancelled." });
        var order = await db.Orders.Include(item => item.Items).FirstOrDefaultAsync(item => item.Id == id);
        if (order is null) return NotFound();
        var normalizedStatus = allowed.Single(item => item.Equals(status, StringComparison.OrdinalIgnoreCase));
        if (order.Status == "Cancelled" && normalizedStatus != "Cancelled")
            return Conflict(new { message = "A cancelled order cannot be reopened." });
        if (order.Status != "Cancelled" && normalizedStatus == "Cancelled")
        {
            var productIds = order.Items.Select(item => item.ProductId).ToArray();
            var products = await db.Products.Where(product => productIds.Contains(product.Id)).ToListAsync();
            foreach (var item in order.Items)
            {
                var product = products.SingleOrDefault(candidate => candidate.Id == item.ProductId);
                if (product is not null) product.Stock += item.Quantity;
            }
        }
        order.Status = normalizedStatus;
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(new { message = "Inventory changed in another request. Reload the order and try again." });
        }
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<IActionResult> Users() =>
        Ok(await db.Users.AsNoTracking().OrderByDescending(user => user.CreatedAt)
            .Select(user => new { user.Id, user.FullName, user.Email, user.Phone, user.Role, user.IsActive, user.CreatedAt, orderCount = db.Orders.Count(order => order.UserId == user.Id) })
            .ToListAsync());

    [HttpPatch("users/{id:guid}/active")]
    public async Task<IActionResult> SetUserActive(Guid id, [FromBody] bool isActive)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        if (user.Role == "Admin") return Conflict(new { message = "Administrator accounts cannot be disabled here." });
        user.IsActive = isActive;
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<Category> GetOrAddCategory(string name)
    {
        var normalized = name.Trim();
        var existing = await db.Categories.FirstOrDefaultAsync(category => category.Name == normalized);
        if (existing is not null) return existing;
        var category = new Category { Name = normalized };
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return category;
    }

    private static Product MakeProduct(ProductRequest request, int categoryId) => new()
    {
        Name = request.Name.Trim(),
        CategoryId = categoryId,
        Type = request.Type?.Trim() ?? "",
        Size = request.Size?.Trim() ?? "",
        Price = request.Price,
        Stock = request.Stock,
        NotesJson = JsonSerializer.Serialize(request.Notes ?? []),
        Image = request.Image?.Trim() ?? "",
        HoverImage = request.HoverImage?.Trim() ?? "",
        Description = request.Description?.Trim() ?? "",
        IsActive = request.IsActive
    };
}
