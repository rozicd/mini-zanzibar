using RBSBack.Models;

namespace RBSBack.Repositories
{
    public interface IUserRepository
    {
        Task<User> Add(User user);
        Task<User> GetByEmailAndPassword(string email, string password);
        Task<User> GetById(Guid id);

    }
}
