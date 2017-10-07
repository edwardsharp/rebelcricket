import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AppTitleService } from './app-title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  // directives: [ NavComponent ]
})
export class AppComponent {
  title: string = 'rebelcricket';
  
  searchHidden: boolean = true;
  toggleSearch(): void {
    this.searchHidden = !this.searchHidden;
  }

  constructor(
    private location: Location,
    appTitleService: AppTitleService 
  ) { 
    appTitleService.title.subscribe( t => {
      console.log('title now t:',t);
      this.title = t;
    });
  }


  back() {
    this.location.back();
  }

  doSearch(query){
    // console.log('app.component doSearch e:',e);
  }

}
