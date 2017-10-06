import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable }           from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {MdChipInputEvent, ENTER} from '@angular/material';

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

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit() {
    this.getSettings();
  	// this.id = this.route.paramMap
   //  	.switchMap((params: ParamMap) => params.get('id') );
      // this.service.getHero(params.get('id')));

    // let id = this.route.snapshot.paramMap.get('id');

    // this.sub = this.route.params.subscribe(params => {
    //    this.id = params['id']; 
    // });

    // okay
    // this.route.params
    // 	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    // 	.subscribe((order: Order) => this.order = order);

    // this.order = this.route.paramMap
    // 	.switchMap( (params: ParamMap) =>
    //   	this.orderService.getOrder( params.get('id') )
    //   );

    // .switchMap() is a debounced observable; rad!
    this.route.paramMap
    	.switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
    	.subscribe((order: Order) => {
        if(order && order._id){
          this.order = order;
        }else{

          this.order = new Order;
          console.log('a new order:',this.order);
        } 
       
      });
    
   //  setTimeout( () => {    //use ()=> syntax
   //    console.log('zomg, this this!',this.order);
		 // }, 3000);

  //   this.orderSub.subscribe(
		//    value => this.obj = value,
		//    (errData) => { this.renderErrors() },
		//    () => {
		//        this.variableFilledWhenDone = true;
		//    }
		// );

    // console.log('zomg this.route.paramMap:',this.id);

    // this.route.params
	   //  .map(params => params['id'])
	   //  .switchMap(id => this.contactsService.getContact(id))
	   //  .subscribe(contact => this.contact = contact);


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
      if(resp["rev"]){
        this.order["_rev"] = resp["rev"];
      }
      this.needsSave = false;
    }, err =>{
      console.log('o noz! saveOrder err:',err);
    });
  }

  deleteOrder() {
    if(this.order._id && this.order._rev){
      this.orderService.removeOrder(this.order).then(resp => {
        if(resp["ok"]){
          this.router.navigate(['/dashboard/orders']);
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

    if(e.target.files[0] != undefined){
      // e.target.disabled = true;
      var file = e.target.files[0]; // file is a Blob
      try{
        this.orderService.addAttachment(this.order._id, file.name, this.order._rev, file, file.type);
        // this.saveOrder();
      }catch(err){
        this.gfxError = true;
        console.log('o noz! quoteFileChnaged err:',err);
      }
      
    }


  }

  attachmentKeysForOrder(){
    // console.log('aaaarg attachmentKeysFor keyz:',order._attachments ? Object.keys(order._attachments) : []);
    // console.log('order:',order);
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
      if(result["rev"]){
        this.order._rev = result["rev"];
      }
      try{
        delete this.order._attachments[itemKey];
      }catch(err){
        console.log('o noz! delete _attachments err:',err);
      }
      
    }).catch(function (err) {
      console.log('o noz! removeAttachment err:',err);
    });
  }
  
          
}
