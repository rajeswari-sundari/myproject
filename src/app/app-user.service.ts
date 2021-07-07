import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from  '../environments/environment';
import { Observable, Observer, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

   loggedIn = new  Subject();

  // get isLoggedIn() {
  //   return this.loggedIn.asObservable(); // {2}
  //   }
 // private userState = this.userSubject.asObservable();

  constructor(private _serviceClient : HttpClient) { }

  // public setUser(user:AppUser) {
  //   this.userSubject.next(user);
  // }

  // public getUser() {
  //   return this.loggedIn.asObservable();
  // }
  getValidUser(userID) : Observable<any[]> {
    return this._serviceClient.get<any>(environment.APIURL + 'Login/CheckValidUser?userID='+userID).pipe();
}
  
}

export interface AppUser{userID?:any,userName?:string}