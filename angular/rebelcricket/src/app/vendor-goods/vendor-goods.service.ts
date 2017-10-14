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

// import * as PouchDB from "pouchdb";
// import { PouchDB } from 'pouchdb';
// import 'pouchdb';
// declare var PouchDB:any;
// import PouchDB from 'pouchdb';
// var PouchDB = require("pouchdb");

// import 'pouchdb';
declare var PouchDB:any;
import { VendorGood } from './vendor-good';

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
      this.db = new PouchDB('vendor_goods', {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB('vendor_goods');
    }
  }

  clearVendorGoodsDb(){
  	this.db.destroy().then( resp => this.initDb() );
  }

 	getVendorGoods(){
		return this.db.allDocs({
		  include_docs: true,
		  attachments: false
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
