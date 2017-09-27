import { Component, OnInit, ElementRef } from '@angular/core';
import { Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { VendorGoodsService } from './vendor-goods.service';
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
  	private elementRef:ElementRef ) { }

  toggleVendorGoodFile(filename:string){
  	if(this.selectedVendorGoodFiles.indexOf(filename) !== -1){
  		this.selectedVendorGoodFiles.splice(this.selectedVendorGoodFiles.indexOf(filename), 1);
  	}else{
  		this.selectedVendorGoodFiles.push(filename);	
  		setTimeout(() => this.goTo(filename), 1000);
  	}
  }

  selectAll(selected:boolean,items:any){
  	items.map(item => item.selected = selected);
  }

  getVendorGoods(): void {

    this.loading = true;

    for(let vendorGood of this.vendorGoodsService.getAllVendorGoods()){
    	vendorGood.promise.then((vendorGoods) => {
      	this.vendorGoods.push({filename: vendorGood.filename, items: vendorGoods});
      	this.loading = false;
    	})
    	.catch((err) => {
    		this.loading = false;
    		console.error('o noz! getVendorGoods err:', err);
    	});
    }

  }

  goTo(hash: string): void {
		window.location.hash = hash;
	}

  ngOnInit(): void {
    this.getVendorGoods();
  }

}
