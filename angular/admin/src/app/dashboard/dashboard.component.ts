import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSnackBar } from '@angular/material';
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
	      'min-width': '284px',
	      'max-width': 'none'
	    })),
	    transition('inactive => active', animate('100ms ease-in')),
	    transition('active => inactive', animate('100ms ease-out'))
	  ])
	]
})
export class DashboardComponent implements OnInit, OnDestroy {

  settings: Settings;
  needsReloadAfterInit: boolean = false;
  ordersForStatus: object = {};

	constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  	
  	this.settingsService.getSettings().then(settings => {
    	this.settings = settings;
	    if(this.settings && this.settings.order_statuses){
  			for(let status of this.settings.order_statuses){
	  			this.containers.push( new Container(this.containers.length, status.name, (status.collapsed ? 'inactive' : 'active') ) );
	  		}
  		}

  		this.orderService.dataChange.subscribe( orderData => {

	  		let newOrdersForStatus = {};

	  		if(this.settings && this.settings.order_statuses){
	  			for(let status of this.settings.order_statuses){
		  			newOrdersForStatus[status.name] = this.getOrdersFor(status.name, orderData);
		  		}
	  		}

	  		this.ordersForStatus = newOrdersForStatus;

	  	});

	  	const limit = 100; //this.paginator.pageSize;
	 		const skip = 0; //this.paginator.pageIndex * this.paginator.pageSize;

	    this.orderService.getOrders(limit, skip);
      this.needsReloadAfterInit = false;

    }, err => {
    	console.log('o noz! settingsService.getSettings() err:',err);
      this.needsReloadAfterInit = true;
    });

  }

  ngAfterViewInit() {
    // setTimeout(function(){
    //   if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)){
    //     document.querySelector('#container').classList.add('container-ios');
    //     var containerz = document.querySelectorAll(".status-container");
    //     for (var i = 0; i < containerz.length; ++i) {
    //        containerz[i].classList.add('status-container-ios');
    //     }
    //   }
    // }, 1000);
  }

  ngOnDestroy() {
    //hmm... #todo: figure out a good time to unsubscribe?
  	// this.orderService.dataChange.unsubscribe();
  }

  getOrdersFor(status:string, orderData:Order[]): Order[] {
    return orderData.filter( order => {
      if(order.status == 'quote'){
        return false;
      }
      else if(status.match(/inbox/i)){
        return order.status === status || !this.settings.order_statuses.map(s => s.name).includes(order.status);
      }else{
        return order.status === status;
      }
    })
    .sort((a,b) => {
      //#todo: try to figure out previously selected sort order?
      return (a.position < b.position ? -1 : 1);
    })
    .map( (order, idx) => { order.position = idx; return order; });
    
  }

  containers: Array<Container> = [];

  saveOrderQuietly(order: Order): void {
    console.log('gonna saveOrderQuietly... order._id:',order._id);
    this.orderService.saveOrder(order).then(resp => { }, err =>{
      this.snackBar.open('Error: Could not save order!', '', {
        duration: 3000,
      });
      console.log('o noz! saveOrder err:',err);
    });
  }

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
    let idx = this.ordersForStatus[order.status].indexOf(order);
    if(idx > -1){
      let newIdx;
      switch (direction) {
        case 'top':
          newIdx = 0
          break;
        case 'up':
          newIdx = order.position - 1;
          break;
        case 'down':
          newIdx = order.position + 1;
          break;
        case 'bottom':
          newIdx = this.ordersForStatus[order.status].length;
          break;
      }
      // order.position = newIdx;
      this.ordersForStatus[order.status].splice(newIdx, 0, this.ordersForStatus[order.status].splice(idx, 1)[0]);
      
      this.ordersForStatus[order.status]
        .map( (order, idx) => {
          if(order.position != idx){
            order.position = idx; 
            setTimeout(() => this.saveOrderQuietly(order), 100); 
          }
        })
        .sort((a,b) => {
          return (a.position < b.position ? -1 : 1);
        });

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

  sortContainerBy(container_name: string, key: string, dir: string){
    switch (key) {
      case 'position':
        this.ordersForStatus[container_name].sort((a,b) => {
          let aVal = dir == 'asc' ? b : a;
          let bVal = dir == 'asc' ? a : b;
          return ( aVal.position < bVal.position ? 1 : -1);
        });
        break;
      case 'created_at':
        this.ordersForStatus[container_name].sort((a,b) => {
          let aVal = dir == 'asc' ? b : a;
          let bVal = dir == 'asc' ? a : b;
          return ( parseInt(aVal._id, 36) < parseInt(bVal._id, 36) ? 1 : -1); 
        });
        break;
      case 'date_needed':
        this.ordersForStatus[container_name].sort((a,b) => {
          let propA = new Date(a.date_needed).getTime();
          if(isNaN(propA)){ propA = (dir == 'asc' ? Infinity : -Infinity) }
          let propB = new Date(b.date_needed).getTime();
          if(isNaN(propB)){ propB = (dir == 'asc' ? Infinity : -Infinity) }
          return (propA < propB ? -1 : 1) * (dir == 'asc' ? 1 : -1);
        });
        break;
    }
  }

  orderAttachmentCount(order: Order): number {
  	return order.attachments ? order.attachments.map( a => { return a.files.length } ).reduce( (i,v) => i + v ) : 0;
  }

  toggleCollapse(container: Container): void {
  	container.toggleCollapse();
  	let status = this.settings.order_statuses.find( os => os.name == container.name);
  	if(status){
  		status.collapsed = !status.collapsed;
  		this.saveSettings();
  	}
  }

  saveSettings(): void {
  	this.settingsService
  	.saveSettings(this.settings)
  	.then(resp => {
  		this.settings["_rev"] = resp["rev"];
  	}, err => {
  		console.log('o noz, error saving settings! err:',err);
  	});
  }

  clearDueDateFor(order:Order): void {
    order.date_needed = undefined;
    this.saveOrder(order);
  }

  tagsChanged(order: Order, tags:string[]): void {
    order.tags = tags;
    this.saveOrder(order);
  }

  reload(): void{
    window.location.reload();
  }

  orderQtyTotal(order:Order): number{
    if(order && order.line_items){
      return order.line_items.reduce( (sum, item) => {
        return sum + (isNaN(item.quantity) ? 0 : item.quantity );
      }, 0 );
    }else{
      return 0;
    }
  }

  orderTotal(order: Order): number{
    if(order && order.line_items){
      return order.line_items.reduce( (sum, item) => {
        return sum + (isNaN(item.total) ? 0 : item.total );
      }, 0);
    }else{
      return 0;
    }
  }
}

class Container {
  constructor(
  	public id: number, 
  	public name: string, 
  	public collapsed: string
  ) {}
  public toggleCollapse(): boolean {
    this.collapsed = this.collapsed === 'active' ? 'inactive' : 'active';
    return this.collapsed === 'active';
  }
}

