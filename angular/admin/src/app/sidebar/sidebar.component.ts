import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sidebar',
  template: `
  <mat-nav-list>

    <mat-list-item 
      *ngFor="let item of sidebarItems" 
      routerLink="{{item.href}}" 
      routerLinkActive="active" 
      [routerLinkActiveOptions]="{exact: true}"
      (click)="sidebarClose()">
      {{item.name}}
      <span class="flexfill"></span>
      <mat-icon>navigate_next</mat-icon>
    </mat-list-item>

  </mat-nav-list>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {

  sidebarItems: Array<{'name':string,'href':string}> = [
    {'name': 'Dashboard','href': '/dashboard'},
    {'name': 'Search','href': '/search'},
    {'name': 'Orders','href': '/dashboard/orders'},
    {'name': 'New Order','href': '/dashboard/order/new'},
    {'name': 'Uploads','href': '/dashboard/uploads'},
    {'name': 'Vendor Goods','href': '/vendor_goods'},
    {'name': 'Vendor Goods Import', 'href': '/dashboard/vendor_goods_import'},
    {'name': 'Settings','href': '/dashboard/settings'}
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