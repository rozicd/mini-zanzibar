namespace RBSBack.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {

            Console.WriteLine(exception.Message);

            if (exception is ArgumentException)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
            }

            else
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            }
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync($"Error : {exception.Message}");
        }
    }

}
