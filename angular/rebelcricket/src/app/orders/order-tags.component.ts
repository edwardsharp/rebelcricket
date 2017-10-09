import { Component, ViewChild, OnInit } from '@angular/core';
import {MdChipInputEvent, ENTER, MdSnackBar} from '@angular/material';

const COMMA = 188;

@Component({
  selector: 'app-order-tags',
  templateUrl: './order-tags.component.html',
  styleUrls: ['./order-tags.component.css']
})
export class OrderTagsComponent implements OnInit {

	@ViewChild('tagInput') tagInput; 

	tags: Array<string> = [];
	
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

  add(event: MdChipInputEvent): void {
    let input = event.input;
    let value = (event.value || '').trim();

    if (value && this.tags.indexOf(value) < 0) {
      // if(this.order.tags == undefined){
      //   this.order.tags = [];
      // }
      // this.needsSave = true;
      // this.order.tags.push(value.trim());

      if(this.willEditTag){
      	let index = this.tags.indexOf(this.willEditTag);
		    if (index >= 0) {
		      this.tags.splice(index, 1);
		    }
      }
      this.tags.push(value);
      this.willAddTag = false;
    }

    // Reset the input value
    if (input) {
      input.value = '';
      this.inputHidden = true;
      this.selectedTag = undefined;
      this.willEditTag = undefined;
    }
  }

  remove(tag: any): void {
  	console.log('REMOVE!');
    // let index = this.order.tags.indexOf(tag);

    // if (index >= 0) {
    //   this.needsSave = true;
    //   this.order.tags.splice(index, 1);
    // }

    let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.selectedTag = undefined;
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
  }

}
