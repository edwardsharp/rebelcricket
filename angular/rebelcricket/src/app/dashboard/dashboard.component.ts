import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
export class DashboardComponent implements OnInit {

	listOne: Array<string> = ['Coffee', 'Orange Juice', 'Red Wine', 'Unhealty drink!', 'Water'];

  settings: Settings;

	constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private snackBar: MdSnackBar,
    private appTitleService: AppTitleService 
  ) { }

  ngOnInit() {
  	this.getSettings();
  }

  cardDropped(e:any,widget:any,container:any){
  	console.log('DashboardComponent cardDropped e,widget,container:',e,widget,container);
  }

  containerDropped(i:any,container:any){
  	console.log('DashboardComponent containerDropped i,container:',i,container);
  }

  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
    	this.settings = settings;
    	console.log('settings:',settings);

    	let i = 1;
    	for(let status of this.settings.order_statuses){
    		this.containers.push( new Container(i, status.name, 'active', [new Widget('1'), new Widget('2')]) )
    		i += 1;
    	}
    }, err => {
    	console.log('o noz! settingsService.getSettings() err:',err);
    });
  }

  dragOperation: boolean = false;

  containers: Array<Container> = [];

  widgets: Array<Widget> = [];
  addTo($event: any) {
    if ($event) {
      this.widgets.push($event.dragData);
    }
  }

}

class Container {
  constructor(
  	public id: number, 
  	public name: string, 
  	public collapsed: string, 
  	public widgets: Array<Widget>
  ) {}
  public toggleCollapse(): void {
    this.collapsed = this.collapsed === 'active' ? 'inactive' : 'active';
  }
}

class Widget {
  constructor(public name: string) {}
}
