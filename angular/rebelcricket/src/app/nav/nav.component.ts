import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  navItems: Array<{'name':string,'href':string}> = [
    {'name': 'Dashboard','href': '/dashboard'},
    {'name': 'Orders','href': '/dashboard/orders'},
    {'name': 'Vendor Goods','href': '/dashboard/vendor_goods'},
  ];

  constructor() { }

  ngOnInit() {
  }

  // AppComponent's sidenav.close() hook event
  @Output() sidenavEvent: EventEmitter<any> = new EventEmitter();
  navClose() {
    setTimeout(() => this.sidenavEvent.emit('close'), 150);
  }


}
