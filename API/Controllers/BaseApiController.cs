using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;

        protected IMediator Mediator =>
            _mediator ??= HttpContext.RequestServices.GetService<IMediator>()
                          ?? throw new InvalidOperationException("IMediator service is unavailable");

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            return result.IsSuccess switch
            {
                false when result.Code == 404 => NotFound(),
                true when result.Value != null => Ok(result.Value),
                _ => BadRequest(result.Error)
            };
        }
    }
}