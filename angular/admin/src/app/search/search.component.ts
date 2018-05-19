import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent} from '@angular/material';


import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
// import { LocationService } from 'app/shared/location.service';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/distinctUntilChanged';

import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';

@Component({
  selector: 'app-search',
  template: `
  	<mat-form-field>
      <input matInput #searchBox
		    class="search-box"
		    placeholder="Search..." 
		    aria-label="Search..." 
		    [formControl]="stateCtrl"
		    [(ngModel)]="destination">
	    <mat-hint>
	      Search by name, email, or phone.
	    </mat-hint>
    </mat-form-field>
   
	  <mat-list>
	    <mat-list-item 
	      *ngFor="let order of filteredOrders | async" 
	      routerLink="/dashboard/order/{{order._id}}">
	      <span class="item">{{ order.name }}</span> 
	      <span class="item">{{createdAtDate(order._id) | date:'short' }}</span>
	      <span class="item">{{ order.email }}</span> 
	      <span>{{ order.phone }}</span> 
	    </mat-list-item>
	  </mat-list>
  `,
  styles: [
    ':host{display:flex; flex-direction:column; justify-content:center; width:75vw; margin:auto; padding-top:4em;}',
    'mat-list{margin-top: 2em}',
    'mat-list-item:hover{background-color:#e6e6e6}',
    '.item{margin-right: 2em}'
  ]
})
export class SearchComponent implements OnInit {

	private searchDebounce = 300;
  private searchSubject = new Subject<string>();

  @ViewChild('searchBox') searchBox: ElementRef;
  @Output() onSearch = this.searchSubject.distinctUntilChanged().debounceTime(this.searchDebounce);
  @Output() onFocus = new EventEmitter<string>();

  destination: string;
  stateCtrl: FormControl;
  filteredOrders: Observable<any[]>;
  // filteredOrders: Array<any>;

  constructor(private orderService: OrderService){ 
  	this.stateCtrl = new FormControl();
  	this.filteredOrders = this.stateCtrl.valueChanges
      .switchMap(q => this.orderService.find(q) );
  }

  ngOnInit() {
  }


  doSearch() {
    // console.log('SearchBoxComponent doSearch this.query',this.query);
    this.searchSubject.next(this.query);
  }

  doFocus() {
    this.onFocus.emit(this.query);
  }

  focus() {
    this.searchBox.nativeElement.focus();
  }

  createdAtDate(_id:string){
    return new Date(parseInt(_id, 36));
  }

  private get query() { return this.searchBox.nativeElement.value; }
  private set query(value: string) { this.searchBox.nativeElement.value = value; }


  
}
