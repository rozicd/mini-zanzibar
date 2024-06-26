using RBSBack.Models;
using System.Data;
using System.Security.Claims;

namespace RBSBack.Middlewares
{
    public class ClaimsMiddleware
    {
        private readonly RequestDelegate _next;

        public ClaimsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (context.User.Identity is ClaimsIdentity identity)
            {
                LoggedUser loggedUser = new LoggedUser();
                if(identity.IsAuthenticated != false)
                {
                    loggedUser.Id = new Guid(identity.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                    loggedUser.Name = identity.FindFirst(ClaimTypes.Name)?.Value;
                    loggedUser.Surname = identity.FindFirst(ClaimTypes.Surname)?.Value;
                    loggedUser.Email = identity.FindFirst(ClaimTypes.Email)?.Value;
                    loggedUser.Role = Enum.Parse<Role>(identity.FindFirst(ClaimTypes.Role)?.Value);
                    context.Items["loggedUser"] = loggedUser;
                }
            }


            await _next(context);
        }

    }
}
