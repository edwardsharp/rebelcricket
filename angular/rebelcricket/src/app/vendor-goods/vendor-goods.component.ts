import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerInputEvent, MdSnackBar} from '@angular/material';

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
    private router: Router,
    private orderService: OrderService,
    private snackBar: MdSnackBar ) { }
	
	ngOnInit(): void {
    this.getVendorGoods();

    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.line_item_id = params.get('line_item_id');
        if(params.get('order_id') && params.get('order_id') != ''){
          return this.orderService.getOrder( params.get('order_id') );
        }else{ return []; }
      })
      .subscribe((order: Order) => {
        if(order && order._id && order.history){ 
          this.order = order;
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

  // clearCategories(){
  //   this.vendorGoodsIndexSelected = [];
  //   this.vendorGoodsIndex = undefined;
  //   // this.vendorGoodsIndex = [];
  //   console.log('clearCategories this.vendorGoodsCategories:', this.vendorGoodsCategories);
  //   // this.vendorGoodsCategories = [];
  // }

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
      console.log('!!! dialog closed result:', result);
      if(result.selectedItems && this.order.line_items){
        console.log('!!! ok    has selectedItems!')
        let line_item = this.order.line_items.find(li => li.service_label == this.line_item_id);
        if(line_item){
          console.log('!!! ok   found line_item:',line_item);
          line_item.vendor_goods = line_item.vendor_goods || [];
          line_item.vendor_goods.push({
            selected_items: result.selectedItems, 
            vendor_title: result.title, 
            vendor_id: result._id, 
            vendor_prod_id: result.prod_id, 
            vendor_category: result.category, 
            vendor_sub_category: result.sub_category 
          });
        }
        
        this.orderService.saveOrder(this.order).then(resp => {
          if(result.return_to_order){
            this.router.navigate(['/dashboard/order/', this.order._id]);
          }
        }, err =>{
          this.snackBar.open('Error: Could not add items to order!', '', {
            duration: 3000,
          });
          //...maybe try again??
          console.log('o noz! saveOrder err:',err);
        });
        
      }
  
    });
  }

}
