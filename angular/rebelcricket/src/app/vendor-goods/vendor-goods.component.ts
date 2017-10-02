import { Component, OnInit, ElementRef } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerInputEvent} from '@angular/material';

import { VendorGoodsService } from './vendor-goods.service';
import {VendorGoodsDialogComponent} from './vendor-goods-dialog.component';

@Component({
  selector: 'app-vendor-goods',
  templateUrl: './vendor-goods.component.html',
  styleUrls: ['./vendor-goods.component.css']
})
export class VendorGoodsComponent implements OnInit {

	loading: boolean = true;
	vendorGoods: Array<{filename:string,items:any}> = [];
	selectedVendorGoodFiles: Array<string> = [];

  constructor(
  	private vendorGoodsService: VendorGoodsService,
  	public dialog: MdDialog ) { }
	
	ngOnInit(): void {
    this.getVendorGoods();
  }

  toggleVendorGoodFile(filename:string){
  	if(this.selectedVendorGoodFiles.indexOf(filename) !== -1){
  		this.selectedVendorGoodFiles.splice(this.selectedVendorGoodFiles.indexOf(filename), 1);
  	}else{
  		this.selectedVendorGoodFiles.push(filename);	
  		setTimeout(() => this.goTo(filename), 500);
  	}
  }

  selectAll(selected:boolean,items:any){
  	items.map(item => item.selected = selected);
  }

  getVendorGoods(): void {

    this.loading = true;
    this.vendorGoodsService.getVendorGoods().then((vendorGoods) => {
      console.log('this.vendorGoodsService.getVendorGoods() vendorGoods:',vendorGoods);
      this.vendorGoods = vendorGoods.rows;
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      console.error('o noz! getVendorGoods err:', err);
    });

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
    let dialogRef = this.dialog.open(VendorGoodsDialogComponent, {
      
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('dialog closed');
      this.animal = result;
    });
  }

}
