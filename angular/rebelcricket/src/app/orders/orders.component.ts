import { Component, OnInit} from '@angular/core';
//Input

import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Order } from './order';
import { OrderService } from './order.service';

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

  ngOnInit(): void {
  	this.loading = true;
    this.getOrders();
  }

  onSelect(order: Order): void {
    this.selectedOrder = order;
  }

}
