import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/fromEvent';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {MatChipInputEvent, MatSnackBar, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Order, LineItem, OrderField, OrderFieldType, Attachments } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings, Service } from '../settings/settings';
import { AppTitleService } from '../app-title.service';
import { Color, COLORS } from '../gfx/color';

import * as _ from 'underscore';

const COMMA = 188;
const ENTER = 13;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy  { 

  @Input('order') order: Order;
  @Input('nointernal') nointernal: boolean;
  @ViewChild('quoteDesignFile') quoteDesignFile:ElementRef;
  @ViewChild('colorInput') colorInput:ElementRef;
  @ViewChild(MatAutocompleteTrigger) matAutocomplete: MatAutocompleteTrigger;

  origOrder: Order;
	// id: string;
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

  gridCols: number;

  email = new FormControl('', [Validators.required, Validators.email]);
  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  res: any;
  files: Array<any>;

  colorCtrl: FormControl;
  filteredColors: Observable<any[]>;
  colors: Color[] = COLORS;

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private appTitleService: AppTitleService,
    private location: Location,
    private httpClient: HttpClient
  ) { 
    this.order_field_types = {
      'Text':     OrderFieldType.Text,
      'Textarea': OrderFieldType.Textarea,
      'Checkbox': OrderFieldType.Checkbox,
      'Number':   OrderFieldType.Number,
      'Select':   OrderFieldType.Select,
      'Date':     OrderFieldType.Date
    };
    this.colorCtrl = new FormControl();
    this.filteredColors = this.colorCtrl.valueChanges
      .pipe(
        startWith(''),
        map(color => color ? this.filterColors(color) : this.colors.slice())
      );
  }

  

  ngOnInit() {
    this.setGridCols();

    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => this.setGridCols());

    // setTimeout(()=>{this.getOrderRevs()},3000);
    // .switchMap() is a debounced observable; rad!

    // console.log('[order-detail] ngOnInit order:',this.order);
    if(!this.order){
      this.route.paramMap
        .switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
        .subscribe((order: Order) => {
          if(order && order._id && order._id == this.route.snapshot.params.id){
            this.order = order;
            if(this.order.attachmentDimensions == undefined){
              this.order.attachmentDimensions = {};
            }
            this.origOrder = JSON.parse(JSON.stringify(order));
            this.setTitle();
            // this.checkAllServicesNeedHidden();
          }else if(order._id){
            this.order = order;
            this.origOrder = order;
            if(!this.nointernal){
              this.location.replaceState("/dashboard/order/"+order._id);
            }
            this.snackBar.open('New Order Created!', '', {
              duration: 2000,
            });          
          }else{
            console.log("zomg nothing to do! order:",order);
          }
        });
    }
    

    this.getSettings();
  }

  ngOnDestroy() {
    // this.orderSub.unsubscribe();
    this.appTitleService.resetTitle();
  }

  setGridCols(){
    if(window.innerWidth < 450){
      this.gridCols = 1;
    }else if(window.innerWidth > 449 && window.innerWidth < 600){
      this.gridCols = 2;
    }else if(window.innerWidth > 599 && window.location.pathname.match(/order/)){
      this.gridCols = 4;
    }else{
      this.gridCols = 2;
    }
  }

  onChange(event: any) {
    // changes.prop contains the old and the new value...
    console.log('order-detail.component ngOnChanges event:',event);
    this.needsSave = true;
  }


  getSettings(): void {
    this.settingsService.getSettings().then(settings => {
      this.settings = settings;
      if(settings && this.order){
        this.order.base_order_fields = this.order.base_order_fields || this.settings.base_order_fields;
      }
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

    const formData = new FormData();
    if(e.target.files.length > 10){
      this.snackBar.open('Error! Please limit to 10 files or less.', '', {
        duration: 5000
      });  
      this.quoteDesignFile.nativeElement.value = '';
      this.quoteDesingUploading = false;
    }else{
      for (const file of e.target.files) {
        formData.append('files', file);
      }
      this.httpClient.post('/upload', formData)
        .subscribe(
          res => {

            this.order.attachments = this.order.attachments || [];
            this.order.attachments.push( new Attachments(res) );
            
            this.order.history = this.order.history || [];
            const description = this.attachmentItemsForOrder().map( a => a.name ).join(', ');
            this.order.history.push({date: new Date, title: `Added ${e.target.files.length} Attachment${e.target.files.length > 1 ? 's' : ''}`, description: description});

            this.onChange('attachmentsChanged');

            console.log('upload response:',res);
            this.quoteDesignFile.nativeElement.value = '';
            this.res = JSON.parse(JSON.stringify(res));
            this.files = res["files"];
            this.quoteDesingUploading = false;
            //since the imagemagick conversion is async, do this hack to reload img srcz
            setTimeout(() => {
              this.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 2500);
            setTimeout(() => {
              this.files = this.res.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 10000);
            
            for(let file of res["files"]){
              this.order.canvasLayerColors = this.order.canvasLayerColors || {};
              this.order.canvasLayerColors[file["name"]] = [];
            }

            let msg = '';
            if(this.orderAttachmentCount(this.order) > 1){
              msg = `${this.orderAttachmentCount(this.order)} Attachments added!`
            }else{
              msg = `Attachment added!`;
            }
            this.snackBar.open(msg, '', {
              duration: 2000,
            });
          },
          err => {
            console.log("Error occured err:",err);
            this.quoteDesignFile.nativeElement.value = '';
            this.quoteDesingUploading = false;
            this.snackBar.open('Upload Error!', '', {
              duration: 2000
            });  
          }
        );
    }

  }

  orderAttachmentCount(order: Order): number {
    return order.attachments ? order.attachments.map( a => { return a.files.length } ).reduce( (i,v) => i + v ) : 0;
  }

  getDimensionsFor(itemKey:string): void {
    try{
      const content_type = this.order["_attachments"][itemKey]["content_type"];
      const data = this.order["_attachments"][itemKey]["data"];
      if(data && content_type && content_type.match(/image/i)){
        var img = new Image();
        img.onload = () => {
          let height = (img.height / 300).toFixed(2);
          let width = (img.width / 300).toFixed(2);
          this.order.attachmentDimensions[itemKey] = `h:${height}" w:${width}"`;
        };
        img.src = `data:${content_type};base64,${data}`;
      }
    }catch(err){ console.log('dimensionsFor err:',err); } 
  }

  attachmentItemsForOrder(): Array<any>{
    //this.order.attachments.map( a => { return a.files.map( b => b.name) } ).reduce((a, b) => a.concat(b), []) 
    return this.order.attachments 
      ? this.order.attachments.map( a => { return a.files } ).reduce((a, b) => a.concat(b), [])
      : [];
  }
  
  // attachmentSrcFor(order:Order,itemKey:string){
  //   try{
  //     const content_type = order["_attachments"][itemKey]["content_type"];
  //     //this.sanitizer.bypassSecurityTrustUrl(
  //     const data = order["_attachments"][itemKey]["data"];
  //     return (data && content_type && content_type.match(/image/i)) ? `data:${content_type};base64,${data}` : ''; 
  //   }catch(err){
  //     return '';
  //   }
         
  // }

  // canDisplayAttachmentImg(itemKey:string):boolean{
  //   let _type = this.order["_attachments"][itemKey]["content_type"];
  //   return _type.match(/image\/png/i) || _type.match(/image\/jpeg/i) || _type.match(/image\/svg/i)
  // }

  deleteAttachmentFor(itemKey:string){
    try{
      for(let attachments of this.order.attachments){
        const found = attachments.files.find(a => a.name == itemKey );
        if(found){
          attachments.files.splice(attachments.files.indexOf(found), 1);
        }
      }
    }catch(err){
      // e.target.disabled = false;
      console.log('o noz! delete _attachments err:',err);
    }
  }

  addColorFor(selectedLayer:string, color:string): void{
    this.colorInput.nativeElement.value = '';
    this.matAutocomplete.closePanel();
    if(this.order.canvasLayerColors[selectedLayer].indexOf(color) == -1){
      this.order.canvasLayerColors[selectedLayer].push(color);
    }
  }

  deleteColorFor(selectedLayer:string, color:string): void {
    this.order.canvasLayerColors[selectedLayer].splice(this.order.canvasLayerColors[selectedLayer].indexOf(color), 1);
  }

  filterColors(name: string) {
    return this.colors.filter(color =>
      color.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selectedColor(name: string, event: MatAutocompleteSelectedEvent) {
    this.addColorFor(name, event.option.value);
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

  orderQtyTotal(order:Order): number{
    if(order && order.line_items){
      return order.line_items.reduce( (sum, item) => {
        return sum + (isNaN(item.quantity) ? 0 : item.quantity );
      }, 0 );
    }else{
      return 0;
    }
  }

  orderTotal(order: Order): number{
    if(order && order.line_items){
      return order.line_items.reduce( (sum, item) => {
        return (sum + (isNaN(item.total) ? 0 : item.total ));
      }, 0);
    }else{
      return 0;
    }
  }

  uploadFile(){
    this.quoteDesignFile.nativeElement.click();
  }

  servicesList(){
    if(this.settings && this.settings.services){
      if(this.nointernal){
        return this.settings.services.filter( service => { return !service.internal });
      }else{
        return this.settings.services || [];
      }
    }else{
      return [];
    }
  }

  lineItemsFor(items){
    if(this.nointernal){
      return items.filter( item => { return !item.internal });
    }else{
      return items;
    }
  }

  baseOrderFields(){
    if(this.order && this.order.base_order_fields){
      if(this.nointernal){
        return this.order.base_order_fields.filter( field => { return !field.internal });
      }else{
        return this.order.base_order_fields;
      }
    }
  }

  submitOrder(): void {
    this.orderService.saveQuote(this.order).then(resp => {
      if(resp["rev"]){
        this.order["_rev"] = resp["rev"];
      }
      this.httpClient.post('/quote', {
        order: this.order
      }).subscribe( data => {
        console.log('GREAT! post /quote response data:',data);
        //todo: navigate? or.

        this.order.status = "new";
        this.order.confirmation = Date.now();
        this.order.submitted = true;
        this.orderService.saveQuote(this.order).then(resp => {
          if(resp["rev"]){
            this.order["_rev"] = resp["rev"];
          }
          this.snackBar.open('Thank you!', '', {duration: 5000}); 
        }, err =>{
          console.log('o noz! submitOrder this.saveQuote() err:',err);
          this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
        });

      }, err => {
        console.log('post /quote ERR:',err);
        this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
      });
    }, err =>{
      console.log('o noz! submitOrder this.saveQuote() err:',err);
      this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
    });
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
