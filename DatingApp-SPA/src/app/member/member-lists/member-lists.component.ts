
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResults } from 'src/app/_models/pagination';
@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  pagination: Pagination;
  genderList = [{value: "male",display: "Males"}, {value: "female",display: "Females"}];
  userParams: any = {};

  constructor(private alertify: AlertifyService, private userService: UserService,private route: ActivatedRoute) { }
  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.userParams.gender = this.user.gender == "female" ? "male" : "female";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'LastActive';
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  resetFilters(){
    this.userParams.gender = this.user.gender == "female" ? "male" : "female";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;    
    this.userParams.orderBy = 'LastActive';
    this.loadUsers();
  }
  
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage,this.userParams)
    .subscribe((result: PaginatedResults<User[]>) => {
      this.users = result.result;
      this.pagination = result.pagination;
    //  console.log(this.users);
    }, err => { this.alertify.error(err); });
  }
  
}

