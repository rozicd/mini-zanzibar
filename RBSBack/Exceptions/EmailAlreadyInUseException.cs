namespace RBSBack.Exceptions
{
    public class EmailAlreadyExistException : Exception
    {

        public EmailAlreadyExistException(string message)
            : base(message)
        {
        }
        public EmailAlreadyExistException()
            : base("Email Already Exists")
        {
        }
    }

}
