import {ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort, MdPaginator} from '@angular/material';
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
  constructor( private _orderService: OrderService, 
  						 private _sort: MdSort, 
  						 private _paginator: MdPaginator ) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Order[]> {
    const displayDataChanges = [
      this._orderService.dataChange,
      this._sort.sortChange,
      this._paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      //pagniator 
  		const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return this.getSortedData().splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}

  /** return a sorted copy of the database data. */
  getSortedData(): Order[] {

    const data = this._orderService.data.slice();
    if (!this._sort.active && this._sort.direction == '') { 
    	//default sort by ID/Created
    	this._sort.active = 'orderId';
    	this._sort.direction = 'desc';
    }

    return data
    .sort((a, b) => {
      let propA: number|string = '';
      let propB: number|string = '';

      switch (this._sort.active) {
        case 'orderId': [propA, propB] = [parseInt(a._id, 36),parseInt(b._id, 36)]; break;
        case 'orderName': [propA, propB] = [a.name, b.name]; break;
        case 'orderEmail': [propA, propB] = [a.email, b.email]; break;
        case 'orderOrg': [propA, propB] = [a.org, b.org]; break;
        case 'orderStatus': [propA, propB] = [a.status, b.status]; break;
        case 'dateNeeded': 
          propA = new Date(a.date_needed).getTime();
          if(isNaN(propA)){ propA = (this._sort.direction == 'asc' ? Infinity : -Infinity) }
          propB = new Date(b.date_needed).getTime();
          if(isNaN(propB)){ propB = (this._sort.direction == 'asc' ? Infinity : -Infinity) }
          break;
      }

      let valueA = isNaN(+propA) ? propA : +propA;
      let valueB = isNaN(+propB) ? propB : +propB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
