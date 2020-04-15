using System;
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

        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
         public DateTime LastActive { get; set; }
        public DateTime Created { get; set; }
        public UserForRegistrationDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}