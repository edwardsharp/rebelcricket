import { Injectable } from '@angular/core';
import { Settings, OrderStatus, GoogleApi } from './settings';

declare var PouchDB:any;

@Injectable()
export class SettingsService {

	db: any;

  constructor() {
  	this.db = new PouchDB('settings');

  	this.db.get('settings').then(result=>{}).catch(err =>{
  		this.db.put(new Settings([new OrderStatus('default')], new GoogleApi('',''))).then(function (response) {
			  // handle response
			}).catch(function (err) {
			  console.log(err);
			});
  	});

  	
  }

 	getSettings(){
		return this.db.get('settings');
 	}

  addSettings(settings){
  	let retPromises = [];
  	for(let setting of settings){
  		retPromises.push(this.addSetting(setting));
  	}
  	return retPromises;
  }

  addSetting(setting){
  	return this.db.put(setting);
  }



}
