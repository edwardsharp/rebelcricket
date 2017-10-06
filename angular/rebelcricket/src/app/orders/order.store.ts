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

  /** Returns a sorted copy of the database data. */
  getSortedData(): Order[] {

    const data = this._orderService.data.slice();
    if (!this._sort.active && this._sort.direction == '') { 
    	//default sort by ID/Created
    	this._sort.active = 'orderId';
    	this._sort.direction = 'desc';
    }

    return data
    .sort((a,b) => {
    	return (parseInt(a.id, 36) < parseInt(b.id, 36) ? -1 : 1); //start with id/created sorted decending -1
    })
    .sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'orderId': [propertyA, propertyB] = [parseInt(a.id, 36),parseInt(b.id, 36)]; break;
        case 'orderName': [propertyA, propertyB] = [a.name.toLowerCase(), b.name.toLowerCase()]; break;
        case 'orderEmail': [propertyA, propertyB] = [a.email.toLowerCase(), b.email.toLowerCase()]; break;
        case 'orderOrg': [propertyA, propertyB] = [a.org.toLowerCase(), b.org.toLowerCase()]; break;
        case 'orderStatus': [propertyA, propertyB] = [a.status, b.status]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
