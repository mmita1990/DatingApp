using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegistrationDto
    {
        [Required]
        public string username {get;set;}

        [Required]
        [StringLength(8, ErrorMessage="Must specify a proper password")]
        public string password {get;set;}
    }
}