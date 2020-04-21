import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResults } from '../_models/pagination';
import { Message } from '../_models/message';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private authService: AuthService, private userService: UserService,
        private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      console.log(this.messages);
      this.pagination = data['messages'].pagination;
    });
  }
  loadMessages(){
    this.userService.getMessages(this.authService.decodedToken.nameid,this.pagination.currentPage,
      this.pagination.itemsPerPage,this.messageContainer).subscribe(
        (res: PaginatedResults<Message[]>) => {
            this.messages = res.result;
            console.log(this.messages);
            this.pagination = res.pagination;
      }, err => {
        this.alertify.error(err);
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.currentPage;
    this.loadMessages();
  }
  deleteMessage(id: number){
    this.alertify.confirm('Are you sure you want to delete the message ?', () => {     
      this.userService.deleteMessage(id,this.authService.decodedToken.nameid).subscribe(() =>{      
        this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
        this.alertify.success('Message has been deleted');
      }, err => { 
        this .alertify.error('failed to delete message');
      });
    });
  }
}
