import { OrderField } from '../orders/order';

//     interface?
export class Quote {
  // _id: string;
  // _rev?: string;
  // _attachments?: any;

  last_modified: Date;
  questions:  Array<QuoteQuestion>;
  items: Array<QuoteItem>;
  askIdx: number;
  spliceIdx: number;
  doneAsking: boolean;
  locked?: boolean;

  constructor() { 
    // this._id = this._id || Math.floor(Date.now()).toString(36); 
    this.last_modified = new Date();
    this.questions = this.items || [];
    this.items = this.items || [];
  }
}

export class QuoteQuestion {
  
  name: string; 
  text: string;
  validators?: Array<any>;
  hintStart?: string;
  hintEnd?: string;
  order_field?: OrderField;
  type?: string;
  input_type?: string;
  select_items?: Array<any>;
  service?: string;
  min?: number;
  max?: number;
  multiple?: boolean;

  constructor(fields?: 
    {
      name: string,
      text: string,
      validators?: Array<any>,
      hintStart?: string,
      hintEnd?: string,
      order_field?: OrderField,
      type?: string,
      select_items?: Array<any>,
      service?: string,
      min?: number,
      max?: number,
      multiple?: boolean,
      input_type?: string
    }
  ){
    if (fields) Object.assign(this, fields);
  }

}

export class QuoteItem {

  qIdx: number;
  pos: string;
  name: string;
  text: string;
  date?: Date;
  active?: boolean;
  service?: string;
  attachments?: Array<string>;

  constructor(fields?: 
    {
      qIdx: number,
      pos: string,
      name: string,
      text: string,
      service?: string,
      attachments?: Array<string>
    }
  ){
    if (fields) Object.assign(this, fields);
    this.date = new Date;
  }

}