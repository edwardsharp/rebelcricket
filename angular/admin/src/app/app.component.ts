import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../environments/environment';

import { SettingsService } from './settings/settings.service';
import { Settings } from './settings/settings';
import { AuthService } from './auth/auth.service';

// import { remote, ipcRenderer } from 'electron';
declare global {
  interface Window {
    require: any;
  }
}

let electron;
try{
  electron = window.require('electron');
}catch(e){}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // directives: [ NavComponent ]
})
export class AppComponent implements OnInit {
  title: string = 'demo-site';
  environment = environment;

  searchHidden: boolean = true;
  quoteHidden: boolean = true;
  
  subscription: Subscription;

  constructor(
    private location: Location,
    private settingsService: SettingsService,
    public router: Router,
    private authService: AuthService,
    private zone: NgZone
    // public dialog: MatDialog
  ) { 

    
    
    // this.subscription = this.authService.adminObservable().subscribe( (isAdmin:boolean) => {
    //   console.log('[app-component] authService.isAdmin$:',isAdmin);
    //   if(isAdmin){
    //   }else{
    //   }
    // });

    

    // var menu = electron.remote.Menu.buildFromTemplate([{
    //   label: 'View',
    //   submenu: [
    //     {
    //       label: 'Settings',
    //       click: () => {
    //         this.router.navigate(['/settings']);
    //       }  
    //     }
    //   ]
    // }]);


    // electron.remote.Menu.setApplicationMenu(menu);

    try{
      electron.ipcRenderer.on('viewMenu', (sender, arg) => {
        console.log('electron.ipcRenderer on viewMenu arg:',arg);
        this.zone.run(() => {
          this.router.navigate([arg]);
        });
      });
    }catch(e){}

  }

  ngOnInit() {
    this.settingsService.getSettings().then(settings => {
      if(settings.site_title && settings.site_title != ''){
        this.title = settings.site_title;
      }
    });

    console.log('[app.component] gonna checkIsLoggedIn...');
    this.authService.checkIsLoggedIn();
  }

  back() {
    this.location.back();
  }

  doSearch(query){
    // console.log('app.component doSearch e:',e);
  }

}
