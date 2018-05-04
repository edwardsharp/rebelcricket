import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { Order } from './order';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

declare var PouchDB:any;


@Injectable()
export class OrderService {

  db: any;
  total_rows: number;
  changes: any;

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  get data(): Order[] { return this.dataChange.value; }
  remoteDBSubscription: Subscription;
  isReplicating: boolean;
  remoteDB: string;

  isAdminSubscription: Subscription;
  replication: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB('orders', {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB('orders');
    }
    
    // PouchDB.plugin(require('pouchdb-find'));

    this.db.createIndex({
      index: {
        fields: ['_id','name']
      }
    }).then(result => {
      //console.log('index created! result',result);
    }).catch(err => {
      console.log('o noz! this.db.createIndex err:',err);
    });

    this.changes = this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', change => {
      if(parseInt(change.doc["_id"], 36)){
        this.docChanged(change.doc);
      }
    }).on('error', function (err) {
      console.log('[order.service] changes error!',err);
    });

    // this.changes.cancel(); // whenever you want to cancel

    this.isAdminSubscription = this.authService.adminObservable().subscribe( (isAdmin:boolean) => {
      if(isAdmin){
        console.log('[order.service] isAdmin! gonna SYNC from remote db!');
        // do one way, one-off sync from the server until completion
        
        this.db.sync(`${environment.couch_host}/orders`, { live: true, retry: true })
          .on('change', change => {
            console.log('[order.service] sync change!',change);
            // if(change.doc["_id"]){
            //   this.docChanged(change.doc);
            // }
          })
          .on('error', function (err) {
            console.log('[order.service] sync error!',err);
          });
        // this.db.replicate.from(`${environment.couch_host}/orders`).on('complete', function(info) {
        //   // then two-way, continuous, retriable sync
        //   console.log('[order.service] gonna try to replicate.to:',`${environment.couch_host}/orders`);
        //   this.db.replicate.to(`${environment.couch_host}/orders`, { live: true, retry: true })
        //     .on('change', change => {
        //       console.log('sync replicate.to change!',change);
        //       // if(change.doc["_id"]){
        //       //   this.docChanged(change.doc);
        //       // }
        //     })
        //     .on('error', function (err) {
        //       console.log('[order.service] replicate.to error!',err);
        //     });
        // }).on('error', function (err) {
        //   console.log('[order.service] replicate.from error!',err);
        // });
      }
    })

    this.remoteDBSubscription = this.authService.remoteDBObservable().subscribe( (remoteDB:string) => {
      console.log('orders remoteDBSubscription remoteDB:',remoteDB);
      if(this.remoteDB != remoteDB || !this.isReplicating){
        this.remoteDB = remoteDB;
        this.replicate(remoteDB);
      }
    });
  }

  onSyncError(err){
    console.log('orders sync error! err:',err);
  }
  docChanged(doc){
    const copiedData = this.data.slice();
    const order = doc as Order;

    const idx = copiedData.indexOf(copiedData.find(d=> d._id == doc._id));
    if(doc["_deleted"]){
      console.log('ORDER CHANGE: SPLICING DELETE idx:',idx,' order:',order);
      copiedData.splice(idx, 1);
    }else if(idx > -1){
      console.log('ORDER CHANGE: SPLICING UPDATE! idx:',idx,' order:',order);
      copiedData.splice(idx, 1, order);
    }else{
      console.log('ORDER CHANGE: PUSHING! idx:',idx,' order:',order);
      copiedData.push(order);
    }
    console.log('pushing dataChange.next... setTimeout copiedData:',copiedData);
    this.dataChange.next(copiedData);
  }
                     // : Promise<any>   ??
  saveOrder(order:Order){

    return this.db.put(order);
  }

  saveQuote(order:Order){
    if(  order 
      && order.name && order.name != ''
      && order.email && order.email != '' 
    ){
      //ready to replicate!
      if(!this.isReplicating){
        console.log('saveOrder gonna getRemoteDB (not currently replicating)');
        this.authService.getRemoteDB();
      }
      if(  (order.auth_user == undefined || order.auth_user == '') 
        && (order.auth_key == undefined || order.auth_key == '')
        && this.authService.user && this.authService.authKey
      ){
        console.log('gonna add auth_user && auth_key to order!');
        order.auth_user = this.authService.user;
        order.auth_key = this.authService.authKey;
      }
    }
    return this.db.put(order);
  }

  addAttachment(docId:string, attachmentId:string, rev: string, attachment: Blob,type:string){
    // var attachment = new Blob(['Is there life on Mars?'], {type: 'text/plain'});
    return this.db.putAttachment(docId, attachmentId, rev, attachment, type);
  }

  removeAttachment(docId:string, attachmentId:string, rev: string){
    console.log('gonna try an remove an attachment and then, yeah...',docId,attachmentId,rev);
    return this.db.removeAttachment(docId, attachmentId, rev);
  }

  getOrder(id: string): Promise<Order> {
    console.log('[orderService] getOrder id:',id);
    return this.db.allDocs({
      include_docs: true,
      attachments: true,
      descending: true,
      // revs: true,
      // revs_info: true,
      // open_revs: 'all',
      key: id
    }).then(response => {
      console.log('[orderService] getOrder return response:',response);
      if(response.rows && response.rows[0] && response.rows[0].doc && response.rows[0].id == id){
        console.log('[orderService] found order doc:',response.rows[0].doc);
        return response.rows[0].doc as Order;
      }else{
        console.log('[orderService] gonna return a new order!');
        return new Order;
      }
    }, err => {
      console.log('o noz! order.service getOrder err:',err);
    });
  }

  getQuote(id:string, user:string, key:string): Promise<Order> {
    if(user && user != '' && key && key != ''){
      let _quote_db;
      if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
        _quote_db = new PouchDB(`${environment.couch_host}/userdb-${this.toHex(user)}`, {adapter: 'fruitdown', auth: {username: user, password: key}});
      }else{
        _quote_db = new PouchDB(`${environment.couch_host}/userdb-${this.toHex(user)}`, {auth: {username: user, password: key}});
      }
      return _quote_db.get(id).then(doc => {
        this.db.replicate.from(`${environment.couch_host}/userdb-${this.toHex(user)}`, {
          live: false,
          retry: true,
          auth: {username: user, password: key}
        }).on('active', () => {
          console.log('[order.service] replicatin from user-db!');
          // replicate resumed (e.g. new changes replicating, user went back online)
        });
        
        this.db.replicate.to(`${environment.couch_host}/userdb-${this.toHex(user)}`, {
          live: true,
          retry: true,
          auth: {username: user, password: key}
        }).on('active', () => {
          console.log('[order.service] REPLICATION active for existing quote!');
          this.isReplicating = true;
          // replicate resumed (e.g. new changes replicating, user went back online)
        });

        return doc as Order;
      }, err => {
        return new Order;
      });
    }else{
      return this.getOrder(id);
    }
  }

  getOrders(limit:number,skip:number): void {
    //environment.couch_host
    // return Promise.resolve(ORDERS);
    return this.db.allDocs({
      include_docs: true,
      attachments: false,
      descending: true,
      limit: limit,
      skip: skip
    }).then(response => {
      console.log('order.service getOrders returning response.rows:',response.rows);
      const retItems = response.rows
        .filter(row => !row["id"].startsWith('_design'))
        .map(row => row.doc as Order);
      this.total_rows = retItems.length;
      console.log('order.service getOrders returning retItems:',retItems);
      this.dataChange.next(retItems);

    });
  }

  removeOrder(order: Order): Promise<any>{
    return this.db.remove(order._id, order._rev);
  }


  find(q:string): Observable<any[]> {
    let regexp = new RegExp(q, 'i');
    return this.db.find({
      // selector: {name: q},
      // var regexp = new RegExp(keyword, 'i');
      // {name: {'$regex': regexp}};
      selector: {name: {$regex: regexp}},
      fields: ['_id', 'name'],
      // sort: [{_id: 'desc'}],
      // limit: 25,
      // skip: 0,
    }).then(res => res["docs"]);
  }

  getOrderRevs(id:string): Promise<any> {
    return this.db.get(id, {
      revs: true, 
      open_revs: 'all' // this allows me to also get the removed "docs"
    });
  }

  getOrderHistory(docId: string, revision_ids:Array<string>): Promise<any> {
    // let optz = { docs: [] };
    // for(let revId of revision_ids){
    //   optz.docs.push({ id: docId, _rev: revId});
    // }
    // console.log('zomg optz:',optz);
    // return this.db.bulkGet(optz);

    return this.db.changes({
      doc_ids: [docId],
      limit: 50,
      since: 0,
      revs: true, 
      open_revs: 'all'
    });
  }

  getRevsDiff(docId:string, revA:string, revB:string): Promise<any> {
    let optz = {}
    optz[docId] = [revA, revB];
    return this.db.revsDiff(optz);
  }

  replicate(remoteDB:string): void{
    console.log('gonna start replicating to remoteDB:',remoteDB);
    this.replication = this.db.replicate.to(remoteDB, {
      live: true,
      retry: true
    }).on('active', () => {
      console.log('[order.service] REPLICATION active!!!');
      this.isReplicating = true;
      // replicate resumed (e.g. new changes replicating, user went back online)
    });
  }

  cancelReplication(): void{
    try{
      this.replication.cancel();
    }catch(err){
      console.log('could not cancel replication! err:',err);
    }
  }

  private toHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }
}
