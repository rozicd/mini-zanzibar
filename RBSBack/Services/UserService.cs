using RBSBack.Models;
using RBSBack.Repositories;

namespace RBSBack.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

    

        public Task<User> Add(User user)
        {
            return _userRepository.Add(user);
        }

        public Task<User> GetById(Guid id)
        {
            return _userRepository.GetById(id);
        }

        public Task<User> Login(string email, string password)
        {
            return _userRepository.GetByEmailAndPassword(email, password);
        }
    }
}
