import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any ={};
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }
  login(){
    this.authService.login(this.model).subscribe((next) => {
      this.alertify.success('Login successful!');     
    }, (err) => {
      this.alertify.error(err);
    }, () => {
      this.router.navigate(['/members']);
    });
  }
  loggedIn(){
    // const token = localStorage.getItem('token');
   // return !!token ; // return true if there is something inside token
   return this.authService.loggedIn();
  }
  logOut(){
    localStorage.removeItem('token');
    this.alertify.success('LOgged Out!!!');
    this.router.navigate(['/home']);
  }
}