import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable }           from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

import { Order, LineItem, OrderField, OrderFieldType } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings, Service } from '../settings/settings';
import { AppTitleService } from '../app-title.service';

import * as _ from 'underscore';

const COMMA = 188;
const ENTER = 13;

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
  allServicesNeedHidden: boolean;

  email = new FormControl('', [Validators.required, Validators.email]);
  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
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
          // this.checkAllServicesNeedHidden();
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


  add(event: MatChipInputEvent): void {
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

  addOrderLineItem(event): void {
    console.log('addOrderLineItem event:',event);
    if(this.selectedService){
      this.order.line_items = this.order.line_items || [];
      let li = new LineItem;
      li.service_key = this.selectedService.slug;
      li.service_label = this.selectedService.name;
      li.service = this.selectedService;
      li.items = this.orderFieldsForService(this.selectedService);
      this.order.line_items.push(li);
      this.saveOrder();

     }
     this.selectedService = null; 

     // this.checkAllServicesNeedHidden();
  }

  removeOrderLineItem(item: LineItem): void {
    let idx = this.order.line_items.indexOf(item);
    if(idx >= 0){
      this.order.line_items.splice(idx, 1);
      // this.checkAllServicesNeedHidden();
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

  // serviceNeedsDisabled(service: Service): boolean{
  //   return this.order && this.order.line_items && this.order.line_items.some( li => li.service_label == service.name); 
  // }
  
  // checkAllServicesNeedHidden(): void {
  //   setTimeout(() => {
  //     this.allServicesNeedHidden = this.order.line_items.map(li => li.service.name).join() == this.settings.services.map(s => s.name).join(); 
  //   }, 500);
  // }

  orderFieldsForService(service: Service): Array<OrderField> {
    try{
      return this.settings.services.find( s => s.name == service.name ).order_fields
    }catch(e){ return []; }
    
  }

  sizeQtyChanged(sel_item:any, line_item: LineItem): void{
    // console.log('sizeQtyChanged sel_item:',sel_item);

    sel_item.qty_total = sel_item.size_prices.reduce( (sum, value) => sum + (isNaN(parseInt(value.quantity)) ? 0 : parseInt(value.quantity) ), 0 );

    sel_item.price_total = sel_item.size_prices.reduce( (sum, value) => {
      if( !isNaN(parseInt(value.quantity))
        && !isNaN(parseFloat(value.price.replace(/\$/,'').trim())) ){
        return (sum + (parseFloat(value.price.replace(/\$/,'').trim()) * parseInt(value.quantity)));
      }else{
        return sum;
      }
    }, 0);

    this.sizeQtyTotalChanged(line_item);
  }

  sizeQtyTotalChanged(line_item:LineItem): void{
    console.log('sizeQtyTotalChanged line_item:',line_item);
    // if(line_item.vendor_goods){
      line_item.quantity = line_item.vendor_goods.reduce( (sum,value) => {
        return sum + value.selected_items.reduce( (sum, value) => sum + (isNaN(parseInt(value.qty_total)) ? 0 : parseInt(value.qty_total) ), 0 );
      }, 0);

      line_item.total = line_item.vendor_goods.reduce( (sum, value) => {
        return sum + value.selected_items.reduce( (sum,value) => {
          if( !isNaN(parseFloat(value.price_total)) ){
            return sum + parseFloat(value.price_total);
          }else{
            return sum;
          }
        }, 0);
      }, 0);
    // }
  }

  deleteVendorGoodItem(selected_items:any, item:any, line_item: LineItem): void{
    let idx = selected_items.indexOf(item);
    if(idx >= 0){
      selected_items.splice(idx, 1);
      this.sizeQtyTotalChanged(line_item);
    }
  }

  qtyTotalChanged(field, line_item): void{
    if(field && field.name.toLowerCase() == 'qty'){
      line_item.quantity = parseFloat(field.value);
    }else if(field && field.name.toLowerCase() == 'total'){
      line_item.total = parseFloat(field.value);
    }
    this.onChange('qtyTotalChanged');
  }

  hintFor(field){
    let s = '';
    if(field && field.min != undefined && !isNaN(parseInt(field.min))){
      s = 'Minimum: '+field.min;
    }
    if(field && field.max != undefined && !isNaN(parseInt(field.max))){
      if(s.length > 0){
        s += ', Maxium: '+field.max;
      }else{
        s = 'Maxium: '+field.max;
      }
    }
    return s;
  }

  // numberControl(field){
  //   let validatorz = [];
  //   if(field.required){
  //     validatorz.push(Validators.required)
  //   }
  //   if(field.min && !isNaN(parseInt(field.min))){
  //     validatorz.push(Validators.min(field.min));
  //   }
  //   if(field.max && !isNaN(parseInt(field.max))){
  //     validatorz.push(Validators.max(field.max));
  //   }
  //   return new FormControl(field.value, validatorz);
  // }
  // getNumberErrorMessage(field) {
  //   return field.invalid ? 'Invalid.' : '';
  // }
  // numberChange(field){
  //   if(field.required){
  //     console.log('invalid cuz required!');
  //     field.invalid = !(field.value == undefined || field.value == '');
  //   }
  //   if(field.min && !isNaN(parseInt(field.min))){
  //     console.log('min invalid?', !(field.value >= parseInt(field.min)));
  //     field.invalid = !(field.value >= parseInt(field.min));
  //   }
  //   if(field.max && !isNaN(parseInt(field.max)) ){
  //     field.invalid = !(field.value <= parseInt(field.max));
  //   }
  //   this.onChange('numberChange');
  // }

}  
