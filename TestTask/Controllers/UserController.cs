using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestTask.Models;

namespace TestTask.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetUsersAsync()
        {
            var users = await _userManager.Users.ToArrayAsync();

            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task DeleteUserAsync([FromRoute] string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            await _userManager.DeleteAsync(user);
        }
    }
}