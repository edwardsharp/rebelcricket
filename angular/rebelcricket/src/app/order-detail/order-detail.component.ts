import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable }           from 'rxjs/Observable';

// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent  { //implements OnInit

	// id: string;
	order: Order;
	// private orderSub: any;

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute
  ) { }


  ngOnInit() {
  	// this.id = this.route.paramMap
   //  	.switchMap((params: ParamMap) => params.get('id') );
      // this.service.getHero(params.get('id')));

    // let id = this.route.snapshot.paramMap.get('id');

    // this.sub = this.route.params.subscribe(params => {
    //    this.id = params['id']; 
    // });

    // okay
    // this.route.params
    // 	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    // 	.subscribe((order: Order) => this.order = order);

    // this.order = this.route.paramMap
    // 	.switchMap( (params: ParamMap) =>
    //   	this.orderService.getOrder( params.get('id') )
    //   );

    this.route.paramMap
    	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    	.subscribe((order: Order) => this.order = order);
    
    setTimeout( () => {    //use ()=> syntax
      console.log('zomg, this this!',this.order);
		 }, 3000);

  //   this.orderSub.subscribe(
		//    value => this.obj = value,
		//    (errData) => { this.renderErrors() },
		//    () => {
		//        this.variableFilledWhenDone = true;
		//    }
		// );

    // console.log('zomg this.route.paramMap:',this.id);

    // this.route.params
	   //  .map(params => params['id'])
	   //  .switchMap(id => this.contactsService.getContact(id))
	   //  .subscribe(contact => this.contact = contact);


  }

  // ngOnDestroy() {
  //   this.orderSub.unsubscribe();
  // }

  // @Input() order: Order;

}
