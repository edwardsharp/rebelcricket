import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerInputEvent} from '@angular/material';

import { VendorGood } from './vendor-good';
import { VendorGoodsService } from './vendor-goods.service';
import { VendorGoodsDialogComponent } from './vendor-goods-dialog.component';
import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';


@Component({
  selector: 'app-vendor-goods',
  templateUrl: './vendor-goods.component.html',
  styleUrls: ['./vendor-goods.component.css']
})
export class VendorGoodsComponent implements OnInit {

	loading: boolean = true;
	vendorGoods: Array<VendorGood> = [];
  vendorGoodsCategories: Array<{name:string,count:number}> = [];
	vendorGoodsIndexSelected: Array<string> = [];
  order: Order;
  line_item_id: string;

  constructor(
  	private vendorGoodsService: VendorGoodsService,
  	public dialog: MdDialog,
    private route: ActivatedRoute,
    private orderService: OrderService ) { }
	
	ngOnInit(): void {
    this.getVendorGoods();

    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.line_item_id = params['line_item_id'];
        if(params.get('order_id') && params.get('order_id') != ''){
          return this.orderService.getOrder( params.get('order_id') );
        }else{ return []; }
      })
      .subscribe((order: Order) => {
        if(order && order._id && order.history){ 
          this.order = order 
        }else{ this.line_item_id = undefined; }
      });

  }

  toggleVendorGoodCategory(category:string){
  	if(this.vendorGoodsIndexSelected.indexOf(category) !== -1){
  		this.vendorGoodsIndexSelected.splice(this.vendorGoodsIndexSelected.indexOf(category), 1);
  	}else{
  		this.vendorGoodsIndexSelected.push(category);	
  	}
  }

  selectAll(selected:boolean,items:any){
  	items.map(item => item.selected = selected);
  }

  getVendorGoods(): void {

    this.loading = true;
    this.vendorGoodsService.getVendorGoods().then((vendorGoods) => {
      
      this.vendorGoods = vendorGoods.rows.map(d=>{return d.doc});
      let catCount = this.vendorGoods
        .map(({ category }) => category)
        .reduce((categories, category) => {
          const count = categories[category] || 0;
          categories[category] = count + 1;
          return categories;
        }, {});

      for(let item of Object.keys(catCount)){
        this.vendorGoodsCategories.push({name: item,count: catCount[item]});
      }
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      console.error('o noz! getVendorGoods err:', err);
    });

  }

  vendorGoodsSubCategories(category:string){
    return this.vendorGoods
      .filter(g => g.category == category)
      .map(g => g.sub_category)
      .filter((value, index, self) => self.indexOf(value) === index);
  }
  vendorGoodsForCategory(category:string,sub_category:string){
    if(sub_category != undefined || sub_category != ''){
      return this.vendorGoods.filter(g => g.category == category && g.sub_category == sub_category);
    }else{
      return this.vendorGoods.filter(g => g.category == category);
    } 
  }

  //dialog stuff 
  animal: string;
  name: string;

  date: Date;
  destination: string;

  // constructor(public dialog: MdDialog) {}

  openDialog(data:any,order:Order): void {
    // console.log('openDialog data:',data);
    if(order && order._id){
      data.order = order;
    }
    let dialogRef = this.dialog.open(VendorGoodsDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('dialog closed');
      this.animal = result;
    });
  }

}
