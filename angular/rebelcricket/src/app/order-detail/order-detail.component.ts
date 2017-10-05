import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable }           from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {MdChipInputEvent, ENTER} from '@angular/material';

import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';

const COMMA = 188;

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
  	private route: ActivatedRoute,
    private router: Router
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

    // .switchMap() is a debounced observable; rad!
    this.route.paramMap
    	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    	.subscribe((order: Order) => {
        if(order && order.id){
          this.order = order;
        }else{
          this.order = new Order;
        } 
       
      });
    
   //  setTimeout( () => {    //use ()=> syntax
   //    console.log('zomg, this this!',this.order);
		 // }, 3000);

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

  //chip input for tagz
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
    { name: 'Zomg A really really long title with space' },
    { name: 'zomdgfajsdhfkdsjhfdskhsdfkjdhfkjshfkasdfjhgkdfsjhdkfjhdgkjdfhgkfgjhfgkjhdfgkjhsfgkjhsdfkjghfdkgjhfdkfjhgkfdjhgfkghsdkgdhfgfjgksdfhgkjfhgd kdjfhgksdfjhgfkdjg dfgkjhdfg ' },
    { name: 'a long one ds fkjsdfadskjfhsdfkjdshfksadjhfdkjfhdskjfhdkjfhdsfkhfkdjfhdskjfdkfjhdkfjhsdkfjhdfkjshfdkjfhsdkjfhdkfjhdkfhdskjhdfkjshfkdhfdksjfhkjdhfdksjhfdkjf sdfkjd' },
  ];


  add(event: MdChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

}
