import { Injectable } from '@angular/core';

import { Order } from './order';
import { ORDERS } from './mock-orders';

import { environment } from '../../environments/environment';

@Injectable()
export class OrderService {

  constructor() { }

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
