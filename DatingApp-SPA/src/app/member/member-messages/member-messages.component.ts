import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
   messages: Message[];
   newMessage: any = {};
  constructor(private userService: UserService,private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages(){
    const currUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(currUserId,this.recipientId)
      .pipe(tap(messages => {
        for (let i =0; i<messages.length; i++){
          if(!messages[i].isRead && messages[i].recipientId === currUserId){
            this.userService.markAsRead(currUserId,messages[i].id);
          }
        }
      }))
      .subscribe(messages =>{
         this.messages = messages;},
         err => {
           this.alertify.error(err);}
           );
  }
  sendMessage(){
    this.newMessage.recipientId= this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
    .subscribe((msg: Message) => {
      debugger;
    //  console.log(msg);
      this.messages.unshift(msg);
      this.newMessage.content = '';
    }, err => {this.alertify.error(err);});
  }
}
