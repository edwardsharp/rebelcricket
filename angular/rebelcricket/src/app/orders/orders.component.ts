import {Component, ViewChild, OnInit} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Order } from './order';
import { OrderService } from './order.service';
import { OrderStore } from './order.store';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

	orders: Order[];
  selectedOrder: Order;
  loading: Boolean = false;
  orderTags: Array<string>=[];

  constructor(private orderService: OrderService) { }

  getOrders(): void {
 		// 												 SLOWLY!
    this.orderService.getOrdersSlowly().then(orders => {
    	this.orders = orders;
    	this.loading = false;
    }, err => {
    	console.log('o noz! orderService.getOrdersSlowly() err:',err);
    	this.loading = false;
    });
    // this.orderService.getOrdersSlowly().then(function(orders){
    // 	this.orders = orders;
    // 	this.loading = false;
    // });
  }

  //table sorting stuff
  displayedColumns = ['orderId', 'orderName', 'orderEmail', 'orderOrg', 'orderPhone'];
  // exampleDatabase = new ExampleDatabase();
  dataSource: OrderStore | null;

  @ViewChild(MdSort) sort: MdSort;

  ngOnInit() {
    this.loading = true;
    this.getOrders();
    this.dataSource = new OrderStore(this.orderService, this.sort);
  }


  onSelect(order: Order): void {
    this.selectedOrder = order;
  }

}
