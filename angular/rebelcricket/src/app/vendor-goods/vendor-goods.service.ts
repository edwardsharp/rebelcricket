import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VendorGoodItem, VendorGoodStyle } from './vendor-good';
import { environment } from '../../environments/environment';

@Injectable()
export class VendorGoodsService {

	vendorGoods: Array<VendorGoodStyle>;

  stylesUrl: string = '/api/vendor_goods/styles';
  styleUrl: string = '/api/vendor_goods/style/';
  itemsUrl: string = '/api/vendor_goods/items/';

  constructor(private httpClient: HttpClient) {

  }

 	getStyles(catalog?:string){ //:Array<{categoryName:string, count:string}>
		catalog = catalog || 'default';
    this.httpClient.get(`${environment.api_host}${this.stylesUrl}`)
      .subscribe( data => {
        console.log('get',`${environment.api_host}${this.stylesUrl}`,' response data:',data);
        return data["data"];
      }, err => {
        console.log('get',`${environment.api_host}${this.stylesUrl}`,' ERR:',err);
        return [];
      });
 	}

  getStyle(categoryName:string){
    this.httpClient.get(`${environment.api_host}${this.styleUrl}${categoryName}`)
      .subscribe( data => {
        console.log('get',`${environment.api_host}${this.styleUrl}${categoryName}`,' response data:',data);
        return data["data"];
      }, err => {
        console.log('get',`${environment.api_host}${this.styleUrl}${categoryName}`,' ERR:',err);
      });
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
