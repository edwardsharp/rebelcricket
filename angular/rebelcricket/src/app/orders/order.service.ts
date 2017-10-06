import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Order } from './order';
import { ORDERS } from './mock-orders';

import { environment } from '../../environments/environment';
declare var PouchDB:any;


/** Constants used to fill up our data base. */
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

let IDZ = [];
for (let i = 0; i < 1000; i++) { 
  IDZ.push( Math.floor(new Date(1507096743342 - (100000000 * i) ).getTime()).toString(36) );
}

@Injectable()
export class OrderService {

  db: any;
  total_rows: number;
  changes: any;

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  get data(): Order[] { return this.dataChange.value; }

  constructor() {
    this.db = new PouchDB('orders');
    // for (let i = 0; i < 10; i++) { 
    //   this.addOrder(); 
    //   setTimeout(()=>{for (let i = 0; i < 50; i++) { this.addOrder(); }}, 5000);
    // }

    this.changes = this.db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', change => {
      // handle change
      console.log('zomg pouchDB change:',change);
      if(change.doc["_id"]){
        const copiedData = this.data.slice();
        const order = change.doc as Order;

        const idx = copiedData.indexOf(copiedData.find(d=> d._id == change.id));
        if(change.doc["_deleted"]){
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
    }).on('complete', function(info) {
      // changes() was canceled
    }).on('error', function (err) {
      console.log(err);
    });

    // this.changes.cancel(); // whenever you want to cancel
        
  }

  saveOrder(order:Order){
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

  // addOrder() {
  //   const copiedData = this.data.slice();
  //   copiedData.push(this.createFakeOrder());
  //   this.dataChange.next(copiedData);
  // }

  /** Builds and returns a new User. */
  // private createFakeOrder() {
  //   const name =
  //       NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
  //       NAMES[Math.round(Math.random() * (NAMES.length - 1))];
  //   const id = IDZ[Math.round(Math.random() * (IDZ.length - 1))]

  //   return {
  //     id: id,
  //     name: name,
  //     email: `${name}@example.org`,
  //     org: `Testing ${IDZ.indexOf(id)}`,
  //     phone: Math.floor(100000 + Math.random() * 9000000000).toString(),
  //     notes: 'testing',
  //     status: 'new',
  //     tags: []
  //   };
  // }


  getOrder(id: string): Promise<Order> {
    return this.db.allDocs({
      include_docs: true,
      attachments: true,
      descending: true,
      key: id
    }).then(response => {
      console.log('order.service getOrder return response.rows[0]:',response.rows[0]);
      if(response.rows && response.rows[0] && response.rows[0].doc){
        return response.rows[0].doc as Order;
      }else{
        return new Order;
      }
    }, err => {
      console.log('o noz! order.service getOrder err:',err);
    });
  }


  getOrders(limit:number,skip:number): Promise<Order[]> {
    //environment.couch_host
    // return Promise.resolve(ORDERS);
    return this.db.allDocs({
      include_docs: true,
      attachments: false,
      descending: true,
      limit: limit,
      skip: skip
    }).then(response => {
      this.total_rows = response["total_rows"];
      console.log('order.service getOrders returning response.rows:',response.rows);
      this.dataChange.next(response.rows.map(row => row.doc as Order));
    });
  }

  removeOrder(order: Order): Promise<any>{
    return this.db.remove(order._id, order._rev);
  }

}
