import {Component, ViewChild, OnInit} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {MdSort,MdPaginator} from '@angular/material';
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

  //table sorting stuff
  displayedColumns = ['orderId', 'orderName', 'orderEmail', 'orderOrg', 'orderStatus'];
  // exampleDatabase = new ExampleDatabase();
  dataSource: OrderStore | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  ngOnInit() {
    this.loading = true;
    this.dataSource = new OrderStore(this.orderService, this.sort, this.paginator);

    this.orderService.getOrders(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize);
  }


  createdAtDate(_id:string){
    return new Date(parseInt(_id, 36));
  }

  onSelect(order: Order): void {
    this.selectedOrder = order;
  }

}
