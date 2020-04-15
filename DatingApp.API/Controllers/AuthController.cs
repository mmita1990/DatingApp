using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo=repo;
            _config=config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegistrationDto userReg)
        {
            if(!ModelState.IsValid){
                return BadRequest("Model Error!!!");
            }
            userReg.username=userReg.username.ToLower();
            if(await _repo.UserExits(userReg.username))
                return BadRequest("Username already exists!!!");
            
            /*var userToCreate = new User{
                    Username=userReg.username
            };*/
            var userToCreate = _mapper.Map<User>(userReg);
            var createdUser =  await _repo.Register(userToCreate,userReg.password);
            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);
           // return StatusCode(201);
            return CreatedAtRoute("GetUser",new{Controller="Users",Id=createdUser.Id},userToReturn);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login (UserForloginDto userLogin)
        {
           // throw new Exception("Computer says no!!!");


            var userFromRepo = await _repo.Login(userLogin.Username.ToLower(), userLogin.Password);
            if(userFromRepo == null)
                return Unauthorized();
            // build up a token containing userid & username; server validates the token & get the data
            var claims = new []
            {
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescripter = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials=cred
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescripter);


            return Ok(new { token = tokenHandler.WriteToken(token)});

        }
    }
}