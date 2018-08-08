import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';

import { Settings, Service } from '../settings/settings';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  service: Service;
  services: Array<Service> = [];
  settings: Settings;
  gridCols: number;
  serviceImageItems: Array<any> = [];
  serviceImages: NgxCarousel;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setGridCols();

    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => this.setGridCols());

    this.settingsService.getSettings()
      .then( (settings: Settings) => {
        this.settings = settings;
        this.initServices();
      });

    // this.route.paramMap
    //   .switchMap((params: ParamMap) => {
    //     this.service = params.get('service');
    //     return this.settingsService.getSettings();
    //   })
    //   .subscribe((settings: Settings) => {
    //     console.log('GOT SETTINGS! settings:',settings);
    //     this.settings = settings;
    //   });
  }

  setGridCols(){
    if(window.innerWidth < 600){
      this.gridCols = 1;
    }else if(window.innerWidth > 599 && window.innerWidth < 900){
      this.gridCols = 2;
    }else if(window.innerWidth > 899){
      this.gridCols = 3;
    }
  }

  initServices(){
    this.services = this.settings.services.filter( service => { return !service.internal });
  }

  serviceImageAttachmentSrc(service){
    try{
      if(service.image && service.image.length > 0){
        const content_type = this.settings["_attachments"][service.image]["content_type"];
        const data = this.settings["_attachments"][service.image]["data"];
        return (data && content_type && content_type.match(/image/i)) ? this.sanitizer.bypassSecurityTrustUrl(`data:${content_type};base64,${data}`) : ''; 
      }else if(service.image_url && service.image_url.length > 0){
        return service.image_url;
      }else{
        return '';
      }
    }catch(err){
      return '';
    }   
  }

  serviceSelected(serviceItem){
    if(serviceItem.detail_images && serviceItem.detail_images.length > 0){
      this.initCarousel(serviceItem);
    }
    this.service = serviceItem;
  }

  initCarousel(service) {

    this.serviceImageItems = [];
    this.serviceImageItems.push(this.attachmentSrcFor({url: service.image_url, attachment: service.image}));

    for(let i=0; i < service.detail_images.length; i++){
      this.serviceImageItems.push(this.attachmentSrcFor(service.detail_images[i]));
    }

    this.serviceImages = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: service.detail_images.length + 1,
      speed: 300,
      interval: 3500,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(0,0,0, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 0,
      custom: 'banner',
      touch: true,
      loop: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };
    // this.carouselBannerLoaded = true;
  }

  attachmentSrcFor(item): any{
    let defaultImg = '/assets/images/default-image.png';
    let retUrl;
    try{
      if(item.attachment && item.attachment.length > 0){
        const content_type = this.settings["_attachments"][item.attachment]["content_type"];
        const data = this.settings["_attachments"][item.attachment]["data"];
        retUrl = (data && content_type && content_type.match(/image/i)) ? `data:${content_type};base64,${data}` : defaultImg; 
      }else if(item.url && item.url.length > 0){
        retUrl = item.url;
      }else{
        retUrl = defaultImg;
      }
    }catch(err){
      retUrl = defaultImg;
    }

    return this.sanitizer.bypassSecurityTrustStyle(`url(${retUrl})`);

  }

}
