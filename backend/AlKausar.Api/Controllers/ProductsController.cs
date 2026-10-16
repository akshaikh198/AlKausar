using System.Text.Json;
using AlKausar.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlKausar.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(ShopDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? search, [FromQuery] string? category)
    {
        var query = db.Products.AsNoTracking().Include(product => product.Category).Where(product => product.IsActive);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(product => product.Name.Contains(term) || product.Description.Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(product => product.Category.Name == category);
        }

        var products = await query.OrderBy(product => product.Id).ToListAsync();
        return Ok(products.Select(ToProduct));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var product = await db.Products.AsNoTracking().Include(item => item.Category)
            .FirstOrDefaultAsync(item => item.Id == id && item.IsActive);
        return product is null ? NotFound() : Ok(ToProduct(product));
    }

    [HttpGet("/api/categories")]
    public async Task<IActionResult> Categories() =>
        Ok(await db.Categories.AsNoTracking().OrderBy(category => category.Name)
            .Select(category => new { category.Id, category.Name }).ToListAsync());

    internal static object ToProduct(Models.Product product) => new
    {
        product.Id,
        product.Name,
        category = product.Category.Name,
        type = product.Type,
        size = product.Size,
        product.Price,
        product.Stock,
        notes = JsonSerializer.Deserialize<string[]>(product.NotesJson) ?? [],
        product.Image,
        hoverImage = product.HoverImage,
        product.Description
    };
}
