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
    try{
      if(color[0] && color[0].constructor === Array){
        // console.log('flattenColorName ret color[0][0]:',color[0][0]);
        return color[0][0];
      }else if(color && color.constructor === Array){
        return color[0];
      }else{
        // console.log('flattenColorName ret color:',color);
        return color;
      }
    }catch(e) { return color; }
  }

  flattenSizePrice(size_price:any){
    try{
      if(size_price[0] && size_price[0].constructor === Array){
        return size_price[0][0];
      }else if(size_price && size_price.constructor === Array){
        return size_price[0];
      }else{
        return size_price;
      }
    }catch(e) { return size_price; }
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

  colorPricesForName(items:any, name:string){
    let retArr = [];
    _.each(items.color_prices, function(color_prices){
      if(_.any(_.flatten(color_prices[0]), function(item){return item == name})){
        retArr = _.map(color_prices as any, function(clr_price){ return {size: _.flatten(clr_price as any)[0], price: _.flatten(clr_price as any)[1]} });
        retArr.shift();
      }
    });
    return retArr;
  }

}
