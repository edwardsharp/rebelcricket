import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  subscription: Subscription;

  sidebarItems: Array<{'name':string,'href':string}>;

  sidebarRegularItems: Array<{'name':string,'href':string}> = [
    {'name': 'Home','href': '/'},
    // {'name': 'About','href': '/about'},
    // {'name': 'Services','href': '/services'},
    {'name': 'Price Quote','href': '/quote'}
  ];
  sidebarAdminItems: Array<{'name':string,'href':string}> = [
    {'name': 'Dashboard','href': '/dashboard'},
    {'name': 'Orders','href': '/dashboard/orders'},
    {'name': 'New Order','href': '/dashboard/order/new'},
    {'name': 'Uploads','href': '/dashboard/uploads'},
    {'name': 'Vendor Goods','href': '/vendor_goods'},
    {'name': 'Vendor Goods Import', 'href': '/dashboard/vendor_goods_import'},
    {'name': 'Settings','href': '/dashboard/settings'}
  ];


  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.sidebarItems = this.sidebarRegularItems;

    this.subscription = this.authService.adminObservable().subscribe( (isAdmin:boolean) => {
      console.log('[sidebar] authService.isAdmin$:',isAdmin);
      if(isAdmin){
        this.sidebarItems = this.sidebarRegularItems.concat(this.sidebarAdminItems);
      }else{
        this.sidebarItems = this.sidebarRegularItems;
      }
    });

    this.authService.checkIsLoggedIn();
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  // AppComponent's sidenav.close() hook event
  @Output() sidenavEvent: EventEmitter<any> = new EventEmitter();
  sidebarClose() {
    setTimeout(() => this.sidenavEvent.emit('close'), 150);
  }


}
