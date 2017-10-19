import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { environment } from '../environments/environment';
import { AppTitleService } from './app-title.service';
import { SettingsService } from './settings/settings.service';
import { Settings } from './settings/settings';

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
  toggleSearch(): void {
    this.searchHidden = !this.searchHidden;
  }

  constructor(
    private location: Location,
    appTitleService: AppTitleService,
    private settingsService: SettingsService
  ) { 
    appTitleService.title.subscribe( t => {
      this.title = t;
    });
  }

  ngOnInit() {
    this.settingsService.getSettings().then(settings => {
      if(settings.site_title && settings.site_title != ''){
        this.title = settings.site_title;
      }
    });
  }

  back() {
    this.location.back();
  }

  doSearch(query){
    // console.log('app.component doSearch e:',e);
  }

}
