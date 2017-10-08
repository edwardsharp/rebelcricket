import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { MdSnackBar } from '@angular/material';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/settings';
import { AppTitleService } from '../app-title.service';
import { Order } from '../orders/order';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
	  trigger('containerButtonState', [
	    state('inactive', style({
	      transform: 'rotate(90deg)',
	      'margin-right': '1em'
	    })),
	    state('active',   style({
	      transform: 'rotate(0deg)',
	      'margin-right': '0'
	    })),
	    transition('inactive => active', animate('350ms ease-in')),
	    transition('active => inactive', animate('350ms ease-out'))
	  ]),
	  trigger('containerHeadingState', [
	    state('inactive', style({
	      transform: 'rotate(90deg)'
	    })),
	    state('active',   style({
	      transform: 'rotate(0deg)'
	    })),
	    transition('inactive => active', animate('150ms ease-in')),
	    transition('active => inactive', animate('150ms ease-out'))
	  ]),
	  trigger('containerState', [
	    state('inactive', style({
	      'min-width': '64px',
	      'max-width': '64px'
	    })),
	    state('active',   style({
	      'min-width': '300px',
	      'max-width': 'none'
	    })),
	    transition('inactive => active', animate('100ms ease-in')),
	    transition('active => inactive', animate('100ms ease-out'))
	  ])
	]
})
export class DashboardComponent implements OnInit, OnDestroy {

	listOne: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];

  settings: Settings;

  needsTimeout: boolean = false;

  // orderDataChange: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  // get orderData(): Order[] { return this.orderDataChange.value; }

  // orders: Array<Order>;
  ordersForStatus: object = {};

	constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MdSnackBar,
    private appTitleService: AppTitleService 
  ) { }

  ngOnInit() {
  	
  	this.settingsService.getSettings().then(settings => {
    	this.settings = settings;
  		// if( ! this.containers.find(c => c.name == status) ){
	    	// this.containers.splice(this.containers.indexOf(container), 1);	    	
	    // }
	    if(this.settings && this.settings.order_statuses){
  			for(let status of this.settings.order_statuses){
	  			this.containers.push( new Container(this.containers.length, status.name, 'active') );
	  		}
  		}

  		// console.log('GONNA SUBSCRIBE TO ORDER CHANGEZZ!!!!!!');
  		this.orderService.dataChange.subscribe( orderData => {

	  		let newOrdersForStatus = {};

	  		if(this.settings && this.settings.order_statuses){
	  			for(let status of this.settings.order_statuses){
		  			newOrdersForStatus[status.name] = this.getOrdersFor(status.name, orderData);
		  		}
	  		}

	  		// :(
	  		if(this.needsTimeout){
	  			this.needsTimeout = false;
	  			setTimeout(() => {
		  			console.log('zomg setTimeout gonna set ordersForStatus newOrdersForStatus:',newOrdersForStatus);
		  			this.ordersForStatus = newOrdersForStatus;
		  		}, 1000);
	  		}else{
	  			console.log('!!! NO !!!! TIMEOUT OUT !!!! NEEDED !!!!!!')
	  			this.ordersForStatus = newOrdersForStatus;
	  		}
	  		

	  	});

	  	const limit = 100; //this.paginator.pageSize;
	 		const skip = 0; //this.paginator.pageIndex * this.paginator.pageSize;

	    this.orderService.getOrders(limit, skip);

    }, err => {
    	console.log('o noz! settingsService.getSettings() err:',err);
    });

  }

  ngOnDestroy() {
  	// this.orderService.dataChange.unsubscribe();
  }

  getOrdersFor(status:string, orderData:Order[]): Order[] {
    if(status.match(/inbox/i)){
    	// console.log('getOrdersFor INBOX FILTER!!!!');
    	return orderData.filter(order => order.status === status || !this.settings.order_statuses.map(s => s.name).includes(order.status));
    }else{
    	// console.log('getOrdersFor '+status+' FILTER!!!!');
    	return orderData.filter( order => order.status === status);
    }
  }

  cardDropped(order:Order,container:Container){
  	this.needsTimeout = true;
  	console.log('DashboardComponent cardDropped order,container:',order,container);
  	//trying to avoid DashboardComponent.html:36 ERROR Error: ViewDestroyedError: Attempt to use a destroyed view: detectChanges
  	if(order.status != container.name){
  		order.status = container.name;
	  	this.saveOrder(order);
  	}
  	
  }

  containerDropped(i:number,container:Container){
  	console.log('DashboardComponent containerDropped i,container:',i,container);
  }


  dragOperation: boolean = false;

  containers: Array<Container> = [];

  // widgets: Array<Widget> = [];
  // addTo($event: any) {
  //   if ($event) {
  //     this.widgets.push($event.dragData);
  //   }
  // }




  saveOrder(order: Order) {

    let description = 'via Dashboard';
    // const orderDiff = _.omit(this.origOrder, (v,k) => { return this.order[k] === v; });
    // if(orderDiff){
    //   let orderDiffKeys = Object.keys(orderDiff);
    //   if(orderDiffKeys.indexOf("history") > 0){
    //     orderDiffKeys.splice(orderDiffKeys.indexOf("history"),1);
    //   }
    //   description = `Fields: ${orderDiffKeys.join(', ')}`;
    // }
    
    if(order.history){
      order.history.push({date: new Date, title: 'Updated', description: description});
    }else{
      order.history = [{date: new Date, title: 'Created', description: description}];
    }
    
    

    // console.log('gonna save this.order:',this.order);
    this.orderService.saveOrder(order).then(resp => {
      // console.log('zomg, resp:',resp);
      this.snackBar.open('Order Saved!', '', {
        duration: 2000,
      });
      if(resp["rev"]){
        order["_rev"] = resp["rev"];
      }

    }, err =>{
      this.snackBar.open('Error: Could not save order!', '', {
        duration: 3000,
      });
      console.log('o noz! saveOrder err:',err);
    });
  }

  updateOrderStatus(order:Order,status:string): void{
  	order.status = status;
  	this.saveOrder(order);
  }

  removeOrderTag(order: Order, tag: any): void {
    let index = order.tags.indexOf(tag);
    if (index >= 0) {
      order.tags.splice(index, 1);
      this.saveOrder(order);
    }
  }

  moveOrder(order: Order, direction:string): void{
  	console.log('moveOrder  order,direction:',order,direction);
  	if(direction == 'up'){

  	}else{

  	}
  }

  deleteOrder(order: Order) {
    if(order._id && order._rev){
      this.orderService.removeOrder(order).then(resp => {
        if(resp["ok"]){
          //#TODO: animate?
          this.snackBar.open('Order removed', '', {
            duration: 2000,
          });
        }
      });
    }
    
  }

}

class Container {
  constructor(
  	public id: number, 
  	public name: string, 
  	public collapsed: string
  	// , 
  	// public widgets: Array<Widget>
  ) {}
  public toggleCollapse(): void {
    this.collapsed = this.collapsed === 'active' ? 'inactive' : 'active';
  }
}

// class Widget {
//   constructor(public name: string) {}
// }
