import { Component, OnInit, OnDestroy } from '@angular/core';

// import { VendorGoodsService } from '../vendor-goods/vendor-goods.service';
import { GsheetService } from '../gsheet.service';

declare var gapi:any;

@Component({
  selector: 'app-vendor-goods-import',
  templateUrl: './vendor-goods-import.component.html',
  styleUrls: ['./vendor-goods-import.component.css']
})
export class VendorGoodsImportComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  gsheetId: string = '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s';
  gsheetRange: string = '!A1:ZZ';
  data: any;
  //gsheet stuffz
  gsheetIds: Array<{sheetId:string,title:string}> = [];
  sheetId: string;
  isSignedIn: boolean;
  loadingInterval: any;
  pre: string[] = [];
  // Client ID and API key from the Developer Console
  client_id: string = '89197182438-ubo90q5tik0pktvh88vcekks34knjcsa.apps.googleusercontent.com';
  api_key: string = 'AIzaSyCBoUSi-sA5Yofhcu4XRyviiyWJ0E2y9Ig';
  // Array of API discovery doc URLs for APIs used by the quickstart
  discovery_docs: Array<string> = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  scopes: string = "https://www.googleapis.com/auth/spreadsheets.readonly";

  constructor(private gsheetService: GsheetService) { }

  ngOnInit() {
    this.loadGapiScript();
    //these (hackz) are here to bump the view because angular is not tracking the change to isSignedIn from the gapi callbackz...
    this.runLoadingInterval(this.isSignedIn);
  }
  ngOnDestroy() {
  }


  runLoadingInterval(e){
    this.loadingInterval = setInterval(()=>{if(e){clearInterval(this.loadingInterval);this.loading=false}}, 100);
    setTimeout(()=>{console.log('giving up this.isSignedIn:');clearInterval(this.loadingInterval);this.loading=false;}, 5000);
  }

  loadGapiScript(){

    let needToLoadGapi: boolean = true;
    try{
      needToLoadGapi = !gapi;
    }catch(e){ }

    if(needToLoadGapi){
      let scriptElement = document.createElement("script");
      scriptElement.type = "text/javascript";
      scriptElement.src = 'https://apis.google.com/js/api.js';
      // scriptElement.async = true;
      // scriptElement.defer = true;
      scriptElement.onload = () => {
         gapi.load('client:auth2', () => {this.initClient()}); //note ()=>{} here to maintain 'this' references
      };
      scriptElement.onerror = (error: any) => {
        console.log('o noz! gapi load err:',error);
      };
      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    }
    
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClient() {    
    gapi.client.init({
      apiKey: this.api_key,
      clientId: this.client_id,
      discoveryDocs: this.discovery_docs,
      scope: this.scopes
    }).then( () => {
      // Listen for sign-in state changes. 
      gapi.auth2.getAuthInstance().isSignedIn.listen( _isSignedIn => 
        { this.updateSigninStatus(_isSignedIn) });
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
    
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  updateSigninStatus(isSignedIn:boolean) {
    console.log('updateSigninStatus isSignedIn:',isSignedIn);
    if (isSignedIn) {
      this.isSignedIn = true;
      this.loadSheetIds();
    } else {
      this.isSignedIn = false;
    }
    console.log('updateSigninStatus done! this.isSignedIn:',this.isSignedIn);
    // this.zomg = true;
  }

  /**
   *  Sign in the user upon button click.
   */
  signIn() {
    
    if(gapi.auth2.getAuthInstance()){
      gapi.auth2.getAuthInstance().signIn();
    }else{
      console.log('NOT GONNA signIn :(');
    }
    
  }

  /**
   *  Sign out the user upon button click.
   */
  signOut() {
    this.isSignedIn = false;
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  appendPre(message) {
    this.pre.push(message);
  }

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  loadSheetIds() {
    this.loading = true;
    gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.gsheetId
    }).then(response => {
        console.log('loadSheetIds response.result.sheets:',response.result.sheets);
        this.gsheetIds = [];
        for(let sheet of response.result.sheets){
          this.gsheetIds.push(
            {sheetId:sheet.properties.sheetId, title: sheet.properties.title}
          );
        }
        this.loading = false;
    }, err => {
        console.log('onoz! loadSheetIds() err: ' + err.result.error.message);
        this.appendPre('o noz! loadSheetIds() err: ' + err.result.error.message);
        this.loading = false;
    });

  }

  getVendorGoodsFromGsheet(gsheetId:string): void {

    this.loading = true;
    this.runLoadingInterval(this.loading);

    let gSheetName = this.gsheetIds.find(v => v.sheetId == this.sheetId);

    this.appendPre(`Loading ${gSheetName.title}${this.gsheetRange}...`); 
    // console.log('range is:',`${gSheetName.title}${this.gsheetRange}`);
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: this.gsheetId,
      range: `${gSheetName.title}${this.gsheetRange}`,
    }).then( (response) => {
      let range = response.result;
      if (range.values.length > 0) {
        this.appendPre(`Processing ${range.values.length} items...`); 
        // this.appendPre('- - - - - - - - - -');
        // let idx:any = range.values[0];
        // for (let i = 1; i < range.values.length; i++) {
        //   var row = range.values[i];
        //   // Print columns A and E, which correspond to indices 0 and 4.
        //   for(var x=0; x<row.length;x++){
        //     this.appendPre(`${idx[x]}: ${row[x]}`);

        //   }
        //   this.appendPre('- - - - - - - - - -');
        // }
      } else {
        this.appendPre('No data found.');
      }
      this.loading = false;
    }, (err) => {
      this.appendPre('Error: ' + err.result.error.message);
      this.loading = false;
    });
    
    // this.gsheetService.load(gsheetId).then((data) => {
    //   this.data = data;
    //   this.loading = false;
    // })
    // .catch((err) => {
    //   this.loading = false;
    //   console.error('o noz! getVendorGoods err:', err);
    // });


  }

  writeNewSheet() {
    
  }

}
