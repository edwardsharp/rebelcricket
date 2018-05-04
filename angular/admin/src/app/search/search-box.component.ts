import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent} from '@angular/material';




import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
// import { LocationService } from 'app/shared/location.service';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/distinctUntilChanged';

import { Order } from '../orders/order';
import { OrderService } from '../orders/order.service';


/**
 * This component provides a text box to type a search query that will be sent to the SearchService.
 *
 * When you arrive at a page containing this component, it will retrieve the `query` from the browser
 * address bar. If there is a query then this will be made.
 *
 * Focussing on the input box will resend whatever query is there. This can be useful if the search
 * results had been hidden for some reason.
 * 
 */

// <input #searchBox
//     class="search-box"
//     type="search"
//     aria-label="search"
//     placeholder="Search..."
//     (input)="doSearch()"
//     (keyup)="doSearch()"
//     (focus)="doFocus()"
//     (click)="doSearch()">

@Component({
  selector: 'app-search-box',
  template: `<input #searchBox
    class="search-box"
    placeholder="Search..." 
    aria-label="Search..." 
    [matAutocomplete]="auto" 
    [formControl]="stateCtrl"
    [(ngModel)]="destination">
  <mat-autocomplete #auto="matAutocomplete">
    <mat-option 
      *ngFor="let order of filteredOrders | async" 
      [value]="order.name"
      routerLink="/dashboard/order/{{order._id}}">
      <span>{{ order.name }}</span> |
      <small>{{createdAtDate(order._id) | date:'short' }}</small>
    </mat-option>
  </mat-autocomplete>`,
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  private searchDebounce = 300;
  private searchSubject = new Subject<string>();

  @ViewChild('searchBox') searchBox: ElementRef;
  @Output() onSearch = this.searchSubject.distinctUntilChanged().debounceTime(this.searchDebounce);
  @Output() onFocus = new EventEmitter<string>();

  /**
   * When we first show this search box we trigger a search if there is a search query in the URL
   */
  ngOnInit() {
    // const query = this.locationService.search()['search'];
    // if (query) {
    //   this.query = query;
    //   this.doSearch();
    // }

    // setInterval(()=>{
    //   console.log('this.filteredOrders:',this.filteredOrders);
    // },2000);
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

  private get query() { return this.searchBox.nativeElement.value; }
  private set query(value: string) { this.searchBox.nativeElement.value = value; }


  destination: string;
//autocomplete
  stateCtrl: FormControl;
  filteredOrders: Observable<any[]>;
  // filteredOrders: Array<any>;

  // states: any[] = [
  //   {
  //     name: 'Arkansas',
  //     population: '2.978M',
  //     // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
  //     flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
  //   },
  //   {
  //     name: 'California',
  //     population: '39.14M',
  //     // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
  //     flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
  //   },
  //   {
  //     name: 'New York',
  //     population: '19.8M',
  //     // https://commons.wikimedia.org/wiki/File:Flag_of_New_York.svg
  //     flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg'
  //   },
  //   {
  //     name: 'Oregon',
  //     population: '4.09M',
  //     // https://commons.wikimedia.org/wiki/File:Flag_of_Oregon.svg
  //     flag: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg'
  //   }
  // ];

  constructor(
    public dialog: MatDialog, 
    private orderService: OrderService
  ) {

    this.stateCtrl = new FormControl();
    // this.stateCtrl.valueChanges.switchMap( (q: any) => {
    //   return this.orderService.find(q);
    // }).subscribe(result => { this.filteredOrders = result["docs"] });


    // this.filteredOrders = this.stateCtrl.valueChanges.subscribe( q => {

    // });

    // w00t!
    this.filteredOrders = this.stateCtrl.valueChanges
      .switchMap(q => this.orderService.find(q) );

    // this.filteredOrders = 
//Observable.from(orders)
//

  //   .map(res => res.json().products)
  // .switchMap(products => Observable.from(products))
  // .subscribe(product => console.log(product))

      // .startWith(null)
      // // .map(state => state ? this.filterStates(state) : this.states.slice());
      // .map(q => { return q ? this.filterOrders(q) : [] });



// .switchMap((params: ParamMap) => this.orderService.getOrder( params.get('id') ))
//       .subscribe((order: Order) => {
//         if(order && order._id && this.route.snapshot.params.id != 'new'){
//           this.order = order;
//         }else{
//           this.order = new Order;
//           this.router.navigate(['/dashboard/order/', this.order._id]);
//           this.snackBar.open('New Order Created!', '', {
//             duration: 2000,
//           });          
//         } 
//       });

      // .map(q => q ? this.filterOrders(q) : []);

      // .debounceTime(400)
      // .distinctUntilChanged()
      // .toPromise()
      // .then( (q:string) => {return this.filterOrders(q)});

    // this.filteredOrders = this.stateCtrl.valueChanges
    //   .debounceTime(400)
    //   .distinctUntilChanged()
    //   .map((q:string) => { 
    //     return this.filterOrders(q);
    //   });

      // .subscribe(result => {
      //    return result["docs"] as any[];
      // }, err => {
      //     return [];
      // });


        // .startWith(null)
        // // .map(state => state ? this.filterStates(state) : this.states.slice());
        // //.map(q => {console.log('thisfilterStates',this.filteredOrders); return q ? this.filterOrders(q) : []});
        // // .map(state => state ? this.filterStates(state) : []);
        // .map(q => q ? this.filterOrders(q) : []);
  }

  // filterOrders(q: string): Array<any>{
  //   console.log('zomg search-box gonna filterOrders for q:',q);
  //   this.orderService.find(q)
  //     .then(result => {
  //       // handle result
  //       console.log('this.orderService.find(q) result:',result["docs"]);
  //       // return result["docs"];
  //       // return Promise.resolve(result["docs"]);
  //       return result["docs"];
  //     }).catch(err => {
  //       console.log(err);
  //       return [];
  //     });
  // }
  // filterStates(name: string) {
  //   return this.states.filter(state =>
  //     state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }
  createdAtDate(_id:string){
    return new Date(parseInt(_id, 36));
  }

}
