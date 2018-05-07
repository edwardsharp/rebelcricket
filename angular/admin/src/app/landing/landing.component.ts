import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';

import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/settings';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  settings: Settings;
  carouselBannerLoaded: boolean;
  carouselBannerItems: Array<any> = [];
  carouselBanner: NgxCarousel;

  constructor(
    private settingsService: SettingsService, 
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {

    this.settingsService.getSettings().then(settings => {
      this.settings = settings;
      // console.log('settings:',this.settings);
      if(this.settings.landing_page_items && this.settings.landing_page_items.length > 0){
        for(let i=0; i < this.settings.landing_page_items.length; i++){
          this.carouselBannerItems.push(this.attachmentSrcFor(this.settings.landing_page_items[i]));
        }
        this.initCarouselBanner();
      }
    });

  }

  ngOnDestroy() {
    
  }

  public initCarouselBanner() {
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: this.settings.landing_page_items.length,
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
            background: rgba(255, 255, 255, 0.55);
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
    this.carouselBannerLoaded = true;
  }

  /* This will be triggered after carousel viewed */
  afterCarouselViewedFn(data) {
    console.log(data);
  }

  /* It will be triggered on every slide*/
  onmoveFn(data: NgxCarouselStore) {
    console.log(data);
  }

  hasLogoImg():boolean{
    if(this.settings && this.settings.logo_image && this.settings.logo_image.length > 0){
      return true;
     }else if(this.settings && this.settings.logo_url && this.settings.logo_url.length > 0){
       return true;
     }else{
       return false;
     }
  }

  logoAttachmentSrc(){
    try{
      if(this.settings.logo_image && this.settings.logo_image.length > 0){
        const content_type = this.settings["_attachments"][this.settings.logo_image]["content_type"];
        const data = this.settings["_attachments"][this.settings.logo_image]["data"];
        return (data && content_type && content_type.match(/image/i)) ? this.sanitizer.bypassSecurityTrustUrl(`data:${content_type};base64,${data}`) : ''; 
      }else if(this.settings.logo_url && this.settings.logo_url.length > 0){
        return this.settings.logo_url;
      }else{
        return '';
      }
    }catch(err){
      return '';
    }   
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
