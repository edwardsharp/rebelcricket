import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, 
  MatSort,
  MatPaginator,
  MatChipInputEvent } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { SettingsService } from './settings.service';
import { Settings, PrivateSettings, OrderStatus, Service } from './settings';
import { OrderField, OrderFieldType } from '../orders/order';

const COMMA = 188;
const ENTER = 13;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: Settings;
  privatesettings: PrivateSettings;
  disableSave: boolean = true;
  
  selectedService: Service;

  @ViewChild('carouselFile') carouselFile:ElementRef;
  carouselFileUploading: boolean;
  carouselFileError: boolean;

  @ViewChild('logoFile') logoFile:ElementRef;
  logoFileUploading: boolean;
  
  defaultImg:string = '/assets/images/default-image-square.png';
  gridCols: number;

  @ViewChild('serviceFile') serviceFile:ElementRef;
  serviceFileUploading: boolean;

  @ViewChild('serviceDetailImage') serviceDetailImage:ElementRef;
  serviceDetailImageUploading: boolean;
  
  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }
 
  ngOnInit() {
    this.getSettings();
    this.getPrivateSettings();
    this.setGridCols();

    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => this.setGridCols());
  }

  setGridCols(){
    if(window.innerWidth < 600){
      this.gridCols = 1;
    }else if(window.innerWidth > 599 && window.innerWidth < 900){
      this.gridCols = 2;
    }else if(window.innerWidth > 899){
      this.gridCols = 4;
    }
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
    }, err => {
      console.log('o noz! settingsService.getSettings() err:',err);
    });
  }

  getPrivateSettings(): void{
    this.settingsService.getPrivateSettings().then(privatesettings => {
      this.privatesettings = privatesettings;
    })
  }

  savePrivateSettings(): void{
    this.settingsService
    .savePrivateSettings(this.privatesettings)
    .then(resp => {
      this.privatesettings["_rev"] = resp["rev"];
      this.snackBar.open('Settings Saved!', undefined, {
        duration: 2000
      });
    }, err => {
      console.log('o noz, error saving private settings:',err);
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
      console.log('saved this.settings:',this.settings);
    }, err => {
      console.log('o noz, error saving settings! err:',err);
    });
  }

  newStatusName: string;
  addStatus(): void{
    if(this.newStatusName && this.newStatusName != ''){
      this.settings.order_statuses.push(new OrderStatus(this.newStatusName.trim(), this.settings.order_statuses.length));
      this.onOrderStatusChange();
      this.newStatusName = '';
    }
  }
  removeStatus(status: any): void {
    let index = this.settings.order_statuses.indexOf(status);
    if (index >= 0) {
      this.settings.order_statuses.splice(index, 1);
      this.onOrderStatusChange();
    }
  }

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
    this.settings.landing_page_items.push({url: '', href: '', attachment: ''});
    this.onChange();
  }
  removeLandingPageItem(item): void {
    this.removeAttachment(item.attachment);
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
  
  addBaseOrderField(): void{
    this.settings.base_order_fields = this.settings.base_order_fields || [];
    this.settings.base_order_fields.push(new OrderField);
  }
  removeBaseOrderField(field: OrderField){
    let idx = this.settings.base_order_fields.indexOf(field);
    if(idx >= 0){
      this.settings.base_order_fields.splice(idx, 1);
      this.onChange();
    }
  }

  addOrderField(): void {
    this.selectedService.order_fields = this.selectedService.order_fields || [];
    this.selectedService.order_fields.push(new OrderField);
  }

  logoAttachmentSrc(){
    try{
      if(this.settings.logo_image && this.settings.logo_image.length > 0){
        const content_type = this.settings["_attachments"][this.settings.logo_image]["content_type"];
        const data = this.settings["_attachments"][this.settings.logo_image]["data"];
        return (data && content_type && content_type.match(/image/i)) ? this.sanitizer.bypassSecurityTrustUrl(`data:${content_type};base64,${data}`) : this.defaultImg; 
      }else if(this.settings.logo_url && this.settings.logo_url.length > 0){
        return this.settings.logo_url;
      }else{
        return this.defaultImg;
      }
    }catch(err){
      return this.defaultImg;
    }   
  }
  
  removeLogoImage(){
    this.removeAttachment(this.settings.logo_image);
    this.settings.logo_image = undefined;
    this.settings.logo_url = undefined;
    this.onChange();
  }
  uploadLogoFile(){
    this.logoFile.nativeElement.click();
  }
  
  logoFileChnaged(e){
    this.logoFileUploading = true;
    let description; 

    this.settings._attachments = this.settings._attachments || {};
    for(let file of e.target.files){
      description = description ? `${description}, ${file.name}` : file.name;
      this.settings._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
      this.settings.logo_image = file.name;
    }

    this.settingsService.saveSettings(this.settings).then(resp => {
      if(resp["rev"]){
        this.settings._rev = resp["rev"];
      }

      this.settingsService.getSettings().then((settings: Settings) => {
        if(settings && settings._id){
          this.settings = settings;
        }
      });

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }

      this.logoFileUploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      console.log('o noz! save settings err:',err);
    });
  }


  attachmentSrcFor(item): any{
    try{
      if(item.attachment && item.attachment.length > 0){
        const content_type = this.settings["_attachments"][item.attachment]["content_type"];
        const data = this.settings["_attachments"][item.attachment]["data"];
        return (data && content_type && content_type.match(/image/i)) ? this.sanitizer.bypassSecurityTrustUrl(`data:${content_type};base64,${data}`) : this.defaultImg; 
      }else if(item.url && item.url.length > 0){
        return item.url;
      }else{
        return this.defaultImg;
      }
    }catch(err){
      return this.defaultImg;
    }    
  }

  uploadCarouselFile(index){
    this.carouselFile.nativeElement.click();
    this.carouselFile.nativeElement.setAttribute('itemidx', index);
  }

  carouselFileChnaged(e){
    let idx = e.target.getAttribute('itemidx');
    this.carouselFileUploading = true;
    this.carouselFileError = false;
    let description; 

    this.settings._attachments = this.settings._attachments || {};
    for(let file of e.target.files){
      description = description ? `${description}, ${file.name}` : file.name;
      this.settings._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
      this.settings.landing_page_items[idx].attachment = file.name;
    }

    this.settingsService.saveSettings(this.settings).then(resp => {
      if(resp["rev"]){
        this.settings._rev = resp["rev"];
      }

      this.settingsService.getSettings().then((settings: Settings) => {
        if(settings && settings._id){
          this.settings = settings;
        }
      });

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }

      this.carouselFileUploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      console.log('o noz! save settings err:',err);
    });
  }

  removeServiceImage(selectedService){
    this.removeAttachment(selectedService.image);
    selectedService.image = undefined;
    selectedService.image_url = undefined;
    this.onChange();
  }
  uploadServiceFile(){
    this.serviceFile.nativeElement.click();
  }
  serviceFileChnaged(e){
    this.serviceFileUploading = true;
    let description; 

    this.settings._attachments = this.settings._attachments || {};
    for(let file of e.target.files){
      description = description ? `${description}, ${file.name}` : file.name;
      this.settings._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
      this.selectedService.image = file.name;
    }

    this.settingsService.saveSettings(this.settings).then(resp => {
      if(resp["rev"]){
        this.settings._rev = resp["rev"];
      }

      this.settingsService.getSettings().then((settings: Settings) => {
        if(settings && settings._id){
          this.settings = settings;
        }
      });

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }

      this.serviceFileUploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      console.log('o noz! save settings err:',err);
    });
  }
  serviceAttachmentSrc(selectedService){
    try{
      if(selectedService.image && selectedService.image.length > 0){
        const content_type = this.settings["_attachments"][selectedService.image]["content_type"];
        const data = this.settings["_attachments"][selectedService.image]["data"];
        return (data && content_type && content_type.match(/image/i)) ? this.sanitizer.bypassSecurityTrustUrl(`data:${content_type};base64,${data}`) : this.defaultImg; 
      }else if(selectedService.image_url && selectedService.image_url.length > 0){
        return selectedService.image_url;
      }else{
        return this.defaultImg;
      }
    }catch(err){
      return this.defaultImg;
    }
  }

  addServiceDetailImage(): void{
    this.selectedService.detail_images = this.selectedService.detail_images || [];
    this.selectedService.detail_images.push({url: '', attachment: ''});
    this.onChange();
  }

  removeServiceDetailImage(item:any): void {
    this.removeAttachment(item.attachment);
    let index = this.selectedService.detail_images.indexOf(item);
    if(index >= 0){
      this.selectedService.detail_images.splice(index, 1);
      this.onChange();
    }
  }

  uploadServiceDetailImage(index){
    this.serviceDetailImage.nativeElement.click();
    this.serviceDetailImage.nativeElement.setAttribute('itemidx', index);
  }

  serviceDetailImageChnaged(e){
    let idx = e.target.getAttribute('itemidx');
    this.serviceDetailImageUploading = true;
    let description; 

    this.settings._attachments = this.settings._attachments || {};
    for(let file of e.target.files){
      description = description ? `${description}, ${file.name}` : file.name;
      this.settings._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
      this.selectedService.detail_images[idx].attachment = file.name;
    }

    this.settingsService.saveSettings(this.settings).then(resp => {
      if(resp["rev"]){
        this.settings._rev = resp["rev"];
      }

      this.settingsService.getSettings().then((settings: Settings) => {
        if(settings && settings._id){
          this.settings = settings;
        }
      });

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }

      this.serviceDetailImageUploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      console.log('o noz! save settings err:',err);
    });
  }

  removeAttachment(name:string){
    console.log('gonna try to remove attachment name:',name);
    try{
      delete this.settings["_attachments"][name];
    }catch(err){
      console.log('removeAttachment err:',err);
    }
  }

  onOrderStatusChange(){
    this.settings.order_statuses.map((s,i) => s.position = i );
    this.onChange();
  }

}
