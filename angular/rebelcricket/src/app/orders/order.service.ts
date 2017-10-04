import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { Order } from './order';
import { ORDERS } from './mock-orders';

import { environment } from '../../environments/environment';


/** Constants used to fill up our data base. */
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

@Injectable()
export class OrderService {

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  get data(): Order[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 50; i++) { this.addOrder(); }
    // setTimeout(()=>{for (let i = 0; i < 50; i++) { this.addUser(); }}, 5000);
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
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: Math.floor(Date.now() / 1000).toString(36),
      name: name,
      email: `${name}@example.org`,
      org: `Testing ${Math.round(Math.random() * 100000).toString(36)}`,
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
