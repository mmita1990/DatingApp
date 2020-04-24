import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResults } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';


@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

getUsers(page?, itemsPerPage?,userParams?, likeParam?): Observable<PaginatedResults<User[]>>{
  const paginatedResults: PaginatedResults<User[]> = new PaginatedResults<User[]>();
  let params = new HttpParams();
  if(page != null && itemsPerPage != null){
    params = params.append('pageNumber',page);
    params = params.append('pageSize',itemsPerPage);
  }
  if(userParams != null){
    params = params.append('minAge',userParams.minAge);
    params = params.append('maxAge',userParams.maxAge);
    params = params.append('gender',userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
  }
  if(likeParam === 'Likers'){
    params = params.append('likers','true');
  }
  if(likeParam === 'Likees'){
    params = params.append('likees','true');
  }
  return this.http.get<User[]>(this.baseUrl+'Users',{observe: 'response', params})
  .pipe(map(response => {
      paginatedResults.result = response.body;
      if(response.headers.get('Pagination') != null){
        paginatedResults.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResults;
  }));
}
getUser(id: number): Observable<User>{
  return this.http.get<User>(this.baseUrl+'Users/'+id);
}
updateUser(id: number, user: User){
  return this.http.put(this.baseUrl+'Users/'+id, user);
}
setMainPhoto(id: number, userId: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
}
deletePhoto(id: number, userId: number){
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id, {});
}

sendLike(id: number,recipientId: number){
  return this.http.post(this.baseUrl + 'Users/' + id + '/Like/' +  recipientId, {});
}
getMessages(id: number, page?, itemsPerPage?, messageContainer?){
  const paginatedResult: PaginatedResults<Message[]> = new PaginatedResults<Message[]>();
  let params = new HttpParams();
  params = params.append('MessageContainer',messageContainer);
  if(page != null && itemsPerPage != null){
    params = params.append('pageNumber',page);
    params = params.append('pageSize',itemsPerPage);
  }
  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages' ,{observe: 'response',params})
      .pipe(map( response => {
              paginatedResult.result = response.body;
              if(response.headers.get('Pagination') != null)
                { paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));}
            // console.log(paginatedResult);
                return paginatedResult;
      }))
}
getMessageThread(id: number, recipientId: number){
  return this.http.get<Message[]>(this.baseUrl + 'users/' + id+'/messages/thread/' +recipientId);
}
sendMessage(id: number, message: Message){
  return this.http.post(this.baseUrl + 'users/' +id+ '/messages',message);
}
deleteMessage(id: number, userId: number){
  return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
}
markAsRead(userId: number, msgId: number){
  return this.http.post(this.baseUrl +'users/' + userId + '/messages/' + msgId + '/read' ,{})
          .subscribe();
}

}
