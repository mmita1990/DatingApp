import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResults } from '../_models/pagination';
import { map } from 'rxjs/operators';


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
sendLike(id: number,recipientId: number){
  return this.http.post(this.baseUrl + 'Users/' + id + '/Like/' +  recipientId, {});
}

}
