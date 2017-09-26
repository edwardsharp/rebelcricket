import { Component } from '@angular/core';
import { Location } from '@angular/common';

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

  constructor(private location: Location) { }

  
  back() {
    this.location.back();
  }

  doSearch(query){
    // console.log('app.component doSearch e:',e);
  }

}
