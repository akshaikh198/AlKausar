using System.Security.Claims;
using AlKausar.Api.Data;
using AlKausar.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/orders")]
public sealed class OrdersController(ShopDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Place(PlaceOrderRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var quantities = request.Items.GroupBy(item => item.ProductId)
            .ToDictionary(group => group.Key, group => group.Sum(item => item.Quantity));
        if (quantities.Values.Any(quantity => quantity > 100))
            return BadRequest(new { message = "The maximum quantity per product is 100." });

        await using var transaction = await db.Database.BeginTransactionAsync();
        var products = await db.Products.Include(product => product.Category)
            .Where(product => quantities.Keys.Contains(product.Id) && product.IsActive)
            .ToListAsync();
        if (products.Count != quantities.Count)
            return BadRequest(new { message = "One or more products are no longer available." });
        foreach (var product in products)
        {
            if (product.Stock < quantities[product.Id])
                return Conflict(new { message = $"Only {product.Stock} units of {product.Name} are currently available." });
        }

        var items = products.Select(product => new OrderItem
        {
            ProductId = product.Id,
            ProductName = product.Name,
            ProductImage = product.Image,
            UnitPrice = product.Price,
            Quantity = quantities[product.Id]
        }).ToList();
        var subtotal = items.Sum(item => item.UnitPrice * item.Quantity);
        var order = new Order
        {
            Number = $"AK-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid():N}"[..24].ToUpperInvariant(),
            UserId = userId,
            Subtotal = subtotal,
            Shipping = subtotal > 0 ? 399 : 0,
            Total = subtotal + (subtotal > 0 ? 399 : 0),
            Recipient = request.Recipient.Trim(),
            Phone = request.Phone.Trim(),
            AddressLine = request.AddressLine.Trim(),
            City = request.City.Trim(),
            State = request.State?.Trim() ?? "",
            Country = request.Country.Trim(),
            PostalCode = request.PostalCode?.Trim() ?? "",
            Items = items
        };
        foreach (var product in products) product.Stock -= quantities[product.Id];
        db.Orders.Add(order);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            return Conflict(new { message = "Inventory changed while you were checking out. Reload the catalog and try again." });
        }
        await transaction.CommitAsync();
        return Ok(new
        {
            order.Id,
            order.Number,
            order.UserId,
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
        });
    }
}
