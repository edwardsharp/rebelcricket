import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Order } from './order';
import { ORDERS } from './mock-orders';

import { environment } from '../../environments/environment';


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

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  get data(): Order[] { return this.dataChange.value; }

  constructor() {
    for (let i = 0; i < 10; i++) { 
      this.addOrder(); 
      setTimeout(()=>{for (let i = 0; i < 50; i++) { this.addOrder(); }}, 5000);
    }
    
  }

  addOrder() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewOrder());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewOrder() {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))];
    const id = IDZ[Math.round(Math.random() * (IDZ.length - 1))]

    return {
      id: id,
      name: name,
      email: `${name}@example.org`,
      org: `Testing ${IDZ.indexOf(id)}`,
      phone: Math.floor(100000 + Math.random() * 9000000000).toString(),
      notes: 'testing'
    };
  }


  getOrder(id: string): Promise<Order> {
    return this.getOrders()
      .then(orders => orders.find(order => order.id === id));
  }

  getOrders(): Promise<Order[]> {
    //environment.couch_host
    return Promise.resolve(ORDERS);
  }

  getOrdersSlowly(): Promise<Order[]> {
    return new Promise(resolve => {
      // simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getOrders()), 2000);
      // throw 'o noz!';
    });
  }

}
