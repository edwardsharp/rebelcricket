import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatSnackBar} from '@angular/material';

import { VendorGoodStyle, VendorGoodItem } from './vendor-good';
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
  // vendorGoods: Array<VendorGood> = [];
  vendorGoodsStyles: Array<VendorGoodStyle> = [];
  vendorGoodsItems: Array<VendorGoodItem> = [];

  vendorGoodsCategories: Array<{categoryName:string,count:number}> = [];
  
  vendorGoodsIndexSelected: Array<string> = [];
  vendorGoodsIndexLoaded: Array<string> = [];

  order: Order;
  line_item_id: string;
  catalog: string;

  constructor(
    private vendorGoodsService: VendorGoodsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.catalog = params.get('catalog') || 'default';
        console.log('CATALOG:',this.catalog);
        this.getCategories();
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

    if(this.vendorGoodsIndexLoaded.indexOf(category) == -1){
      this.vendorGoodsIndexLoaded.push(category)
      this.vendorGoodsService.getStyle(this.catalog, category).subscribe( data => {
        this.vendorGoodsStyles = this.vendorGoodsStyles.concat(data["data"]);
      }, err => {
        console.log('getStyle ERR:',err);
      });
    }
  }


  getCategories(){
     this.vendorGoodsService.getStyles(this.catalog).subscribe( data => {
        console.log('getStyles for cat:',this.catalog,' response data:',data);
        // return data["data"];
        this.vendorGoodsCategories = data["data"];
        this.loading = false;
      }, err => {
        console.log('getStyles ERR:',err);
        // return [];
      });;
  }

  vendorGoodsForStyle(category:string): Array<VendorGoodStyle>{
    return this.vendorGoodsStyles.filter(g => g.categoryName == category);
  }


  //dialog stuff 

  date: Date;
  destination: string;

  openDialog(data:any,order:Order): void {
    // console.log('openDialog data:',data);
    if(order && order._id){
      data.order = order;
    }
    let dialogRef = this.dialog.open(VendorGoodsDialogComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('!!! dialog closed result:', result);
      if(result && result.selectedItems && this.order && this.order.line_items){
        // console.log('!!! ok    has selectedItems!')
        let line_item = this.order.line_items.find(li => li.service_label == this.line_item_id);
        if(line_item){
          // console.log('!!! ok   found line_item:',line_item);
          line_item.vendor_goods = line_item.vendor_goods || [];
          line_item.vendor_goods.push({
            selected_items: result.selectedItems, 
            vendor_title: result.millName, 
            vendor_prod_id: result.styleCode, 
            vendor_category: result.categoryName
          });
        }
        
        this.orderService.saveOrder(this.order).then(resp => {
          // console.log('saveOrder resp:',resp);
          this.order._rev = resp["rev"];
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
