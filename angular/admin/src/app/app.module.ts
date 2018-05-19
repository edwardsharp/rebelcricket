import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DndModule} from 'ng2-dnd';
import { NgxCarouselModule } from 'ngx-carousel';
import 'hammerjs';

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
import { GfxComponent, NotesDialog } from './gfx/gfx.component';
import { AuthComponent } from './auth/auth.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';

import { 
  SliceVendorFilenamePipe, 
  SliceVendorFilenameDatePipe, 
  SliceVendorFilenameCategoryPipe,
  InspectorPipe } from './vendor-goods/slice-vendor-filename.pipe';
import { ReversePipe } from './orders/reverse.pipe';
import { ReplaceNewlinePipe } from './landing/replace-newline.pipe';
import { OrderFieldComponent } from './order-field/order-field.component';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { QuoteComponent } from './quote/quote.component';
import { UploadComponent } from './upload/upload.component';
import { UploadsComponent } from './uploads/uploads.component';
import { DownloadService } from './download.service';
import { SearchComponent } from './search/search.component';

const appRoutes: Routes = [
  { 
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'upload',
    component: UploadComponent
  },
  { 
    path: 'quote', 
    component: QuoteComponent
  },
  { 
    path: 'quote/:id', 
    component: QuoteComponent
  },
  { 
    path: 'quote/:id/:user/:key', 
    component: QuoteComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'services/:service',
    component: ServicesComponent
  },
  { 
    path: 'vendor_goods',
    redirectTo: 'vendor_goods/default',
    pathMatch: 'full'
  },
  {
    path: 'vendor_goods/:catalog',
    component: VendorGoodsComponent,
    data: { order_id: 'order_id', line_item_id: 'line_item_id' }
  },
  { 
  	path: 'dashboard',	
  	component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
  	path: 'dashboard/order/:id', 
  	component: OrderDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/vendor_goods_import',
    component: VendorGoodsImportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard/gfx',
    redirectTo: '/dashboard/gfx/new',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/gfx/:id',
    component: GfxComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/uploads',
    component: UploadsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'search',
    component: SearchComponent
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
    AuthComponent,
    NotesDialog,
    SliceVendorFilenamePipe,
    SliceVendorFilenameDatePipe,
    SliceVendorFilenameCategoryPipe,
    InspectorPipe,
    ReversePipe,
    ReplaceNewlinePipe,
    OrderFieldComponent,
    LandingComponent,
    AboutComponent,
    ServicesComponent,
    QuoteComponent,
    UploadComponent,
    UploadsComponent,
    SearchComponent
  ],
  imports: [
  	RouterModule.forRoot(
      appRoutes
      // ,{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,  
    AppMaterialModule,
    DndModule.forRoot(),
    NgxCarouselModule
  ],
  entryComponents: [
    VendorGoodsDialogComponent,
    NotesDialog
  ],
  providers: [
    AuthService,
    AuthGuard,
    OrderService, 
    VendorGoodsService, 
    GsheetService, 
    SettingsService, DownloadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
