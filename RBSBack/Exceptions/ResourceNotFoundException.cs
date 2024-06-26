namespace RBSBack.Exceptions
{
    public class ResourceNotFoundException : Exception
    {

        public ResourceNotFoundException(string message)
            : base(message)
        {
        }
        public ResourceNotFoundException()
           : base("Resource not found!")
        {
        }
    }

}
