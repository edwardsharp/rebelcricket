import { Component, OnInit, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

import * as _ from 'underscore';

@Component({
  selector: 'app-vendor-goods-dialog',
  templateUrl: './vendor-goods-dialog.component.html',
  styleUrls: ['./vendor-goods-dialog.component.css']
})
export class VendorGoodsDialogComponent implements OnInit {


  ngOnInit() {
  }

  constructor(
    public dialogRef: MdDialogRef<VendorGoodsDialogComponent>,
    @Inject(MD_DIALOG_DATA) public vendorItem: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //sometimez shit is nested in a deep array (like low inventory tracking), which is mostly
  // data cruft so try and iron that out flat, here:
  flattenColorName(color:any){
    if(color && color.constructor === Array){
      return _.flatten(color)[0];
    }else{
      return color;
    }
  }

  flattenSizePrice(size_price:any){
    if(size_price && size_price.constructor === Array){
      return _.flatten(size_price)[0];
    }else{
      return size_price;
    }
  }

  backgroundImgFor(href_items:Array<string>, color:string){
    try{
      return href_items.filter(i=> i[0] == color)[0][1]
    }catch(e){
      try{
        if(color && color.constructor === Array){
          return href_items.filter(i=> i[0] == color[0])[0][1];
        }else{
          return [];
        }
      }catch(e){ return []; }
    }
  }

  // colorPricesForName(items:any, name:string){
  //   let retArr = [];
  //   _.each(items.color_prices, function(color_prices){
  //     if(_.any(_.flatten(color_prices[0]), function(item){return item == name})){
  //       retArr = this.flattenColorPricesForName(color_prices);
  //       retArr.shift();
  //     }
  //   });
  //   return retArr;
  // }

  // flattenColorPricesForName(color_prices:any): Array<any>{
  //   return _.map(color_prices as any, function(clr_price){ return {size: _.flatten(clr_price as any)[0], price: _.flatten(clr_price as any)[1]} });
  // }

  itemSelectedChange(e:any, item:any): void{
    console.log('itemSelectedChange e.checked,item:',e.checked,item);
    let color = this.flattenColorName(item.color);
    if(e.checked){
      let sizePrices = [];
      for(let sp of item.size_prices){
        sizePrices.push({ size: sp[0], price: this.flattenSizePrice(sp[1]) });
      }
      this.vendorItem.selectedItems = this.vendorItem.selectedItems || [];
      this.vendorItem.selectedItems.push({
        color: color,
        size_prices: sizePrices
      });
    }else if(this.vendorItem.selectedItems){
      let idx = this.vendorItem.selectedItems.indexOf(this.vendorItem.selectedItems.find(i => i.color = color))
      if(idx >= 0){
        this.vendorItem.selectedItems.splice(idx, 1);
      }
    }
    
  }

  closeAndReturnToOrder(vendorItem: any): void{
    console.log('closeAndReturnToOrder vendorItem:',vendorItem);
    vendorItem['return_to_order'] = true;
  }
  closeAndKeepBrowsing(vendorItem: any): void{
    console.log('closeAndKeepBrowsing vendorItem:',vendorItem);
    vendorItem['return_to_order'] = false;
  }
  closeClick(): void{

  }

}
