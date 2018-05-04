import { Injectable } from '@angular/core';
import { Settings, PrivateSettings, OrderStatus, Service, GoogleApi } from './settings';
import { environment } from '../../environments/environment';

declare var PouchDB:any;

@Injectable()
export class SettingsService {

	db: any;
  privatedb: any;

  constructor() {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB(`${environment.couch_host}/settings`, {adapter: 'fruitdown'});
      this.privatedb = new PouchDB(`${environment.couch_host}/privatesettings`, {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB(`${environment.couch_host}/settings`);
      this.privatedb = new PouchDB(`${environment.couch_host}/privatesettings`);
    }

  	this.db.get('settings').then(result=>{
    }).catch(err =>{

      const defaultOrderStatuses = [
        new OrderStatus('Inbox',0),
        new OrderStatus('Needs Review',1),
        new OrderStatus('Backlog',2),
        new OrderStatus('In Progress',3),
        new OrderStatus('Ready',4),
        new OrderStatus('Done',5),
      ]

  		this.db.put(new Settings(defaultOrderStatuses, [] )).then(function (response) {
			  // handle response
			}).catch(function (err) {
			  console.log(err);
			});
  	});

    this.privatedb.get('privatesettings').then(result=>{
    }).catch(err =>{
      this.privatedb.put(new PrivateSettings(new GoogleApi('',''))).then(function (response) {
        // handle response
      }).catch(function (err) {
        console.log(err);
      });
    });
    
  }

 	getSettings(){
		return this.db.get('settings', {attachments: true});
 	}

 	saveSettings(settings:Settings){
 		return this.db.put(settings);
 	}
  
  getPrivateSettings(){
    return this.privatedb.get('privatesettings');
  }

  savePrivateSettings(privatesettings:PrivateSettings){
    return this.privatedb.put(privatesettings);
  }

}
