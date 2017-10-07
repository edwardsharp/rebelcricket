import { Injectable } from '@angular/core';
import { Settings, OrderStatus, GoogleApi } from './settings';

declare var PouchDB:any;

@Injectable()
export class SettingsService {

	db: any;

  constructor() {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB('settings', {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB('settings');
    }

  	this.db.get('settings').then(result=>{

      console.log('HEY!!!!!!! settings result:',result);

    }).catch(err =>{

      const defaultOrderStatuses = [
        new OrderStatus('New'),
        new OrderStatus('Backlog'),
        new OrderStatus('Ready'),
        new OrderStatus('In Progress'),
        new OrderStatus('Needs Review'),
        new OrderStatus('Done')
      ]

  		this.db.put(new Settings(defaultOrderStatuses, new GoogleApi('',''))).then(function (response) {
			  // handle response
			}).catch(function (err) {
			  console.log(err);
			});
  	});

  	
  }

 	getSettings(){
		return this.db.get('settings');
 	}

 	saveSettings(settings:Settings){
 		return this.db.put(settings);
 	}
  // addSettings(settings){
  // 	let retPromises = [];
  // 	for(let setting of settings){
  // 		retPromises.push(this.addSetting(setting));
  // 	}
  // 	return retPromises;
  // }

  // addSetting(setting){
  // 	return this.db.put(setting);
  // }



}
