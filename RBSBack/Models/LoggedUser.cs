namespace RBSBack.Models
{
    public class LoggedUser
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public String Surname { get; set; }
        public String Email { get; set; }
        public Role Role { get; set; }
    }
}
