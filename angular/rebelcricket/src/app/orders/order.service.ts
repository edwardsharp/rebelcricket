import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { Order } from './order';
import { environment } from '../../environments/environment';

declare var PouchDB:any;


@Injectable()
export class OrderService {

  db: any;
  total_rows: number;
  changes: any;

  constructor(private http: HttpClient) {
    if(navigator.vendor && navigator.vendor.indexOf('Apple') > -1){
      console.log("LOADING FRUITDONW DB!");
      this.db = new PouchDB('orders', {adapter: 'fruitdown'});
    }else{
      this.db = new PouchDB('orders');
    }
  }

                     // : Promise<any>   ??
  saveOrder(order:Order){

    return this.db.put(order);
  }

  saveQuote(order:Order){
    // if(  order 
    //   && order.name && order.name != ''
    //   && order.email && order.email != '' 
    // ){
      
    // }
    return this.db.put(order);
  }

  getOrder(id: string): Promise<Order> {
    console.log('[orderService] getOrder id:',id);
    return this.db.get(id).then(_order => {
      console.log('[orderService] getOrder return response:',_order);
      if(_order._id == id){
        return _order as Order;
      }else{
        return new Order;
      }
    }, err => {
      return new Order;
    });
  }

  getQuote(id:string, user:string, key:string): Promise<Order> {
    return this.getOrder(id);
    // if(user && user != '' && key && key != ''){
    //   //#todo: something meaningful... (get order from server.js)
    // }else{
    //   return this.getOrder(id);
    // }
  }

  removeOrder(order: Order): Promise<any>{
    return this.db.remove(order._id, order._rev);
  }

}
