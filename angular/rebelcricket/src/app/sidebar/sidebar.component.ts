import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarItems: Array<{'name':string,'href':string}> = [
    {'name': 'Home','href': '/'},
    // {'name': 'About','href': '/about'},
    // {'name': 'Services','href': '/services'},
    {'name': 'Price Quote','href': '/quote'}
  ];


  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(){
  }

  // AppComponent's sidenav.close() hook event
  @Output() sidenavEvent: EventEmitter<any> = new EventEmitter();
  sidebarClose() {
    setTimeout(() => this.sidenavEvent.emit('close'), 150);
  }

}
