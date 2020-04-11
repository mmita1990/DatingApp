import { Injectable } from "@angular/core";
import { User } from '../_models/user';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberEditResolver implements Resolve<User>{
 
    constructor(private userService: UserService,private alertify: AlertifyService,
        private authService: AuthService, private route: Router) { }

    resolve(route:ActivatedRouteSnapshot): Observable<User> {
       return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
           catchError(err =>{
               this.alertify.error=err;
               this.route.navigate(['/members']);
               return of(null);
           })
       )
    }
}