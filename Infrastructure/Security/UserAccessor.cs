using System.Security.Claims;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class UserAccessor(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext) : IUserAccessor
{
    public string GetUserId()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier) ??
               throw new Exception("User not found");
    }

    public async Task<User> GetUserAsync()
    {
        return await dbContext.Users.FindAsync(GetUserId()) ??
               throw new UnauthorizedAccessException("User not logged in");
    }

    public async Task<User> GetUserWithPhotosAsync()
    {
        var userId = GetUserId();

        return await dbContext.Users
                   .Include(x => x.Photos)
                   .FirstOrDefaultAsync(x => x.Id == userId) ??
               throw new UnauthorizedAccessException("User not logged in");
    }
}