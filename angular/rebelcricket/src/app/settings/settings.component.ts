import { Component, OnInit } from '@angular/core';
import {MdSort,MdPaginator,MdChipInputEvent, ENTER} from '@angular/material';

import { SettingsService } from './settings.service';
import { Settings, OrderStatus } from './settings';

const COMMA = 188;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	settings: Settings;
	disableSave: boolean = true;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  	this.getSettings();
  }

  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
    	this.settings = settings;
    	console.log('settings:',settings);
    	this.visible = true;
    }, err => {
    	console.log('o noz! settingsService.getSettings() err:',err);
    });
  }

  onChange(){
  	this.disableSave = false;
  }

  saveSettings(): void {
  	this.settingsService
  	.saveSettings(this.settings)
  	.then(resp => {
  		this.settings["_rev"] = resp["rev"];
  		this.disableSave = true;
  	}, err => {
  		console.log('o noz, error saving settings! err:',err);
  	});
  }

  //chip input for tagz
  visible: boolean = false;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  add(event: MdChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our person
    if ((value || '').trim()) {
    	this.disableSave = false;
      this.settings.order_statuses.push(new OrderStatus(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.settings.order_statuses.indexOf(fruit);
    if (index >= 0) {
    	this.disableSave = false;
      this.settings.order_statuses.splice(index, 1);
    }
  }

}
