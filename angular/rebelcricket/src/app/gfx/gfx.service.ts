import { Injectable } from '@angular/core';


// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Gfx } from './gfx';

declare var PouchDB:any;

@Injectable()
export class GfxService {

	db: any;
  changes: any;

  /** stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Gfx[]> = new BehaviorSubject<Gfx[]>([]);
  get data(): Gfx[] { return this.dataChange.value; }

  constructor() {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB('gfx', {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB('gfx');
    }

  	this.db.get('gfx').then(result=>{
      console.log('gfx ctor, result:',result);
    }).catch(err =>{
  		this.db.put(new Gfx).then(function (response) {
			  // handle response
        console.log('init gfx result:',response);
			}).catch(function (err) {
			  console.log(err);
			});
  	});

    this.changes = this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', change => {
      // handle change
      console.log('zomg pouchDB change:',change);
      if(change.doc["_id"]){
        const copiedData = this.data.slice();
        const gfx = change.doc as Gfx;

        const idx = copiedData.indexOf(copiedData.find(d=> d._id == change.id));
        if(change.doc["_deleted"]){
          console.log('GFX CHANGE: SPLICING DELETE idx:',idx,' gfx:',gfx);
          copiedData.splice(idx, 1);
        }else if(idx > -1){
          console.log('GFX CHANGE: SPLICING UPDATE! idx:',idx,' gfx:',gfx);
          copiedData.splice(idx, 1, gfx);
        }else{
          console.log('GFX CHANGE: PUSHING! idx:',idx,' gfx:',gfx);
          copiedData.push(gfx);
        }
        console.log('pushing dataChange.next... setTimeout copiedData:',copiedData);
        this.dataChange.next(copiedData);
      }
    }).on('complete', function(info) {
      // changes() was canceled
    }).on('error', function (err) {
      console.log(err);
    });

  	
  }

 	getGfx(){
		return this.db.get('gfx');
 	}

 	saveGfx(gfx:Gfx){
 		return this.db.put(gfx);
 	}

}
