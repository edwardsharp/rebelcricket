import { Service } from '../settings/settings';
import { Quote } from '../quote/quote';

export class Order {
  _id?: string;
  _rev?: string;
  _attachments?: any;
  attachments?: Array<Attachments> //in the future, might not use _attachments...

  auth_user?: string;
  auth_key?: string;
  
  history?: Array<{date:Date, title:string, description:string}>;
  name: string;
  email: string;
  phone: string;
  org?: string;
  base_order_fields?: Array<OrderField>;

  submitted?: boolean;
  confirmation?: number;
  
  notes?: string;
  date_needed?: Date;
  wants_mail?: boolean;

  position?: number;
  created_at?: Date;
  archived_at?: Date;
  status?: string;
  tags?: Array<string>;
  line_items?: Array<LineItem>;

  plate?: {name: string, value: string};
  canvasLayers?: Array<string>;
  attachmentDimensions?: any;
  canvasLayerColors?: any;
  canvasData?: any;
  canvasDataImg?: any;

  quote?: Quote;

  constructor() { 
    this._id = this._id || Math.floor(Date.now()).toString(36); 
    this.created_at = new Date(parseInt(this._id, 36));
    this.status = this.status || 'new';
    this.canvasLayers = [];
    this.attachmentDimensions = {};
    this.canvasLayerColors = {};
  }

}

export class Attachments{
  filenameID: string;
  files: Array<{name: string, original: string, thumb: string}>;

  constructor(obj) {
    obj && Object.assign(this, obj);
  }
}

export enum OrderFieldType{
  Text,
  Textarea,
  Checkbox,
  Number,
  Select,
  Date
}

export class OrderField {
  name?: string;
  key: string;
  label: string;
  type:  OrderFieldType;
  value: string;
  required: boolean;
  internal: boolean;
  min: number;
  max: number;
  multiple: boolean;
  select_items: Array<{name:string}>;
  text?: string;
  hintStart?: string;
  hintEnd?: string;
}

export class LineItem {
  notes: string;
  quantity: number;
  total: number;
  service_key: string;
  service_label: string;
  service: Service;
  items: Array<any>;
  vendor_goods: Array<any>; //#todo: model this
}
