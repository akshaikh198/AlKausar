using System.Security.Claims;
using System.Text.Json;
using AlKausar.Api.Data;
using AlKausar.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/account")]
public sealed class AccountController(ShopDbContext db) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Profile()
    {
        var user = await db.Users.AsNoTracking().Include(item => item.Addresses).SingleAsync(item => item.Id == UserId);
        return Ok(new
        {
            user.Id,
            user.Email,
            user.FullName,
            user.Phone,
            user.Role,
            Addresses = user.Addresses.Select(address => new
            {
                address.Id,
                address.UserId,
                address.Label,
                address.Recipient,
                address.Phone,
                address.AddressLine,
                address.City,
                address.State,
                address.Country,
                address.PostalCode,
                address.IsDefault
            })
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(ProfileRequest request)
    {
        var user = await db.Users.SingleAsync(item => item.Id == UserId);
        user.FullName = request.FullName.Trim();
        user.Phone = request.Phone?.Trim() ?? "";
        await db.SaveChangesAsync();
        return Ok(new { user.Id, user.Email, user.FullName, user.Phone, user.Role });
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> Addresses() =>
        Ok(await db.Addresses.AsNoTracking().Where(address => address.UserId == UserId).OrderByDescending(address => address.IsDefault).ToListAsync());

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress(AddressRequest request)
    {
        if (request.IsDefault)
        {
            await ClearDefaultAddress();
        }
        var address = new Address
        {
            UserId = UserId,
            Label = request.Label.Trim(),
            Recipient = request.Recipient.Trim(),
            Phone = request.Phone.Trim(),
            AddressLine = request.AddressLine.Trim(),
            City = request.City.Trim(),
            State = request.State?.Trim() ?? "",
            Country = request.Country.Trim(),
            PostalCode = request.PostalCode?.Trim() ?? "",
            IsDefault = request.IsDefault
        };
        db.Addresses.Add(address);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Addresses), address);
    }

    [HttpPut("addresses/{id:int}")]
    public async Task<IActionResult> UpdateAddress(int id, AddressRequest request)
    {
        var address = await db.Addresses.FirstOrDefaultAsync(item => item.Id == id && item.UserId == UserId);
        if (address is null) return NotFound();
        if (request.IsDefault) await ClearDefaultAddress();
        address.Label = request.Label.Trim();
        address.Recipient = request.Recipient.Trim();
        address.Phone = request.Phone.Trim();
        address.AddressLine = request.AddressLine.Trim();
        address.City = request.City.Trim();
        address.State = request.State?.Trim() ?? "";
        address.Country = request.Country.Trim();
        address.PostalCode = request.PostalCode?.Trim() ?? "";
        address.IsDefault = request.IsDefault;
        await db.SaveChangesAsync();
        return Ok(address);
    }

    [HttpDelete("addresses/{id:int}")]
    public async Task<IActionResult> DeleteAddress(int id)
    {
        var address = await db.Addresses.FirstOrDefaultAsync(item => item.Id == id && item.UserId == UserId);
        if (address is null) return NotFound();
        db.Addresses.Remove(address);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("wishlist")]
    public async Task<IActionResult> Wishlist()
    {
        var products = await db.WishlistItems.AsNoTracking().Where(item => item.UserId == UserId)
            .Include(item => item.Product).ThenInclude(product => product.Category)
            .Select(item => item.Product).ToListAsync();
        return Ok(products.Select(ProductsController.ToProduct));
    }

    [HttpPost("wishlist/{productId:int}")]
    public async Task<IActionResult> AddToWishlist(int productId)
    {
        if (!await db.Products.AnyAsync(product => product.Id == productId && product.IsActive)) return NotFound();
        if (!await db.WishlistItems.AnyAsync(item => item.UserId == UserId && item.ProductId == productId))
        {
            db.WishlistItems.Add(new WishlistItem { UserId = UserId, ProductId = productId });
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpDelete("wishlist/{productId:int}")]
    public async Task<IActionResult> RemoveFromWishlist(int productId)
    {
        var item = await db.WishlistItems.FindAsync(UserId, productId);
        if (item is not null)
        {
            db.WishlistItems.Remove(item);
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpGet("orders")]
    public async Task<IActionResult> Orders()
    {
        var orders = await db.Orders.AsNoTracking().Where(order => order.UserId == UserId)
            .Include(order => order.Items).OrderByDescending(order => order.CreatedAt).ToListAsync();
        return Ok(orders.Select(order => new
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
        }));
    }

    private async Task ClearDefaultAddress()
    {
        var addresses = await db.Addresses.Where(address => address.UserId == UserId && address.IsDefault).ToListAsync();
        foreach (var address in addresses) address.IsDefault = false;
    }
}
