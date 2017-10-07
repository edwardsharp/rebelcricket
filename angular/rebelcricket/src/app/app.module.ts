import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppMaterialModule } from './app-material.module';

import { OrderService } from './orders/order.service';
import { VendorGoodsService } from './vendor-goods/vendor-goods.service';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VendorGoodsComponent } from './vendor-goods/vendor-goods.component';
import { VendorGoodsDialogComponent } from './vendor-goods/vendor-goods-dialog.component';
import { VendorGoodsImportComponent } from './vendor-goods-import/vendor-goods-import.component';
import { GsheetService } from './gsheet.service';
import { SearchBoxComponent } from './search/search-box.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import { AppTitleService } from './app-title.service';
import { 
  SliceVendorFilenamePipe, 
  SliceVendorFilenameDatePipe, 
  SliceVendorFilenameCategoryPipe,
  InspectorPipe } from './vendor-goods/slice-vendor-filename.pipe';
import { ReversePipe } from './orders/reverse.pipe';

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
    path: 'dashboard/vendor_goods/import',
    component: VendorGoodsImportComponent
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent
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
    SidebarComponent,
    OrdersComponent,
    OrderDetailComponent,
    DashboardComponent,
    VendorGoodsComponent,
    VendorGoodsDialogComponent,
    VendorGoodsImportComponent,
    SearchBoxComponent,
    SettingsComponent,
    SliceVendorFilenamePipe,
    SliceVendorFilenameDatePipe,
    SliceVendorFilenameCategoryPipe,
    InspectorPipe,
    ReversePipe
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
    HttpModule,  
    AppMaterialModule
  ],
  entryComponents: [
    VendorGoodsDialogComponent
  	// DashboardComponent, OrdersComponent
  ],
  providers: [OrderService, VendorGoodsService, GsheetService, SettingsService, Title, AppTitleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
