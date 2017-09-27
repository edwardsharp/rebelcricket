import { Component, OnInit } from '@angular/core';
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
	vendorGoods: string[] = [];

  constructor(private vendorGoodsService: VendorGoodsService) { }

  getVendorGoods(): void {
    // this.vendorGoodsService.getVendorGoods().then(vendorGoods => {
    // 	this.vendorGoods = vendorGoods;
    // 	this.loading = false;
    // }, err => {
    // 	console.log('o noz! orderService.getVendorGoods() err:',err);
    // 	this.loading = false;
    // });

    this.loading = true;
    // this.vendorGoodsService.getVendorGoods().then(() => {
    // 	this.loading = false;
    // 	console.log('ok, vendor goodz? this.vendorGoodsService.vendorGoods',this.vendorGoodsService.vendorGoods);
    // 	this.vendorGoods = this.vendorGoodsService.vendorGoods;
    // });

    this.vendorGoodsService.getVendorGoods()
    	.then((vendorGoods) => {
      	this.vendorGoods = vendorGoods;
      	this.loading = false;
    	})
    	.catch((err) => {
    		this.loading = false;
    		console.error('o noz! getVendorGoods err:', err);
    	});


    // this.vendorGoodsService.getVendorGoods()
	   //  .subscribe(
	   //  	vendorGoods => {
	   //  		this.vendorGoods = vendorGoods;
	   //  		this.loading = false;
	   //  	}, 
    //   	err => {
	   //      console.log('o noz! getVendorGoods err:', err);
	   //      this.loading = false;
    //     });
  }

  ngOnInit(): void {
    this.getVendorGoods();
  }

}
