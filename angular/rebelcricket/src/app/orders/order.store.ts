import {ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort} from '@angular/material';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Order } from './order';
import { OrderService } from './order.service';


/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, OrderService. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class OrderStore extends DataSource<any> {
  constructor(private _orderService: OrderService, private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Order[]> {
    const displayDataChanges = [
      this._orderService.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  getSortedData(): Order[] {
    const data = this._orderService.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'orderId': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'orderName': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'orderEmail': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'orderOrg': [propertyA, propertyB] = [a.org, b.org]; break;
        case 'orderPhone': [propertyA, propertyB] = [a.phone, b.phone]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}


/*
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/Rx";

import {OrderService} from "./order.service";
import {Order} from "./order";
// import {List} from 'immutable';

@Injectable()
export class OrderStore {

    private _orders: BehaviorSubject<List<Order>> = new BehaviorSubject(List([]));

    constructor(private orderService: OrderService) {
        this.loadInitialData();
    }

    get orders() {
        return asObservable(this._orders);
    }

    loadInitialData() {
        this.orderService.getAllOrders()
            .subscribe(
                res => {
                    let orders = (<Object[]>res.json()).map((order: any) =>
                        new Order({id:order.id, description:order.description,completed: order.completed}));

                    this._orders.next(List(orders));
                },
                err => console.log("Error retrieving Orders")
            );

    }

    addOrder(newOrder:Order):Observable {

        let obs = this.orderService.saveOrder(newOrder);

        obs.subscribe(
                res => {
                    this._orders.next(this._orders.getValue().push(newOrder));
                });

        return obs;
    }

    toggleOrder(toggled:Order): Observable {
        let obs: Observable = this.orderService.toggleOrder(toggled);

        obs.subscribe(
            res => {
                let orders = this._orders.getValue();
                let index = orders.findIndex((order: Order) => order.id === toggled.id);
                let order:Order = orders.get(index);
                this._orders.next(orders.set(index, new Order({id:toggled.id, description:toggled.description, completed:!toggled.completed}) ));
            }
        );

        return obs;
    }


    deleteOrder(deleted:Order): Observable {
        let obs: Observable = this.orderService.deleteOrder(deleted);

        obs.subscribe(
                res => {
                    let orders: List<Order> = this._orders.getValue();
                    let index = orders.findIndex((order) => order.id === deleted.id);
                    this._orders.next(orders.delete(index));

                }
            );

        return obs;
    }


}
*/