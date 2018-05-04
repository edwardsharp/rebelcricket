import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import "rxjs/add/operator/debounceTime";
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { Quote, QuoteItem, QuoteQuestion } from './quote';
import { Order, LineItem, Attachments } from '../orders/order';
import { OrderService } from '../orders/order.service';
import { SettingsService } from '../settings/settings.service';
import { Settings, Service } from '../settings/settings';
import { OrderField, OrderFieldType } from '../orders/order';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  @ViewChild('content') content: ElementRef;
  @ViewChild('inputEl') inputEl: ElementRef;
  @ViewChild('gfxFile') gfxFile:ElementRef;
  quoteChangeSubject: Subject<number> = new Subject<number>();

  @Input() modal: boolean;
  formHidden: boolean;
  inputFormControl: FormControl;
  inputHidden: boolean;
  inputPlaceholder: string;
  inputValue: string;
  inputHasErrors: boolean;
  inputErrorMsg: string;
  inputHintStart: string;
  inputHintEnd: string;
  inputWasEdit: boolean;
  inputType: string;
  selectHidden: boolean;
  selectItems: Array<any>;
  selectedItem: any;
  selectMultiple: boolean;
  removeServiceHidden: boolean;
  currentService: string;
  gfxHidden: boolean;
  gfxFileUploading: boolean;
  datePickerHidden: boolean;

  order: Order;
  settings: Settings;
  quote: Quote;
  currentItem: QuoteItem; 
  currentQuestion: QuoteQuestion;
  serviceQuestion: QuoteQuestion;

  res: any;
  files: Array<any>;

  constructor( 
    private settingsService: SettingsService, 
    private route: ActivatedRoute, 
    private orderService: OrderService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.orderService.getQuote( params.get('id'), params.get('user'), params.get('key') ))
      .subscribe((order: Order) => {
        if(order && order['_rev'] && order['_id'] == this.route.snapshot.params.id){
          this.order = order;
          this.quote = order.quote || new Quote;

          if(this.quote.questions.length == 0){
            this.initQuote();
          }else{
            this.getSettings();
          }
        }else if(order._id){
          this.order = order;
          this.quote = order.quote || new Quote;
          this.location.replaceState("/quote/"+order._id);
          this.initQuote();         
        } 
      });

    this.quoteChangeSubject.debounceTime(1500).subscribe(value => {
      this.saveQuote();
    });

    this.formHidden = false;
    this.selectHidden = true;
    this.removeServiceHidden = true;
    this.gfxHidden = true;
    this.datePickerHidden = true;

    this.inputFormControl = new FormControl;
    this.inputFormControl.disable();
    this.inputType = 'text';
  }

  ngOnDestroy(){
    this.beforeUnload();
  }

  beforeUnload(){
    if(!this.quote.doneAsking){
      let item = new QuoteItem(this.currentItem);
      item.pos = 'right';
      item.text = this.inputValue == '' ? '...' : this.inputValue;
      item.service = this.currentService;
      this.quote.items.push(item);
      this.saveQuote();
    }
  }

  initQuote(){

    this.order.status = 'quote';
    this.order.convoForm = true;

    this.settingsService.getSettings().then( (settings:Settings) => {
      this.settings = settings;
      
      if(settings.intro_question){
        this.quote.questions.push(new QuoteQuestion({
          name: 'intro',
          text: settings.intro_question
        }));
      }
      
      this.quote.questions.push(new QuoteQuestion({
        validators: ['required'],
        text: "What's your name?",
        name: 'Name',
        hintStart: '',
        hintEnd: 'REQUIRED',
        input_type: 'text'
      }));
      this.quote.questions.push(new QuoteQuestion({
        validators: ['required','email'],
        text: "What's your email?",
        name: 'Email',
        hintStart: 'Type your email, plz!',
        hintEnd: 'REQUIRED',
        input_type: 'email'
      }));

      this.quote.questions.push(new QuoteQuestion({
        validators: ['required'],
        text: "What's your phone number?",
        name: 'Phone',
        hintStart: "What's your digits?",
        hintEnd: 'REQUIRED',
        input_type: 'tel'
      }));


      if(settings.base_order_fields){
        settings.base_order_fields.forEach( field => {
          if(!field.internal){
            this.quote.questions.push(new QuoteQuestion({
              validators: field.required ? ['required'] : [],
              text: field.text,
              name: field.name,
              hintStart: field.hintStart,
              hintEnd: field.required ? 'REQUIRED' : '',
              type: OrderFieldType[field.type],
              input_type: this.inputTypeFor(field),
              select_items: field.select_items,
              min: field.min,
              max: field.max,
              multiple: field.multiple
            }));
          }
        });
      }
      
      this.serviceQuestion = new QuoteQuestion({
        validators: [],
        text: this.settings.service_question,
        name: 'Service',
        hintStart: 'Select a service.',
        hintEnd: '',
        type: 'Select',
        select_items: this.settings.services.filter( service => { return !service.internal })
      });
      
      this.quote.questions.push(this.serviceQuestion);

      this.quote.questions.push(new QuoteQuestion({
        validators: [],
        text: settings.gfx_question,
        name: 'Graphics',
        type: 'Graphics',
        hintStart: 'Upload image files.',
        hintEnd: ''
      }));

      this.quote.questions.push(new QuoteQuestion({
        validators: [],
        text: "Anything else?",
        name: 'Notes',
        hintStart: 'Type whatever you want ...or nothing!',
        hintEnd: '',
        input_type: 'text'
      }));

      if(settings.closing_question){
        this.quote.questions.push(new QuoteQuestion({
          text: settings.closing_question,
          name: 'closing'
        }));
        this.quote.spliceIdx = -3;
      }else{
        this.quote.spliceIdx = -2;
      }
      

      this.quote.askIdx = 0;
      this.ask();

    });
  }

  quoteChange(): void{
    this.quoteChangeSubject.next(1);
  }

  saveQuote(): void{
    try{
      this.transformQuote();
    }catch(e){ console.log('[quote-component] transformQuote() err!',e); }
    this.order.quote = this.quote;
    this.orderService.saveQuote(this.order).then(resp => {
      if(resp["rev"]){
        this.order["_rev"] = resp["rev"];
      }
    }, err =>{
      console.log('o noz! this.saveQuote() err:',err);
    });
  }

  transformQuote(): void{
    //transform quote fields into order fields
    let quote_items = this.quote.items.filter(items => {return items.pos == 'right'});
    let notes = quote_items.filter(i => {return i.name == "Notes"});
    if( notes.length > 0 ){
      this.order.notes = notes.map( n => {return n.text}).join('  ');
    }
    quote_items.forEach( item => {
      if(item.text == ''){
        //hmm.
      }else if(item.name == "Name"){
        this.order.name = item.text;
      }else if(item.name == "Email"){
        this.order.email = item.text;
      }else if(item.name == "Phone"){
        this.order.phone = item.text;
      }else if(this.order.base_order_fields && this.order.base_order_fields.filter(fields => {return fields.name == item.name}).length > 0){
        this.order.base_order_fields.filter(fields => {return fields.name == item.name})[0].value = item.text
      }
    });
    //transform quote service(s) into order line_items
    let quote_services = this.quote.items.filter(items => {return items.pos == 'right' && items.service});
    if(quote_services.length > 0){
      let line_items = [];
      let li = undefined;
      quote_services.forEach(item => {
        if(item.name == "Service"){
          li = new LineItem;
          li.service_key = item.text;
          li.service_label = item.text;
          li.service = this.settings.services.find(s => { return s.name == item.text });
          li.items = this.orderFieldsForService(item.text);
          line_items.push(li);
        }else{
          let val = undefined;
          if(this.quote.questions[item.qIdx] && this.quote.questions[item.qIdx].multiple){
            val = item.text.split(', ');
          }else{
            val = item.text;
          }
          li.items.filter(i => { return i.name == item.name})[0].value = val;
        }
      });
      this.order.line_items = line_items;
    }
  }

  orderFieldsForService(service: string): Array<OrderField> {
    try{
      return JSON.parse(JSON.stringify(this.settings.services.find( s => s.name == service ).order_fields));
    }catch(e){ return []; }
  }

  scrollToBottom(){
    document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight;
  }

  ask(){
    if(this.quote.askIdx < this.quote.questions.length){
      this.currentQuestion = this.quote.questions[this.quote.askIdx];

      this.quote.items.push(new QuoteItem({
        pos: 'left', 
        name: this.currentQuestion.name,
        text: this.currentQuestion.text,
        qIdx: this.quote.askIdx
      }));

      this.currentItem = this.quote.items[this.quote.items.length-1];
      if(this.currentQuestion.name == 'intro'){
        setTimeout(() => {
          this.ask();
        },500); //2500?
      }else if(this.currentQuestion.name == 'closing'){
        this.formHidden = true;
        this.quote.doneAsking = true;
      }else if(this.currentQuestion.type == 'Select'){
        this.setupSelect();
      }else if(this.currentQuestion.type == 'Date'){
        this.setupDatePicker();
      }else if(this.currentQuestion.type == 'Graphics'){
        this.setupGfx();
      }else{
        this.setupInput();
      }

      setTimeout(() => {
        this.scrollToBottom();
      }, 100);

      this.quote.askIdx += 1;
    }else{
      this.quote.doneAsking = true;
      this.formHidden = true;
    }
  }

  answer(skipSave?:boolean){
    if(!this.inputWasEdit){
      let item = new QuoteItem(this.currentItem);
      item.pos = 'right';
      item.text = this.inputValue;
      item.service = this.currentService;
      this.quote.items.push(item);
    }
    
    setTimeout(() => {
      this.scrollToBottom();
    }, 200);

    this.clearInput();
  
    setTimeout(() => {
      this.ask();
    },100);

    if(!skipSave){ this.quoteChange(); }
  }

  setupInput(){
    this.selectHidden = true;
    let validators = [];
    this.currentQuestion.validators.forEach(v => {
      if(v == 'required'){
        validators.push(Validators.required);
      }else if(v == 'email'){
        validators.push(Validators.email);
      }
    });
    this.inputType = this.currentQuestion.input_type;
    this.inputPlaceholder = this.currentQuestion.name;
    this.inputHintStart = this.currentQuestion.hintStart;
    this.inputHintEnd = this.currentQuestion.hintEnd;
    
    this.inputFormControl = new FormControl('', validators);
    this.inputFormControl.enable();
    this.inputHidden = false;
    setTimeout(() =>{
      this.inputEl.nativeElement.focus();
    },100);
  }

  setupSelect(){
    this.formHidden = false;
    this.inputHidden = true;
    this.selectHidden = false;
    this.inputPlaceholder = this.currentQuestion.name;
    this.inputHintStart = this.currentQuestion.hintStart;
    this.inputHintEnd = this.currentQuestion.hintEnd;
    this.selectItems = this.currentQuestion.select_items;
    this.selectMultiple = this.currentQuestion.multiple;
  }

  setupDatePicker(){
    this.datePickerHidden = false;
    this.formHidden = false;
    this.inputHidden = true;
    this.inputPlaceholder = this.currentQuestion.name;
  }

  setupGfx(){
    this.formHidden = true;
    this.inputHidden = true;
    this.selectHidden = true;
    this.gfxHidden = false;

    this.inputPlaceholder = this.currentQuestion.name;
    this.inputHintStart = this.currentQuestion.hintStart;
    this.inputHintEnd = this.currentQuestion.hintEnd;
    this.selectItems = this.currentQuestion.select_items;
  }

  uploadFile(){
    this.gfxFile.nativeElement.click();
  }

  skip(){
    this.inputValue = 'None';
    this.answer();

  }

  gfxFileChanged(e:any){
    this.gfxFileUploading = true;
    const formData = new FormData();
    if(e.target.files.length > 10){
      this.snackBar.open('Error! Please limit to 10 files or less.', '', {
        duration: 5000
      });  
      this.gfxFile.nativeElement.value = '';
      this.gfxFileUploading = false;
    }else{
      for (const file of e.target.files) {
        formData.append('files', file);
      }
      this.httpClient.post('/upload', formData)
        .subscribe(
          res => {
            console.log('response:',res);
            this.order.attachments = this.order.attachments || [];
            this.order.attachments.push( new Attachments(res) );
            
            this.order.history = this.order.history || [];
            const description = this.attachmentItemsForOrder().map( a => a.name ).join(', ');
            this.order.history.push({date: new Date, title: `Added ${e.target.files.length} Attachment${e.target.files.length > 1 ? 's' : ''}`, description: description});

            this.gfxFile.nativeElement.value = '';
            this.res = JSON.parse(JSON.stringify(res));
            this.files = res["files"];
            this.gfxFileUploading = false;
            //since the imagemagick conversion is async, do this hack to reload img srcz
            setTimeout(() => {
              this.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 2500);
            setTimeout(() => {
              this.files = this.res.files.map( f => { f.thumb = f.thumb+'?r='+Date.now(); return f; });
            }, 10000);

            let msg = '';
            if(this.orderAttachmentCount(this.order) > 1){
              msg = `${this.orderAttachmentCount(this.order)} Attachments Saved!`
            }else{
              msg = `Attachment Saved!`;
            }
            this.snackBar.open(msg, '', {
              duration: 2000,
            });

            this.currentItem.attachments = this.attachmentItemsForOrder();
            //meh, this.currentItem.text
            this.inputValue = description;
            this.answer();
          },
          err => {
            console.log("Error occured err:",err);
            this.gfxFile.nativeElement.value = '';
            this.gfxFileUploading = false;
            this.snackBar.open('Upload Error!', '', {
              duration: 2000
            });  
          }
        );
    }

  }
  attachmentItemsForOrder(): Array<any>{
    //this.order.attachments.map( a => { return a.files.map( b => b.name) } ).reduce((a, b) => a.concat(b), []) 
    return this.order.attachments 
      ? this.order.attachments.map( a => { return a.files } ).reduce((a, b) => a.concat(b), [])
      : [];
  }

  orderAttachmentCount(order: Order): number {
    return order.attachments ? order.attachments.map( a => { return a.files.length } ).reduce( (i,v) => i + v ) : 0;
  }
  
  deleteAttachmentFor(item:any, itemKey:string){
    try{
      for(let attachments of this.order.attachments){
        const found = attachments.files.find(a => a.name == itemKey );
        if(found) attachments.files.splice(attachments.files.indexOf(found), 1);
      }
      try{
        item.text = item.text.replace(`${itemKey}, `, '').trim();
        item.text = item.text.replace(itemKey, '').trim();
      }catch(e){}
      item.attachments = this.attachmentItemsForOrder();
      this.quoteChange();
    }catch(err){
      // e.target.disabled = false;
      console.log('o noz! delete _attachments err:',err);
    }
  }

  setupRemoveService(){
    this.formHidden = true;
    this.removeServiceHidden = false;
  }

  removeService(item){
    let items = this.quote.items.filter( i => { return i.service == item.text });
    if(items.length > 0){
      let start = this.quote.items.indexOf( items[0] );
      start -= 1;
      this.quote.items.splice(start, items.length * 2);
      this.quoteChange();
    }
    this.resume();
  }
  cancelRemoveService(){
    this.resume();
  }

  resume(){
    this.removeServiceHidden = true;
    this.currentItem = this.quote.items[this.quote.items.length-1];
    this.currentQuestion = this.quote.questions[this.quote.askIdx];
    this.formHidden = this.quote.doneAsking;
    this.inputWasEdit = false;

    setTimeout(() => {
        this.scrollToBottom();
      }, 50);

    setTimeout(() =>{
      this.inputEl.nativeElement.focus();
    },100);

  }

  clearInput(){
    this.inputFormControl = new FormControl;
    this.inputFormControl.disable();
    this.inputPlaceholder = '';
    this.inputHintStart = '';
    this.inputHintEnd = '';
    this.inputHasErrors = false;
    this.inputErrorMsg = '';
    this.inputWasEdit = false;
    this.inputValue = undefined;
    this.selectHidden = true;
    // this.currentItem = undefined;
    this.selectedItem = undefined;
    this.currentItem.active = false;
    this.removeServiceHidden = true;
    this.gfxHidden = true;
    this.formHidden = false;
    this.datePickerHidden = true;
  }

  inputEnter(){
    this.inputFormControl.markAsTouched();

    if(this.inputFormControl.hasError('email') && !this.inputFormControl.hasError('required')){
      this.inputHasErrors = true;
      this.inputErrorMsg = 'Invalid Email';
    }else if(this.inputFormControl.hasError('required')){
      this.inputHasErrors = true;
      this.inputErrorMsg = 'Required!';
    }else{
      
      if(this.inputWasEdit){
        this.currentItem.text = this.inputValue;
        if(this.quote.doneAsking){
          this.formHidden = true;
          this.clearInput();
        }else{
          this.clearInput();
          this.currentQuestion = this.quote.questions[this.quote.askIdx-1];
          this.currentItem = this.quote.items[this.quote.items.length-1];
          this.setupInput();
        }
      }else{
        this.answer();

      }
    }
  }//inputEnter

  inputTypeFor(field:OrderField): string{
    switch (field.name) {
      case 'Phone':
        return 'tel';
      case 'Email':
        return 'email';
    }

    switch (OrderFieldType[field.type]) {
      case 'Text':
      case 'Textarea':
      case 'Checkbox':
      case 'Select':
      case 'Date':
        return 'text';
      case 'Number':
        return 'number';
      default:
        return 'text';
    }
  }

  selectionChange(e){
    //wait for close.
    if(!e){
      if(this.currentQuestion.name == 'Service'){
        if(this.selectedItem && this.selectedItem.name){
          this.currentService = this.selectedItem.name;
        }else{
          this.currentService = undefined;
        }
      }

      if(this.selectedItem && this.selectedItem.order_fields){
        this.selectedItem.order_fields.forEach((field:OrderField) => {
          if(!field.internal){
            this.quote.questions.splice(this.quote.spliceIdx, 0, new QuoteQuestion({
              validators: field.required ? ['required'] : [],
              text: field.text,
              name: field.name,
              hintStart: field.hintStart,
              hintEnd: field.required ? 'REQUIRED' : '',
              type: OrderFieldType[field.type],
              input_type: this.inputTypeFor(field),
              select_items: field.select_items,
              service: this.currentService,
              min: field.min,
              max: field.max,
              multiple: field.multiple
            }));
          }
        });
      } 

      if(this.currentQuestion.name == 'Service' && this.selectedItem){
        this.quote.questions.splice(this.quote.spliceIdx, 0, this.serviceQuestion);
      }

      if(this.selectMultiple){
        this.inputValue = this.selectedItem.map(i => { return i.value}).join(', ');
      }else if(this.selectedItem){
        this.inputValue = this.selectedItem.name;
      }else{
        this.inputValue = 'None';
      }

      this.answer();
     }
    
  }

  dateChange(e:any){
    setTimeout( () => {
      this.inputValue = new DatePipe('en-US').transform(this.inputValue, 'fullDate');
      this.answer();
    },100); //give the modal a chance to close...
  }

  itemClicked(item:QuoteItem){
    if(item.pos == 'right'){
      this.removeServiceHidden = true;
      this.formHidden = false;
      this.inputWasEdit = true;
      this.currentItem = item;
      this.currentQuestion = this.quote.questions[item.qIdx];

      if(this.currentQuestion.type == 'Select' && this.currentQuestion.name == 'Service' && this.currentItem.text != 'None'){
        this.setupRemoveService();
                          //#todo: handle (re)selecting multiselect 
      }else if(this.currentQuestion.type == 'Select'){ // && this.currentItem.text == 'None'
        this.setupSelect();
        this.currentItem.active = true;
      }else if(this.currentQuestion.type == 'Graphics'){
        this.setupGfx();
      }else{
        this.setupInput();
        this.inputValue = this.currentItem.text;
        this.currentItem.active = true;
      } 
    }
  }

  addAnotherService(){
    this.quote.questions.splice(this.quote.spliceIdx, 0, this.serviceQuestion);
    this.quote.doneAsking = false;
    this.quote.askIdx = (this.quote.questions.length - 1) - Math.abs(this.quote.spliceIdx);
    this.ask();
  }

  getSettings(){
    this.settingsService.getSettings().then( (settings:Settings) => {
      this.settings = settings;
      this.serviceQuestion = new QuoteQuestion({
        validators: [],
        text: this.settings.service_question,
        name: 'Service',
        hintStart: 'Select a service.',
        hintEnd: '',
        type: 'Select',
        select_items: this.settings.services.filter( service => { return !service.internal })
      });
    });
  }

  orderStatusChip(): string{
    switch (this.order.status.toLowerCase()) {
      case "new":
        return 'New';
      case "inbox":
        return 'Submitted';
      default:
        return this.order.status;
    }
  }

  submitOrder(): void {
    try{
      this.transformQuote();
    }catch(e){ console.log('[quote-component] transformQuote() err!',e); }
    this.order.quote = this.quote;
    this.orderService.saveQuote(this.order).then(resp => {
      if(resp["rev"]){
        this.order["_rev"] = resp["rev"];
      }
      this.httpClient.post('/quote', {
        order: this.order
      }).subscribe( data => {
        console.log('post /quote response data:',data);
        this.order.status = "new";
        this.order.confirmation = Date.now();
        this.order.submitted = true;
        this.orderService.saveQuote(this.order).then(resp => {
          if(resp["rev"]){
            this.order["_rev"] = resp["rev"];
          }
          this.snackBar.open('Thank you!', '', {duration: 5000}); 
        }, err =>{
          console.log('o noz! submitOrder this.saveQuote() err:',err);
          this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
        });
      }, err => {
        console.log('post /quote ERR:',err);
        this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
      });
    }, err =>{
      console.log('o noz! submitOrder this.saveQuote() err:',err);
      this.snackBar.open('Opps! An error occurred :(', '', {duration: 5000}); 
    });
  }
}
