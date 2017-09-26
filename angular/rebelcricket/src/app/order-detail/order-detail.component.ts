import { Component, Input } from '@angular/core';
//OnInit
import { Order } from '../orders/order';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent  { //implements OnInit

  // constructor() { }

  // ngOnInit() {
  // }

  @Input() order: Order;

}
