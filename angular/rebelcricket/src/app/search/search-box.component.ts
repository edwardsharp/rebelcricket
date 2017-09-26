import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerInputEvent} from '@angular/material';




import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
// import { LocationService } from 'app/shared/location.service';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import 'rxjs/add/operator/distinctUntilChanged';

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
    [mdAutocomplete]="auto" 
    [formControl]="stateCtrl"
    [(ngModel)]="destination">
  <md-autocomplete #auto="mdAutocomplete">
    <md-option *ngFor="let state of filteredStates | async" [value]="state.name">
      <img style="vertical-align:middle;" aria-hidden src="{{state.flag}}" height="25" />
      <span>{{ state.name }}</span> |
      <small>population: {{state.population}}</small>
    </md-option>
  </md-autocomplete>`,
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
  filteredStates: Observable<any[]>;

  states: any[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'New York',
      population: '19.8M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_New_York.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg'
    },
    {
      name: 'Oregon',
      population: '4.09M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Oregon.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Flag_of_Oregon.svg'
    }
  ];

  constructor(public dialog: MdDialog) {
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        // .map(state => state ? this.filterStates(state) : this.states.slice());
        .map(state => state ? this.filterStates(state) : []);
  }

  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

}
