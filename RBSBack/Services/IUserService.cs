using RBSBack.Models;

namespace RBSBack.Services
{
    public interface IUserService
    {
        Task<User> Add(User user);
        Task<User> Login(string email, string password);
        Task<User> GetById(Guid id);
    }
}
