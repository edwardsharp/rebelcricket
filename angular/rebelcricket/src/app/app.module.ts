import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppMaterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderService } from './orders/order.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VendorGoodsComponent } from './vendor-goods/vendor-goods.component';
import { SearchBoxComponent } from './search/search-box.component';

const appRoutes: Routes = [
  { 
  	path: 'dashboard',	
  	component: DashboardComponent 
  },
  { 
  	path: 'dashboard/order/:id', 
  	component: OrderDetailComponent
  },
  {
    path: 'dashboard/orders',
    component: OrdersComponent,
    data: { title: 'Orders List' }
  },
  {
    path: 'dashboard/vendor_goods',
    component: VendorGoodsComponent
  },
  { 
  	path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
  // ,
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    OrdersComponent,
    OrderDetailComponent,
    DashboardComponent,
    VendorGoodsComponent,
    SearchBoxComponent
  ],
  imports: [
  	RouterModule.forRoot(
      appRoutes
      // ,{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule
  ],
  // entryComponents: [
  // 	OrdersComponent
  // ],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
