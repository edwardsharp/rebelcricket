import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderField, OrderFieldType } from '../orders/order';

@Component({
  selector: 'app-order-field',
  templateUrl: './order-field.component.html',
  styleUrls: ['./order-field.component.css']
})
export class OrderFieldComponent implements OnInit {

	@Input() order_fields: Array<OrderField>;
	@Output() onChange = new EventEmitter<boolean>();
	isSortingFields: boolean = false;

	order_field_types: Array<{name:string, value:OrderFieldType}>;
  SelectFieldType: OrderFieldType;
  NumberFieldType: OrderFieldType;


  constructor() { }

  ngOnInit() {
  	this.order_field_types = [
      {name: 'Text',     value: OrderFieldType.Text},
      {name: 'Textarea', value: OrderFieldType.Textarea},
      {name: 'Checkbox', value:OrderFieldType.Checkbox},
      {name: 'Number',   value: OrderFieldType.Number},
      {name: 'Select',   value: OrderFieldType.Select},
      {name: 'Date',     value: OrderFieldType.Date}
    ];
    this.SelectFieldType = OrderFieldType.Select;
    this.NumberFieldType = OrderFieldType.Number;
  }

  // onChange():void{
  // 	//STUB.
  // }

  toggleIsSortingFields():void{
    this.isSortingFields = !this.isSortingFields;
    this.onChange.emit(true);
  }

  removeOrderField(field: OrderField){
    let idx = this.order_fields.indexOf(field);
    if(idx >= 0){
      this.order_fields.splice(idx, 1);
      this.onChange.emit(true);
    }
  }

  addOrderFieldSelectItem(field: OrderField){
    field.select_items = field.select_items || [];
    field.select_items.push({name:'New Option'});
  }
  removeOrderFieldSelectItem(field: OrderField,item:any){
    let idx = field.select_items.indexOf(item);
    if(idx >= 0){
      field.select_items.splice(idx, 1);
    }
  }

  selectItemChange(item){
    item.value = item.name;
    this.onChange.emit(true);
  }


}
