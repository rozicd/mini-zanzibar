using Microsoft.EntityFrameworkCore;
using RBSBack.Exceptions;
using RBSBack.Models;

namespace RBSBack.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DbSet<User> _users;
        private readonly DatabaseContext _context;

        public UserRepository(DatabaseContext context)
        {
            _context = context;
            _users = context.Set<User>();
        }

        public async Task<User> Add(User user)
        {
            User existingUser = await _users.FirstOrDefaultAsync(p => p.Email == user.Email);
            if (existingUser != null)
            {
                throw new EmailAlreadyExistException($"{user.Email} is already in use");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;

        }

        public async Task<User> GetByEmailAndPassword(string email, string password)
        {
            User user = await _users.FirstOrDefaultAsync(p => p.Email == email);
            if (user == null)
            {
                throw new ResourceNotFoundException("User not found");
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            if (!passwordValid)
            {
                throw new ResourceNotFoundException("Invalid password");
            }

            return user;
        }

        public async Task<User> GetByEmail(string email)
        {
            User user = await _users.FirstOrDefaultAsync(p => p.Email == email);
            if (user == null)
            {
                throw new ResourceNotFoundException("User not found");
            }

            return user;
        }

        public async Task<User> GetById(Guid id)
        {
            User userEntity = await _users.FirstOrDefaultAsync(p => p.Id == id);
            if (userEntity == null)
            {
                throw new ResourceNotFoundException("User not found");
            }
            return userEntity;

        }
    }
}
