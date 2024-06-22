using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RBSBack.DTOS.Reponses;
using RBSBack.DTOS.Requests;
using RBSBack.Models;
using RBSBack.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RBSBack.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService) : base()
        {
            _userService = userService;

        }

        [HttpPost("")]
        public async Task<IActionResult> AddUser([FromForm] CreateUserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            User response = new User
            {
                Id = Guid.NewGuid(),
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Password = user.Password,
                Role = Role.USER,

            };

            

            User addedUser = await _userService.Add(response);
            UserDTO userDTO = new UserDTO
            {
                Id = addedUser.Id,
                Name = addedUser.Name,
                Surname = addedUser.Surname,
                Email = addedUser.Email,
                Role = addedUser.Role,
            };
            return Ok(userDTO);
        }





        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO credentials)
        {
            User user = await _userService.Login(credentials.Email, credentials.Password);

            if (user == null)
            {
                return Unauthorized();
            }
 

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Surname, user.Surname),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),

            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("zanzibarrbszanzibarminirbszanzibarrbszanzibarminirbs"));
            var credentialsJWT = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentialsJWT
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("jwtToken", tokenString, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Expires = DateTime.UtcNow.AddDays(30),

            });
            UserDTO userDTO = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Role = user.Role,
            };
            return Ok(userDTO);
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Append("jwtToken", "", new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Expires = DateTime.UtcNow.AddYears(-1),
            });

            return Ok();
        }


        [HttpGet("authenticate")]
        public async Task<ActionResult> Authenticate()
        {
            if (_user == null)
            {
                return Unauthorized();

            }
            else
            {
                return Ok(_user);
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(Guid id)
        {
            User user = await _userService.GetById(id);
            UserDTO response = new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                Email = user.Email,
                Role = user.Role,
            };
            return Ok(response);
        }


    }

}
