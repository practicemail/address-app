import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';

import { Friend } from '../models/friend';

@Injectable()
export class FriendService {
  friends: Friend[];
  // showDetails: Friend;
  private apiUrl = 'http://localhost:3000/api';

  // observable source
  private friendCreatedSource = new Subject<Friend>();
  private userDeletedSource = new Subject();
  showDetails: Subject<Friend> = new Subject<Friend>();
  // private friendDetailsChange: Subject<Friend> = new Subject<Friend>();

  // observable stream (umesto stream na kraju ide $)
  friendCreated$ = this.friendCreatedSource.asObservable();
  userDeleted$ = this.userDeletedSource.asObservable();

  constructor(private httpClient: HttpClient) {}
  // get all addresses
  getFriends(): Observable<Friend[]> {
    return this.httpClient.get(`${this.apiUrl}/friends`)
      .catch(this.handleError);
  }

  // get uploaded images
  getUploadedImgs(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/uploads`)
      .catch(this.handleError);
  }

  // create a user
  createFriend(friend): Observable<Friend> {
    return this.httpClient.post(`${this.apiUrl}/friends`, friend)
      .do(friend => this.friendCreated(friend))
      .catch(this.handleError);
  }

  // update a user
  updateFriend(friend, id): Observable<Friend> {
    return this.httpClient.put(`${this.apiUrl}/friends/${id}`, friend)
      .catch(this.handleError);
  }


  // delete a user
  deleteFriend(id: number, avatar: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/friends/${id}/${avatar}`)
      .do(res => this.userDeleted(id))
      .catch(this.handleError);
  }

  showFriendDetails(data) {
    return this.showDetails.next(data);
  }

  // The user was created. Add this info to our stream.
  friendCreated(friend: any) {
    // console.log('Friend has been created');
    this.friendCreatedSource.next(friend);
  }

  // The user was deleted. Add this info to our stream.
  userDeleted(id: number) {
    // console.log('User has been deleted');
    this.userDeletedSource.next(id);
  }

  //handle any errors from the API
  private handleError(err) {
    let errMessage: string;

    //err instanceof HttpErrorResponse ???????
    if (err) {
      let body = err || '';
      let error = body.error || JSON.stringify(body);

      errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
    } else {
      errMessage = err.message ? err.message : err.toString();
    }

    return Observable.throw(errMessage);
  }
}
