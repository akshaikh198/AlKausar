using System.ComponentModel.DataAnnotations;

namespace AlKausar.Api.Models;

public sealed record RegisterRequest(
    [Required, StringLength(120, MinimumLength = 2)] string FullName,
    [Required, EmailAddress, StringLength(254)] string Email,
    [Required, MinLength(10), StringLength(72)] string Password,
    [StringLength(32)] string? Phone);

public sealed record LoginRequest([Required, EmailAddress] string Email, [Required] string Password);
public sealed record AuthResponse(string Token, string Role, string FullName, string Email);
public sealed record ProfileRequest(
    [Required, StringLength(120, MinimumLength = 2)] string FullName,
    [StringLength(32)] string? Phone);
public sealed record AddressRequest(
    [Required, StringLength(60)] string Label,
    [Required, StringLength(120)] string Recipient,
    [Required, StringLength(32)] string Phone,
    [Required, StringLength(240)] string AddressLine,
    [Required, StringLength(80)] string City,
    [StringLength(80)] string? State,
    [Required, StringLength(80)] string Country,
    [StringLength(20)] string? PostalCode,
    bool IsDefault);
public sealed record ProductRequest(
    [Required, StringLength(160)] string Name,
    [Required, StringLength(80)] string Category,
    [StringLength(80)] string? Type,
    [StringLength(40)] string? Size,
    [Range(typeof(decimal), "0.01", "1000000")] decimal Price,
    [Range(0, 1000000)] int Stock,
    [StringLength(1000)] string[]? Notes,
    [StringLength(500)] string? Image,
    [StringLength(500)] string? HoverImage,
    [StringLength(2000)] string? Description,
    bool IsActive);
public sealed record CategoryRequest([Required, StringLength(80)] string Name);
public sealed record OrderLineRequest([Range(1, int.MaxValue)] int ProductId, [Range(1, 100)] int Quantity);
public sealed record PlaceOrderRequest(
    [Required, MinLength(1), MaxLength(100)] OrderLineRequest[] Items,
    [Required, StringLength(120)] string Recipient,
    [Required, StringLength(32)] string Phone,
    [Required, StringLength(240)] string AddressLine,
    [Required, StringLength(80)] string City,
    [StringLength(80)] string? State,
    [Required, StringLength(80)] string Country,
    [StringLength(20)] string? PostalCode);
