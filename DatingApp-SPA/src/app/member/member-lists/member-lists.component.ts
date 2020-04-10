
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-member-lists',
  templateUrl: './member-lists.component.html',
  styleUrls: ['./member-lists.component.css']
})
export class MemberListsComponent implements OnInit {
  users: User[];
  constructor(private alertify: AlertifyService, private userService: UserService,private route: ActivatedRoute) { }
  ngOnInit() {
    //this.loadUsers();
    this.route.data.subscribe(data => {
      this.users = data['users'];
    })
  }
  /*
  loadUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    //  console.log(this.users);
    }, err => { this.alertify.error(err); });
  }
  */
}

