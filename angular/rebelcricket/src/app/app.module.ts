import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes }   from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppMaterialModule } from './app-material.module';

import { AppComponent } from './app.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderService } from './orders/order.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';


const appRoutes: Routes = [
  { path: 'order/:id',      component: OrderDetailComponent },
  {
    path: 'orders',
    component: OrdersComponent,
    data: { title: 'Orders List' }
  },
  { path: '',
    redirectTo: '/orders',
    pathMatch: 'full'
  }
  // ,
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    OrderDetailComponent
  ],
  imports: [
  	RouterModule.forRoot(
      appRoutes
      // ,{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule
  ],
  // entryComponents: [
  // 	OrdersComponent
  // ],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
