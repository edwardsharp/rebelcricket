import { Component, OnInit } from '@angular/core';
import { MdSnackBar, 
  MdSort,
  MdPaginator,
  MdChipInputEvent,
  ENTER } from '@angular/material';

import { SettingsService } from './settings.service';
import { Settings, OrderStatus, Service } from './settings';

const COMMA = 188;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	settings: Settings;
	disableSave: boolean = true;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MdSnackBar
  ) { }

 
  ngOnInit() {
  	this.getSettings();
  }

  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
    	this.settings = settings;

      //sort of a migrationz/init thing, here...
      this.settings.order_statuses = this.settings.order_statuses || [];
      this.settings.services = this.settings.services || [];
      this.settings.about_page_items = this.settings.about_page_items || [];
      this.settings.landing_page_items = this.settings.landing_page_items || [];
      this.settings.landing_page_social_items = this.settings.landing_page_social_items || [];

    	// console.log('settings:',settings);
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
      this.snackBar.open('Settings Saved!', undefined, {
        duration: 2000,
      }); 
  	}, err => {
  		console.log('o noz, error saving settings! err:',err);
  	});
  }

  //chip input for tagz
  visible: boolean = false;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  separatorKeysCodes = [ENTER, COMMA];
  addStatus(event: MdChipInputEvent): void {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
    	this.disableSave = false;
      this.settings.order_statuses.push(new OrderStatus(value.trim(), this.settings.order_statuses.length));
    }
    if (input) {
      input.value = '';
    }
  }
  removeStatus(fruit: any): void {
    let index = this.settings.order_statuses.indexOf(fruit);
    if (index >= 0) {
    	this.disableSave = false;
      this.settings.order_statuses.splice(index, 1);
    }
  }


  selectedService: Service;

  addService(): void {
    this.settings.services = this.settings.services || [];
    this.settings.services.push(new Service('New Service'));
    this.selectedService = this.settings.services[this.settings.services.length -1];
    this.onChange();
  }
  removeService(service: Service): void {
    this.settings.services = this.settings.services || [];
    let index = this.settings.services.indexOf(service);
    if(index >= 0){
      this.settings.services.splice(index, 1);
      if(this.settings.services.length > 0){
        this.selectedService = (index - 1) > 0 ? this.settings.services[index-1] : this.settings.services[0];
      }else{
        this.selectedService = undefined;
      }
      this.onChange();
    }
  }


  addServiceDetailImage(): void{
    this.selectedService.detail_images = this.selectedService.detail_images || [];
    this.selectedService.detail_images.push({url: 'https://'});
    this.onChange();
  }

  removeServiceDetailImage(item:any): void {
    let index = this.selectedService.detail_images.indexOf(item);
    if(index >= 0){
      this.selectedService.detail_images.splice(index, 1);
      this.onChange();
    }
  }

  addServiceDetailItem(): void {
    this.selectedService.detail_items = this.selectedService.detail_items || [];
    this.selectedService.detail_items.push({heading: '', detail: ''});
    this.onChange();
  }
  removeServiceDetailItem(item: any): void {
    let index = this.selectedService.detail_items.indexOf(item);
    if(index >= 0){
      this.selectedService.detail_items.splice(index, 1);
      this.onChange();
    }
  }

  addAboutPageItem(): void {
    this.settings.about_page_items = this.settings.about_page_items || [];
    this.settings.about_page_items.push({heading: '', detail: ''});
    this.onChange();
  }
  removeAboutPageItem(item): void {
    let index = this.settings.about_page_items.indexOf(item);
    if(index >= 0){
      this.settings.about_page_items.splice(index, 1);
      this.onChange();
    }
  }
  
  addLandingPageItem(): void {
    this.settings.landing_page_items = this.settings.landing_page_items || [];
    this.settings.landing_page_items.push({url: '', href: ''});
    this.onChange();
  }
  removeLandingPageItem(item): void {
    let index = this.settings.landing_page_items.indexOf(item);
    if(index >= 0){
      this.settings.landing_page_items.splice(index, 1);
      this.onChange();
    }
  }

  addLandingSocialItem(): void {
    this.settings.landing_page_social_items = this.settings.landing_page_social_items || [];
    this.settings.landing_page_social_items.push({url: '', name: ''});
    this.onChange();
  }
  removeLandingSocialItem(item): void {
    let index = this.settings.landing_page_social_items.indexOf(item);
    if(index >= 0){
      this.settings.landing_page_social_items.splice(index, 1);
      this.onChange();
    }
  }
  

}
