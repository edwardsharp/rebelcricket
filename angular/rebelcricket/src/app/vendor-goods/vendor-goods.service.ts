// import { Injectable, OnInit } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import {HttpModule, Http, Response} from '@angular/http';
// // import 'rxjs/Rx';
// // import { Http, Response, Headers, RequestOptions } from '@angular/http';
// // import {Observable} from 'rxjs/Rx';

// // import 'rxjs/add/operator/map';
// // import 'rxjs/add/operator/catch';

// import {HttpModule, Http, Response} from '@angular/http';
// import {Observable} from 'rxjs/Rx';
// import 'rxjs/Rx';



import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class VendorGoodsService {

	vendorDatafiles: Array<string> = [
		'companycasuals.json',
		'1481360436454-companycasuals-infant___toddler.json',
		'1481360436454-companycasuals-outerwear.json',
		'1481360436454-companycasuals-activewear.json',
		'1481360436454-companycasuals-tall.json',
		'1481360436454-companycasuals-youth.json',
		'1481360436454-companycasuals-t_shirts_.json',
		'1481360436454-companycasuals-polos_knits.json',
		'1481360436454-companycasuals-woven_shirts.json',
		'1481360436454-companycasuals-caps.json',
		'1481360436454-companycasuals-workwear.json',
		'1481360436454-companycasuals-juniors___young_men.json',
		'1481360436454-companycasuals-ladies.json',
		'1481360436454-companycasuals-bags.json',
		'1481360436454-companycasuals-sweatshirts_fleece.json',
		'1481360436454-companycasuals-accessories.json',
		'1481355595461companycasuals.json'
	];

	dataFilePath: string = '/assets/vendor-goods/';

	selectedDatafile: string = this.vendorDatafiles[1];
	// vendorGoods: string[] = [];

  constructor(private http: Http) { }

  // ngOnInit(): void {
  //   // Make the HTTP request:
  //   // this.http.get(`${this.dataFilePath}${this.selectedDatafile}`).subscribe(data => {
  //   //   // Read the result field from the JSON response.
  //   //   this.vendorGoods = data['results'];
  //   // });

  // }

  getVendorGoods(){
	  // return this.http.get(`${this.dataFilePath}${this.selectedDatafile}`)
			// .map((res:Response) => res.json())
			// .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
		return this.http
      .get(`${this.dataFilePath}${this.selectedDatafile}`)
      .map((response) => response.json())
      .toPromise();
   }

 //  getVendorGoods() {
 //    //environment.couch_host
 //    // return Promise.resolve([]);
 //    let promise = new Promise((resolve, reject) => {
	//     this.http.get(`${this.dataFilePath}${this.selectedDatafile}`)
	//       .toPromise()
	//       .then(
	//         res => { // success!
	//         	console.log('http success! res:',res.map);
	//         	this.vendorGoods = res;
	//         	resolve();
	//         },
	//         msg => { // error :()
	//         	reject(msg);
	//         }
	//       );
	//   });
	//   return promise;
	// }

}
