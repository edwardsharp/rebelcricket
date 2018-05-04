import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare var PouchDB:any;
import { VendorGood } from './vendor-good';
import { environment } from '../../environments/environment';

@Injectable()
export class VendorGoodsService {

	vendorGoods: Array<VendorGood>;
	db: any;

	//private http: Http
  constructor() {
  	this.initDb();
  }

  initDb(){
  	if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
  		console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB(`${environment.couch_host}/vendor_goods`, {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB(`${environment.couch_host}/vendor_goods`);
    }
  }

  clearVendorGoodsDb(){
  	this.db.destroy().then( resp => this.initDb() );
  }

 	getVendorGoods(catalog:string){
		catalog = catalog || 'default';
		catalog = catalog.toLowerCase();
		return this.db.allDocs({
		  include_docs: true,
		  attachments: false,
		  startkey: catalog,
		  endkey: `${catalog}\ufff0`
		});
 	}

  addVendorGoods(vendorGoods){
  	let retPromises = [];
  	for(let vendorGood of vendorGoods){
  		retPromises.push(this.addVendorGood(vendorGood));
  	}
  	return retPromises;
  }

  addVendorGood(vendorGood){
  	return this.db.put(vendorGood);
  }

  bulkAddVendorGoods(vendorGoods){
  	return this.db.bulkDocs(vendorGoods);
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
