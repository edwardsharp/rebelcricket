import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar, MatRipple } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('signInRipple') signInRipple: MatRipple;
  @ViewChild('registerRipple') registerRipple: MatRipple;
  emailFormControl = new FormControl('', [
    Validators.required
    // ,Validators.email
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordsNoMatch: boolean;

  debug?: boolean;
  canRegister?: boolean;
  // isLoggedIn?: boolean;
  authHost?: string;
  authPath?: string;
  authUrl?: string;
  validateTokenPath?: string;
  apiKey?: string;
  headers?: any;
  
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  hasTOS?: boolean;
  tos?: any;
  tosChecked?: boolean;
  hasMailingList?: boolean;
  mailingList?: any;
  mailingListChecked?: boolean;
  selectedIndex?: number;
  info?: string;

  isLoggedIn: Subscription;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    //#todo: get hosTOS && hasMailingList from settings...
    this.hasTOS = true;
    this.hasMailingList = true;

    this.isLoggedIn = this.authService.isLoggedInObservable().subscribe( (isLoggedIn:boolean) => {
      if(isLoggedIn){
        this.snackBar.open('Logged in successfully!', '', {
          duration: 3000
        });
      }
    });
  }

  ngOnDestroy(){
    this.isLoggedIn.unsubscribe();
  }

  checkIsLoggedIn(){
    this.authService.checkIsLoggedIn();
  }

  signInTrigger(){
    try{
      this.signInRipple["ripple"].launch({
        persistent: false,
        centered: true
      });
    }catch(e){}
    this.signIn();
  }

  signIn(){
    this.emailFormControl.markAsTouched();
    this.passwordFormControl.markAsTouched();
    if(this.email 
      && this.email != ''
      && this.password
      && this.password != ''
    ){
      this.authService.signIn(this.email, this.password);
    }
  }

  registerTrigger(){
    try{
      this.registerRipple["ripple"].launch({
        persistent: false,
        centered: true
      });
    }catch(e){}
    this.register();
  }

  register(){
    this.passwordsNoMatch = this.password != this.passwordConfirmation;
    console.log('register ugh this.passwordsMatch:',this.passwordsNoMatch);
    this.emailFormControl.markAsTouched();
    this.passwordFormControl.markAsTouched();
    if(this.email 
      && this.email != '' 
      && this.password 
      && this.password != '' 
      && !this.passwordsNoMatch
    ){
      this.authService.register(this.email,this.password);
    }
  }
}
