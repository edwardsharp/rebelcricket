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

  backgroundImgFor(href_items:Array<string>, color:string){
    // return `'url('${href_items.filter(i=> i[0] == color)[0][1]}')'`;
    try{
      return href_items.filter(i=> i[0] == color)[0][1]
    }catch(e){
      if(color.constructor === Array){
        return href_items.filter(i=> i[0] == color[0])[0][1];
      }else{
        return [];
      }
      // console.log('ZOMGGG DEBUG THIS: color:',color,' href_items:',href_items);
      // console.log('ZOMGGG DEBUG THIS: href_items.filter(i=> i[0] == color):',href_items.filter(i=> i[0] == color));

      
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


// <h1 md-dialog-title>{{data.title}}</h1>
//     <div md-dialog-content>
//       <p>title:</p>
//       <md-form-field>
//         <input mdInput tabindex="1" [(ngModel)]="data.title">
//       </md-form-field>
//     </div>
//     <div md-dialog-actions>
//       <button md-button [md-dialog-close]="data.title" tabindex="2">done</button>
//       <button md-button (click)="onNoClick()" tabindex="-1">clear</button>
//     </div>
