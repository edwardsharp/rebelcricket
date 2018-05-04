import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserModule, Title } from '@angular/platform-browser';
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
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { VendorGoodsComponent } from './vendor-goods/vendor-goods.component';
import { VendorGoodsDialogComponent } from './vendor-goods/vendor-goods-dialog.component';
import { SettingsService } from './settings/settings.service';
import { AppTitleService } from './app-title.service';


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


const appRoutes: Routes = [
  { 
    path: '',
    component: LandingComponent
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
  { path: '**', 
    redirectTo: '/' 
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    OrderDetailComponent,
    VendorGoodsComponent,
    VendorGoodsDialogComponent,
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
    UploadComponent
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
    VendorGoodsDialogComponent
  ],
  providers: [
    OrderService, 
    VendorGoodsService,  
    SettingsService, 
    Title, 
    AppTitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
