﻿namespace RBSBack.DTOS.Requests
{
    public class CreateUserDTO
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
