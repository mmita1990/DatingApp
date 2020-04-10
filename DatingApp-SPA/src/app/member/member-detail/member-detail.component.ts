import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
   user: User;
   galleryOptions: NgxGalleryOptions[];
   galleryImages: NgxGalleryImage[];
  constructor(private userService: UserService, private alertify: AlertifyService, private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      
      this.user = data['user'];
      console.log(this.user);
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      } ];

    this.galleryImages = this.getImages();

  }
  getImages(){
    const imageUrls = [];
    for (const p of this.user.photos) {
      imageUrls.push({
        small: p.url,
        medium: p.url,
        big: p.url,
        description: p.description
      });
    }
    console.log(imageUrls);
    return imageUrls;
  }
  /*
  loadUser(){
    //+ coverts the id which is returned as a string
   // alert(this.route.snapshot.params['id']);
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
      (u: User) => {this.user = u; },
      error => {this.alertify.error(error);}
      );
  }
  */
}
