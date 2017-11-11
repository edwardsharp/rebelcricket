import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';

const COMMA = 188;
const ENTER = 13;

@Component({
  selector: 'app-order-tags',
  templateUrl: './order-tags.component.html',
  styleUrls: ['./order-tags.component.css']
})
export class OrderTagsComponent implements OnInit {

	@ViewChild('tagInput') tagInput; 

	@Input() tags: Array<string> = [];
  @Output() tagsChanged = new EventEmitter<string[]>();
	selectedTag: string;

//chip input for tagz
  inputHidden: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  willEditTag: string;
  willAddTag: boolean = false;
  inputFocused: boolean = false;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  addTag(): void {
  	this.willAddTag = true;
  	this.inputHidden = false;
  	this.selectedTag = undefined;
  	this.willEditTag = undefined;
  	setTimeout(() => this.tagInput.nativeElement.focus(), 100);
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = (event.value || '').trim();

    if (value && this.tags.indexOf(value) < 0) {
      if(this.willEditTag){
      	let index = this.tags.indexOf(this.willEditTag);
		    if (index >= 0) {
		      this.tags.splice(index, 1);
		    }
      }
      this.tags.push(value);
      this.willAddTag = false;
      this.tagsChanged.emit(this.tags);
    }

    if (input) {
      input.value = '';
      this.inputHidden = true;
      this.selectedTag = undefined;
      this.willEditTag = undefined;
    }
  }

  remove(tag: any): void {
  	// console.log('REMOVE!');
    let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.selectedTag = undefined;
      this.tagsChanged.emit(this.tags);
    }
  }

  tagClick(tag: string): void {
  	console.log('tagClick tag:',tag);
  	this.inputHidden = false;
  	this.selectedTag = tag;
  	this.willEditTag = tag;
  	this.willAddTag = false;
  	setTimeout(() => this.tagInput.nativeElement.focus(), 100);
  }

  chipBlur(): void {
  	console.log('chipBlur!');
  	setTimeout(() => {
  		if(!this.selectedTag && !this.inputFocused && !this.willAddTag){
  			console.log('chipBlur will hide input!');
				this.inputHidden = true;
	  		this.selectedTag = undefined;
	  		this.willEditTag = undefined;

	  	}
  	}, 50);
  }

  focusInput(): void {
  	this.inputFocused = true;
  }

  blurInput(): void {
  	this.inputFocused = false;
  }

  constructor() { }

  ngOnInit() {
    this.tags = this.tags || [];
  }

}
