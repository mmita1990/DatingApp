import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMainPhoto = new EventEmitter<string>();
  baseUrl = environment.apiUrl;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  currentMain : Photo;

  constructor(private authService: AuthService, private userService: UserService,private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }
  public fileOverBase(e:any): void{
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader(){
    this.uploader = new FileUploader({
      url : this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken : 'Bearer ' + localStorage.getItem('token'),
      isHTML5 : true,
      allowedFileType : ['image'],
      removeAfterUpload : true,
      autoUpload : false,
      maxFileSize : 10*1024*1024
    });
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false;};
    this.uploader.onSuccessItem = (item,response,status,headers) => {
      if(response) {
        const res: Photo  = JSON.parse(response);
        const photo = {
          id:res.id, url: res.url, isMain:res.isMain, dateAdded : res.dateAdded,description : res.description
        };
        this.photos.push(photo);
      }

    }
  }
  setMainPhoto(photo: Photo){
    this.userService.setMainPhoto(photo.id, this.authService.decodedToken.nameid).subscribe(() =>{
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      //this.getMainPhoto.emit(photo.url);
      this.authService.changeMemberPhoto(photo.url);
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
    }, err => { this.alertify.error(err)});
  }
  deletePhoto(id: number){
    this.alertify.confirm('Are you sure you want to delete this photo ?',() => {
      this.userService.deletePhoto(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.alertify.success('deletion successfull');
        this.photos.splice(this.photos.findIndex(p => p.id === id),1);
        // this.messages.splice(this.messages.findIndex(m => m.id == id), 1);
      }, err => { this.alertify.error(err); });
    });
  }
}
