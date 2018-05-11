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
    this.http.get(this.signInUrl).subscribe( data => {
      this.parseData(data);
      console.log('checkIsLoggedIn! data:',data,' isLoggedIn',this.isLoggedIn,' this.isAdmin',this.isAdmin);
    }, err => {
      console.log('[auth] isLoggedIn ERROR:',err);
      this.parseData(undefined);
    });
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
    //#todo: this.user will go away after page reload, so need to find is from somewhere more permanent...
    if((data 
      && data["userCtx"] 
      && data["userCtx"]["name"]
      && data["userCtx"]["name"] != '')
      || ( data && data["name"] && data["name"] != '' )
    ){
      
      //set this.user from the response cuz the page might have reloaded (and we lost this.user)
      if(!this.user && this.user != data["userCtx"]["name"]){
        this.user = data["userCtx"]["name"];
      }else if(!this.user && this.user != data["name"]){
        this.user = data["name"];
      }

      this.isLoggedIn = true;
      this._isLoggedIn.next(true);
      if( (data["userCtx"] 
        && data["userCtx"]["roles"] 
        && data["userCtx"]["roles"].includes("_admin"))
        || (data["roles"] && data["roles"].includes("_admin")) 
      ){
        this.isAdmin = true;
        this._isAdmin.next(this.isAdmin);
        // this.router.navigate(['/dashboard']);
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
