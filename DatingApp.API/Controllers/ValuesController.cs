using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;

        public ValuesController(DataContext context)
        {
            _context = context;
        }
        // GET api/values
        [HttpGet]
        /*public IActionResult GetValues()
        {
           // throw new Exception("Test exeception");
           // shows exception & the controller line no it occured
           // if lauchsettings eviornment has production instead of development then the stack trace of the exception is hidden

            //return new string[] { "value1", "value2" };
            var values = _context.Values.ToList(); //a thread is blocked; synchronous
            return Ok(values);
        }
**/
        public async Task<IActionResult> GetValues()
        {
            var values = await _context.Values.ToListAsync(); //Asynchronous
            return Ok(values);
        }
        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValues(int id)
        {
            var value = await _context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
           // return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
