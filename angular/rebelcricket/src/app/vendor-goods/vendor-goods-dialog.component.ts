import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { VendorGoodsService } from './vendor-goods.service';
import { VendorGoodItem } from './vendor-good';

import * as _ from 'underscore';

@Component({
  selector: 'app-vendor-goods-dialog',
  templateUrl: './vendor-goods-dialog.component.html',
  styleUrls: ['./vendor-goods-dialog.component.css']
})
export class VendorGoodsDialogComponent implements OnInit {

  vendorItems: Array<VendorGoodItem> = [];
  colors: Array<any> = []; //{name: string, hexCode: string}
  ngOnInit() {
    this.itemDetails();
  }

  constructor(
    public dialogRef: MatDialogRef<VendorGoodsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public vendorItem: any,
    private vendorGoodsService: VendorGoodsService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  featuresList(vendorItem){
    return vendorItem.features.split('; ').filter(String);
  }

  itemDetails(){
    this.vendorGoodsService.getItems(this.vendorItem.styleCode)
    .subscribe( data => {
        console.log('getItems response data:',data["data"]);
        this.vendorItems = data["data"];

        this.colors = _.uniq( this.vendorItems.map(a => 
          [{name: a.colorName, hexCode: `#${a.hexCode}`}][0])
          , item => { 
            return item.name; 
          });

        _.each(this.colors, color => {
          color["size_prices"] = this.vendorItems
            .filter(a => a.colorName == color.name)
            .map(a => [{sizeName: a.sizeName, retailPrice: parseFloat(a.retailPrice).toFixed(2) }][0] )
            .sort((a, b) => {
              return parseFloat(a.retailPrice) - parseFloat(b.retailPrice);
            });
        })
        console.log('this.colors:',this.colors);

      }, err => {
        console.log('getItems ERR:',err);
      });
  }

  itemSelectedChange(e:any, item:any): void{
    console.log('itemSelectedChange e.checked,item:',e.checked,item,);
    
    console.log('this.vendorItem',this.vendorItem);
    if(e.checked){
      this.vendorItem.selectedItems = this.vendorItem.selectedItems || [];
      this.vendorItem.selectedItems.push(item);
    }else if(this.vendorItem.selectedItems){
      let idx = this.vendorItem.selectedItems.indexOf(item);
      if(idx > -1){
        this.vendorItem.selectedItems.splice(idx, 1);
      }
    }
    console.log('this.vendorItem.selectedItems:',this.vendorItem.selectedItems);
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
