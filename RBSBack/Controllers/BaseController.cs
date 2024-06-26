using Microsoft.AspNetCore.Mvc;
using RBSBack.Models;

namespace RBSBack.Controllers
{
    public class BaseController : ControllerBase
    {

        protected LoggedUser _user
        {
            get
            {
                return (LoggedUser)HttpContext.Items["loggedUser"];
            }
        }
        public BaseController()
        {


        }

    }

}
