import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendorGoodItem, VendorGoodStyle } from './vendor-good';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VendorGoodsService {

  vendorGoods: Array<VendorGoodStyle>;

  stylesUrl: string = '/api/vendor_goods/styles/';
  styleUrl: string = '/api/vendor_goods/style/';
  itemsUrl: string = '/api/vendor_goods/items/';
  catalogUrl: string = '/api/vendor_goods/catalog';
  catalogsUrl: string = '/api/vendor_goods/catalogs';

  constructor(private httpClient: HttpClient) {

  }

  getStyles(catalog?:string): Observable<object>{ //:Array<{categoryName:string, count:string}>
    console.log('getStyles catalog:',catalog);
    catalog = catalog || 'default';
    console.log('getStyles url:',`${environment.api_host}${this.stylesUrl}${catalog}`);
    return this.httpClient.get(`${environment.api_host}${this.stylesUrl}${catalog}`);
   }

  getStyle(catalog: string, categoryName:string): Observable<object>{
    return this.httpClient.get(`${environment.api_host}${this.styleUrl}${catalog}/${categoryName}`);
  }

  getItems(styleNumber:string): Observable<object>{
    return this.httpClient.get(`${environment.api_host}${this.itemsUrl}${styleNumber}`);
  }

  getCatalogs(): Observable<object>{
    return this.httpClient.get(`${environment.api_host}${this.catalogsUrl}`);
  }

  getCatalog(name: string): Observable<object>{
    return this.httpClient.get(`${environment.api_host}${this.catalogUrl}/${name}`);
  }

}
