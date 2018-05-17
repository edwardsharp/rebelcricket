import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendorGoodItem, VendorGoodStyle } from './vendor-good';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VendorGoodsService {

	vendorGoods: Array<VendorGoodStyle>;

  stylesUrl: string = '/api/vendor_goods/styles';
  styleUrl: string = '/api/vendor_goods/style/';
  itemsUrl: string = '/api/vendor_goods/items/';

  constructor(private httpClient: HttpClient) {

  }

 	getStyles(catalog?:string): Observable<object>{ //:Array<{categoryName:string, count:string}>
		catalog = catalog || 'default';
    return this.httpClient.get(`${environment.api_host}${this.stylesUrl}`);
 	}

  getStyle(categoryName:string): Observable<object>{
    return this.httpClient.get(`${environment.api_host}${this.styleUrl}${categoryName}`);
  }

  getItems(styleCode:string){
    this.httpClient.get(`${environment.api_host}${this.styleUrl}${styleCode}`)
      .subscribe( data => {
        console.log('get',`${environment.api_host}${this.styleUrl}${styleCode}`,' response data:',data["data"]);
        return data["data"];
      }, err => {
        console.log('get',`${environment.api_host}${this.styleUrl}${styleCode}`,' ERR:',err);
      });
  }

}
