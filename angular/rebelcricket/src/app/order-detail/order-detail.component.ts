import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable }           from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {MdChipInputEvent, ENTER, MdSnackBar} from '@angular/material';

import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/settings';

const COMMA = 188;


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit  { 

	// id: string;
  order: Order;
	// private orderSub: any;
  settings: Settings;
  needsSave: boolean = false;
  quoteDesingUploading: boolean = false;
  gfxError: boolean = false;
  // serializedPanes: Array<string>;

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    public snackBar: MdSnackBar
  ) { }


  ngOnInit() {
    this.getSettings();

    // .switchMap() is a debounced observable; rad!
    this.route.paramMap
    	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    	.subscribe((order: Order) => {
        if(order && order._id && this.route.snapshot.params.id != 'new'){
          this.order = order;
        }else{
          this.order = new Order;
          this.router.navigate(['/dashboard/order/', this.order._id]);
          this.snackBar.open('New Order Created!', '', {
            duration: 2000,
          });          
        } 
      });
  }

  // ngOnDestroy() {
  //   this.orderSub.unsubscribe();
  // }

  onChange(event: any) {
    // changes.prop contains the old and the new value...
    console.log('order-detail.component ngOnChanges event:',event);
    this.needsSave = true;
  }

  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
      this.settings = settings;
    }, err => {
      console.log('o noz! settingsService.getSettings() err:',err);
    });
  }

  saveOrder() {
    // console.log('gonna save this.order:',this.order);
    this.orderService.saveOrder(this.order).then(resp => {
      // console.log('zomg, resp:',resp);
      this.snackBar.open('Order Saved!', '', {
        duration: 2000,
      });
      if(resp["rev"]){
        this.order["_rev"] = resp["rev"];
      }
      this.needsSave = false;
    }, err =>{
      this.snackBar.open('Error: Could not save order!', '', {
        duration: 3000,
      });
      console.log('o noz! saveOrder err:',err);
    });
  }

  deleteOrder() {
    if(this.order._id && this.order._rev){
      this.orderService.removeOrder(this.order).then(resp => {
        if(resp["ok"]){
          this.router.navigate(['/dashboard/orders']);
          this.snackBar.open('Order removed', '', {
            duration: 2000,
          });
        }
      });
    }
    
  }
  // @Input() order: Order;

  //chip input for tagz
  visible: boolean = true;
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
      if(this.order.tags == undefined){
        this.order.tags = [];
      }
      this.needsSave = true;
      this.order.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    let index = this.order.tags.indexOf(tag);

    if (index >= 0) {
      this.needsSave = true;
      this.order.tags.splice(index, 1);
    }
  }


  quoteFileChnaged(e:any){
    this.quoteDesingUploading = true;
    this.gfxError = false;

    console.log('quoteFileChnaged()! e.target:',e.target);

    // "att.txt": {
    //   "content_type": "text/plain",
    //   "data": new Blob(
    //     ["And she's hooked to the silver screen"], 
    //     {type: 'text/plain'})
    // }


    this.order._attachments = this.order._attachments || {};
    for(let file of e.target.files){
      console.log('quoteFileChnaged()! file:',file);
      this.order._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
    }

    this.orderService.saveOrder(this.order).then(resp => {
      // console.log('zomg, resp:',resp);
      if(resp["rev"]){
        this.order._rev = resp["rev"];
      }

      this.orderService.getOrder( this.order._id ).then((order: Order) => {
        if(order && order._id){
          this.order = order;
        }
      });

      let msg = '';
      if(e.target.files.length == 0){
        msg = `Attachment ${e.target.files[0].file.name} Saved!`;
      }else{
        msg = `${e.target.files.length} Attachments Saved!`
      }
      this.quoteDesingUploading = false;
      this.snackBar.open(msg, '', {
        duration: 2000,
      });

    }, err =>{
      this.snackBar.open('Error! Could not save attachment(s).', '', {
        duration: 3000,
      });
      console.log('o noz! saveOrder err:',err);
    });

  }

  attachmentItemsForOrder(){
    //.map(i => { return {key:i,disabled:true} })
    return this.order._attachments ? Object.keys(this.order._attachments) : [];
  }
  
  attachmentSrcFor(order:Order,itemKey:string){
    try{
      const content_type = order["_attachments"][itemKey]["content_type"];
      //this.sanitizer.bypassSecurityTrustUrl(
      const data = order["_attachments"][itemKey]["data"];
      return (data && content_type && content_type.match(/image/i)) ? `data:${content_type};base64,${data}` : ''; 
    }catch(err){
      return '';
    }
         
  }

  deleteAttachmentFor(itemKey:string){

    this.orderService.removeAttachment(this.order._id, itemKey, this.order._rev).then(result => {
      // handle result
      console.log('great! removeAttachment()! result:',result);
      this.snackBar.open('Attachment removed', '', {
        duration: 2000,
      });
      if(result["rev"]){
        this.order._rev = result["rev"];
      }
      try{
        delete this.order._attachments[itemKey];
      }catch(err){
        // e.target.disabled = false;
        console.log('o noz! delete _attachments err:',err);
      }
      
    }).catch(function (err) {
      console.log('o noz! removeAttachment err:',err);
    });
  }
  
          
}
