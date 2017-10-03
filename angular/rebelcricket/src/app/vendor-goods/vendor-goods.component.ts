import { Component, OnInit, ElementRef } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerInputEvent} from '@angular/material';

import { VendorGood } from './vendor-good';
import { VendorGoodsService } from './vendor-goods.service';
import {VendorGoodsDialogComponent} from './vendor-goods-dialog.component';

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

  constructor(
  	private vendorGoodsService: VendorGoodsService,
  	public dialog: MdDialog ) { }
	
	ngOnInit(): void {
    this.getVendorGoods();
  }

  toggleVendorGoodCategory(category:string){
  	if(this.vendorGoodsIndexSelected.indexOf(category) !== -1){
  		this.vendorGoodsIndexSelected.splice(this.vendorGoodsIndexSelected.indexOf(category), 1);
  	}else{
  		this.vendorGoodsIndexSelected.push(category);	
  		setTimeout(() => this.goTo(category), 500);
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

  goTo(hash: string): void {
		window.location.hash = hash;
	}

  //dialog stuff 
  animal: string;
  name: string;

  date: Date;
  destination: string;

  // constructor(public dialog: MdDialog) {}

  openDialog(data:any): void {
    console.log('openDialog data:',data);
    let dialogRef = this.dialog.open(VendorGoodsDialogComponent, {
      
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('dialog closed');
      this.animal = result;
    });
  }

}
