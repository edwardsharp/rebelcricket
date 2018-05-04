import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  redirectUrl: string;
  //`${environment.couch_ws_host}/register`;
	authUrl: string = '/auth/register';
  signInUrl: string = `${environment.couch_host}/_session`;
  sessionURL: string = '/auth/session';
	isLoggedIn: boolean = false;
  private _isLoggedIn: Subject<boolean>;
  isAdmin: boolean = false;
  private _isAdmin: Subject<boolean>;
  user: string;

  remoteDB: string;
  private _remoteDB: Subject<string>;
  authKey: string;

	// _user = {
 //    "_id": "org.couchdb.user:",
 //    "name": "",
 //    "type": "user",
 //    "roles": ["_admin"],
 //    "password": ""
	// }

  constructor(private http: HttpClient, private router: Router) { 
    this._isAdmin = new Subject<boolean>();
    this._isLoggedIn = new Subject<boolean>();
    this._remoteDB = new Subject<string>();
    if(!environment.production){
      this.isLoggedIn = true;
      this.isAdmin = true;
    }
  }

  adminObservable(): Observable<boolean> {
    return this._isAdmin.asObservable();
  }

  isLoggedInObservable(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

  signIn(user:string, password:string): void{
    this.user = user;
    this.http.post(this.signInUrl, {
      "name": user,
      "password": password
    }).subscribe( data => {
      this.parseData(data);
    }, err => {
      console.log('[auth] signIn ERR:',err);
      this.parseData(undefined);
    });
  }

  register(user: string, password: string): void{
    this.user = user;
  	this.http.post(this.authUrl, {
	    "_id": `org.couchdb.user:${user}`,
	    "name": user,
	    "type": "user",
	    "roles": ["rebelcricket"],
	    "password": password
		}).subscribe(data => {
      if(data["ok"]){
        this.signIn(user, password);
        // this.isLoggedIn = true;
        // this._isLoggedIn.next(true);
      }
    }, err => {
      console.log('[auth] register ERR:',err);
      this.parseData(undefined);
    });
  }

  checkIsLoggedIn(): void{
    if(environment.production){
      this.http.get(this.signInUrl).subscribe( data => {
        this.parseData(data);
      }, err => {
        console.log('[auth] isLoggedIn ERROR:',err);
        this.parseData(undefined);
      });
    }else{
      setTimeout(() => {
        this.user = 'devel';
        this.isLoggedIn = true;
        this._isLoggedIn.next(true);
        this.isAdmin = true;
        this._isAdmin.next(this.isAdmin);
      },500);
    }
  }

  remoteDBObservable(): Observable<string>{
    return this._remoteDB.asObservable();
  }

  getRemoteDB(): void{
    if(this.isAdmin){
      this.remoteDB = `${environment.couch_host}/orders`;
      this._remoteDB.next(this.remoteDB);
    }else if(this.isLoggedIn && this.authKey && this.authKey != ''){
      this.remoteDB = `${environment.couch_host}/userdb-${this.toHex(this.user)}`;
      this._remoteDB.next(this.remoteDB);
    }else{
      this.http.post(this.sessionURL, {}).subscribe(data => {
        if(data["auth_user"] && data["auth_key"]){
          this.user = data["auth_user"];
          this.authKey = data["auth_key"];
          this.signIn(this.user, this.authKey);
          this.remoteDB = `${environment.couch_host}/userdb-${this.toHex(this.user)}`;
          this._remoteDB.next(this.remoteDB);
        }
      }, err => {
        console.log('[auth] session ERR:',err);
        this.parseData(undefined);
      });

    }
  }

  //non-padding string2hex (like `Buffer.from(str, 'utf8').toString('hex')` in nodejs)
  private toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

  private parseData(data): void{
    if((data 
      && data["userCtx"] 
      && data["userCtx"]["name"] == this.user)
      || ( data && data["name"] == this.user )
    ){
      this.isLoggedIn = true;
      this._isLoggedIn.next(true);
      if( (data["userCtx"] 
        && data["userCtx"]["roles"] 
        && data["userCtx"]["roles"].includes("_admin"))
        || (data["roles"] && data["roles"].includes("_admin")) 
      ){
        this.isAdmin = true;
        this._isAdmin.next(this.isAdmin);
        this.router.navigate(['/dashboard']);
      }else{
        this.isAdmin = false;
        this._isAdmin.next(this.isAdmin);
      }
      if(this.redirectUrl && this.redirectUrl != ''){
        this.router.navigate([this.redirectUrl]);  
      }
    }else{
      //#todo: setup a new session key here?
      this.user = undefined;
      this.isLoggedIn = false;
      this._isLoggedIn.next(this.isLoggedIn);
      this.isAdmin = false;
      this._isAdmin.next(this.isAdmin);
    }
  }

}
