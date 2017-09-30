import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

// import { VendorGoodsService } from '../vendor-goods/vendor-goods.service';
import { GsheetService } from '../gsheet.service';

// import 'gapi';
// import 'gapi.auth2';
// declare var gapi:any;

@Component({
  selector: 'app-vendor-goods-import',
  templateUrl: './vendor-goods-import.component.html',
  styleUrls: ['./vendor-goods-import.component.css']
})
export class VendorGoodsImportComponent implements OnInit, OnDestroy {

	loading: boolean = true;
	gsheetId: string = '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s';
	gsheetName: string = 'Sheet1';
  gsheetRange: string = '!A1:ZZ';
	data: any;
	//gsheet stuffz
	isSignedIn: boolean = false;

  pre: string[];
  // Client ID and API key from the Developer Console
  client_id: string = '89197182438-ubo90q5tik0pktvh88vcekks34knjcsa.apps.googleusercontent.com';
  api_key: string = 'AIzaSyCBoUSi-sA5Yofhcu4XRyviiyWJ0E2y9Ig';
  // Array of API discovery doc URLs for APIs used by the quickstart
  discovery_docs: Array<string> = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  scopes: string = "https://www.googleapis.com/auth/spreadsheets.readonly";



	// gapi: any;


  constructor(
  	private gsheetService: GsheetService,
	  private ngZone: NgZone) { }

  ngOnInit() {
  	// this.handleClientLoad('init');

  	window.my = window.my || {};
    window.my.namespace = window.my.namespace || {};
    window.my.namespace.publicFunc = this.publicFunc.bind(this);

  }
  ngOnDestroy() {
  	window.my.namespace.publicFunc = null;
  }

  publicFunc() {
  	console.log('hooray publicFunc!');
    this.ngZone.run(() => this.privateFunc());
  }

  privateFunc() {
    console.log('do private stuff!!');
  }

  getVendorGoodsFromGsheet(gsheetId:string): void {

    this.loading = true;
  	this.gsheetService.load(gsheetId).then((data) => {
    	this.data = data;
    	this.loading = false;
  	})
  	.catch((err) => {
  		this.loading = false;
  		console.error('o noz! getVendorGoods err:', err);
  	});


  }



  
  /**
   *  On load, called to load the auth2 library and API client library.
   */
  handleClientLoad(e) {
  	// console.log('handleClientLoad! gapi?:',gapi);
  	// setTimeout(() => gapi.load('client:auth2', this.initClient), 1000);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient() {
  	console.log('gonna initClient!!');
  	// gapi.client.init({
   //    apiKey: this.api_key,
   //    clientId: this.client_id,
   //    discoveryDocs: this.discovery_docs,
   //    scope: this.scopes
   //  }).then(function () {
   //  	console.log('initClient THEN!!')
   //    // Listen for sign-in state changes.
   //    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

   //    // Handle the initial sign-in state.
   //    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

   //  });
    
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  updateSigninStatus(isSignedIn) {
  	console.log('updateSigninStatus isSignedIn:',isSignedIn);
    if (isSignedIn) {
    	this.isSignedIn = true;
      this.listMajors();
    } else {
    	this.isSignedIn = false;
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  signIn() {
  	
  	// if(gapi.auth2.getAuthInstance()){
  	// 	console.log('gonna signIn');
  	// 	gapi.auth2.getAuthInstance().signIn();
  	// }else{
  	// 	console.log('NOT GONNA signIn :(');
  	// }
    
  }

  /**
   *  Sign out the user upon button click.
   */
  signOut() {
  	console.log('gonna signOut');
  	this.isSignedIn = false;
    // gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  appendPre(message) {
    this.pre.push(message)
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  listMajors() {
    // gapi.client.sheets.spreadsheets.values.get({
    //   spreadsheetId: this.gsheetId,
    //   range: this.gsheetRange,
    // }).then(function(response) {
    //   var range = response.result;
    //   if (range.values.length > 0) {
    //     this.appendPre('Name, Major:');
    //     let i: number = 0;
    //     for (i = 0; i < range.values.length; i++) {
    //       var row = range.values[i];
    //       // Print columns A and E, which correspond to indices 0 and 4.
    //       this.appendPre(row[0] + ', ' + row[4]);
    //     }
    //   } else {
    //     this.appendPre('No data found.');
    //   }
    // }, function(response) {
    //   this.appendPre('Error: ' + response.result.error.message);
    // });
  }

}
