import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable }           from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {MdChipInputEvent, ENTER, MdSnackBar} from '@angular/material';

import { Order, LineItem, OrderField, OrderFieldType } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings, Service } from '../settings/settings';
import { AppTitleService } from '../app-title.service';

import * as _ from 'underscore';

const COMMA = 188;


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy  { 

  origOrder: Order;
	// id: string;
  order: Order;
	// private orderSub: any;
  settings: Settings;
  needsSave: boolean = false;
  quoteDesingUploading: boolean = false;
  gfxError: boolean = false;
  revisionIds: Array<string> = [];
  // serializedPanes: Array<string>;
  selectedService: Service;

  order_field_types: any;

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private snackBar: MdSnackBar,
    private appTitleService: AppTitleService 
  ) { 
    this.order_field_types = {
      'Text':     OrderFieldType.Text,
      'Textarea': OrderFieldType.Textarea,
      'Checkbox': OrderFieldType.Checkbox,
      'Number':   OrderFieldType.Number,
      'Select':   OrderFieldType.Select
    };
  }


  ngOnInit() {
    this.getSettings();

    // setTimeout(()=>{this.getOrderRevs()},3000);
    // .switchMap() is a debounced observable; rad!
    this.route.paramMap
    	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    	.subscribe((order: Order) => {
        if(order && order._id && this.route.snapshot.params.id != 'new'){
          this.order = order;
          this.origOrder = JSON.parse(JSON.stringify(order));
          this.setTitle();
        }else{
          this.order = new Order;
          this.origOrder = new Order;
          this.router.navigate(['/dashboard/order/', this.order._id]);
          this.snackBar.open('New Order Created!', '', {
            duration: 2000,
          });          
        } 
      });
  }

  ngOnDestroy() {
    // this.orderSub.unsubscribe();
    this.appTitleService.resetTitle();
  }

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

    let description = '';
    const orderDiff = _.omit(this.origOrder, (v,k) => { return this.order[k] === v; });
    if(orderDiff){
      let orderDiffKeys = Object.keys(orderDiff);
      if(orderDiffKeys.indexOf("history") > 0){
        orderDiffKeys.splice(orderDiffKeys.indexOf("history"),1);
      }
      description = `Fields: ${orderDiffKeys.join(', ')}`;
    }
    
    if(this.order.history){
      this.order.history.push({date: new Date, title: 'Updated', description: description});
    }else{
      this.order.history = [{date: new Date, title: 'Created', description: description}];
    }
    
    // console.log('SAVE ORDER DIFF:',);
    console.log('SAVE ORDER orig and now:',this.origOrder, this.order);
    
    this.setTitle();
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

    let description; 

    this.order._attachments = this.order._attachments || {};
    for(let file of e.target.files){
      // console.log('quoteFileChnaged()! file:',file);
      description = description ? `${description}, ${file.name}` : file.name;
      this.order._attachments[file.name] = {
        "content_type": file.type,
        "data": file
      }
    }

    this.order.history = this.order.history || [];
    this.order.history.push({date: new Date, title: `Added ${e.target.files.length} Attachment${e.target.files.length > 1 ? 's' : ''}`, description: description});

    this.orderService.saveOrder(this.order).then(resp => {
      // console.log('zomg, resp:',resp);
      if(resp["rev"]){
        this.order._rev = resp["rev"];
      }

      this.orderService.getOrder( this.order._id ).then((order: Order) => {
        if(order && order._id){
          this.order = order;
          this.origOrder = JSON.parse(JSON.stringify(order)); //clone
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

  setTitle(): void {
    let _t = '';
    _t += this.order.name;
    _t += this.order.org ? ` (${this.order.org})` : ''; 
    this.appTitleService.setTitle(_t);
  }
  
  getOrderRevs(): void {
    this.orderService.getOrderRevs(this.order._id).then(history => {
      try{
        console.log('getOrderRevs() revisions:',history["0"].ok._revisions.ids);
        this.revisionIds = history["0"].ok._revisions.ids;

        this.getOrderHistory(this.revisionIds);
       
        this.getRevsDiff(this.revisionIds[this.revisionIds.length -1], this.revisionIds[this.revisionIds.length -2]);

      }catch(e){
        // eh.
      }
      
    });
  }

  getOrderHistory(revision_ids:Array<string>): void {
    console.log('getOrderHistory for revision_ids:',revision_ids);
    this.orderService.getOrderHistory(this.order._id, revision_ids).then(function(response) {
      console.log('getOrderHistory() response:',response);
    });

  }

  getRevsDiff(revA:string, revB:string): void {
    console.log('getRevsDiff for revision_ids:', revA, revB);
    this.orderService.getRevsDiff(this.order._id, revA, revB).then(function(response) {
      console.log('getRevsDiff() response:',response);
    });

  }

  historyLabel(): string {
    return `History (${this.order.history && this.order.history.length ? this.order.history.length : 0})`;
  }

  addOrderLineItem(): void {
    if(this.selectedService){
      this.order.line_items = this.order.line_items || [];
      let li = new LineItem;
      li.service_key = this.selectedService.slug;
      li.service_label = this.selectedService.name;
      li.service = this.selectedService;
      li.items = this.orderFieldsForService(this.selectedService);
      this.order.line_items.push(li);
     }
     this.selectedService = undefined; 
  }

  removeOrderLineItem(item: LineItem): void {
    let idx = this.order.line_items.indexOf(item);
    if(idx >= 0){
      this.order.line_items.splice(idx, 1);
    }
  }

  clearDueDate(): void {
    this.order.date_needed = undefined;
    this.needsSave = true;
  }

  tagsChanged(tags:string[]): void {
    this.order.tags = tags;
    this.needsSave = true;
  }

  serviceNeedsDisabled(service: Service): boolean{
    return this.order && this.order.line_items && this.order.line_items.some( li => li.service_label == service.name); 
  }
   
  orderFieldsForService(service: Service): Array<OrderField> {
    try{
      return this.settings.services.find( s => s.name == service.name ).order_fields
    }catch(e){ return []; }
    
  }       
}  
