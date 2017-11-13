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
import { OrderTagsComponent } from './orders/order-tags.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VendorGoodsComponent } from './vendor-goods/vendor-goods.component';
import { VendorGoodsDialogComponent } from './vendor-goods/vendor-goods-dialog.component';
import { VendorGoodsImportComponent } from './vendor-goods-import/vendor-goods-import.component';
import { GsheetService } from './gsheet.service';
import { SearchBoxComponent } from './search/search-box.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './settings/settings.service';
import { AppTitleService } from './app-title.service';
import { GfxComponent } from './gfx/gfx.component';
import { GfxService } from './gfx/gfx.service';

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
    component: OrdersComponent
  },
  { 
    path: 'dashboard/vendor_goods',
    redirectTo: '/dashboard/vendor_goods/default',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/vendor_goods/:catalog',
    component: VendorGoodsComponent,
    data: { order_id: 'order_id', line_item_id: 'line_item_id' }
  },
  {
    path: 'dashboard/vendor_goods_import',
    component: VendorGoodsImportComponent
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent
  },
  { 
    path: 'dashboard/gfx',
    redirectTo: '/dashboard/gfx/new',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/gfx/:id',
    component: GfxComponent
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
    OrderTagsComponent,
    DashboardComponent,
    VendorGoodsComponent,
    VendorGoodsDialogComponent,
    VendorGoodsImportComponent,
    SearchBoxComponent,
    SettingsComponent,
    GfxComponent,
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
  providers: [
    OrderService, 
    VendorGoodsService, 
    GsheetService, 
    SettingsService, 
    Title, 
    AppTitleService,
    GfxService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
