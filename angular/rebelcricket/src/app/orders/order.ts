import { Service } from '../settings/settings';

export class Order {
  _id?: string;
  _rev?: string;
  _attachments?: any;
  attachments?: Array<any>; //in the future, might not use _attachments...

  history?: Array<{date:Date, title:string, description:string}>;
  name: string;
  email: string;
  phone: string;
  
  org?: string;

  submitted?: boolean ;
  
  notes?: string;
  date_needed?: Date;
  wants_mail?: boolean;

  position?: number;
  created_at?: Date;
  archived_at?: Date;
  status?: string;
  tags?: Array<string>;
  line_items?: Array<LineItem>;

  constructor() { 
    this._id = this._id || Math.floor(Date.now()).toString(36); 
    this.created_at = new Date(parseInt(this._id, 36));
    this.status = this.status || 'new';
  }

}

export enum OrderFieldType{
  Text,
  Textarea,
  Checkbox,
  Number,
  Select
}

export class OrderField {
  key: string;
  label: string;
  type:  OrderFieldType;
  value: string;
  required: boolean;
  internal: boolean;
  select_items: Array<{name:string}>;
}

export class LineItem {
  notes: string;
  quantity: number;
  total: number;
  service_key: string;
  service_label: string;
  service: Service;
  items: Array<any>;
}
