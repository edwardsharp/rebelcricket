import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/settings';
import { AppTitleService } from '../app-title.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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

  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
    	this.settings = settings;
    	console.log('settings:',settings);

    	let i = 1;
    	for(let status of this.settings.order_statuses){
    		this.containers.push( new Container(i, status.name, [new Widget('1'), new Widget('2')]) )
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
  constructor(public id: number, public name: string, public widgets: Array<Widget>) {}
}

class Widget {
  constructor(public name: string) {}
}
