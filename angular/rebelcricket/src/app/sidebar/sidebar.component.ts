import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarItems: Array<{'name':string,'href':string}> = [
    {'name': 'Dashboard','href': '/dashboard'},
    {'name': 'Orders','href': '/dashboard/orders'},
    {'name': 'Vendor Goods','href': '/dashboard/vendor_goods'},
    {'name': 'Vendor Goods Import', 'href': '/dashboard/vendor_goods/import'}
  ];

  constructor() { }

  ngOnInit() {
  }

  // AppComponent's sidenav.close() hook event
  @Output() sidenavEvent: EventEmitter<any> = new EventEmitter();
  sidebarClose() {
    setTimeout(() => this.sidenavEvent.emit('close'), 150);
  }


}
