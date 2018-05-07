import { OrderField } from '../orders/order';

export class Settings {
  _id: string = 'settings';
  _rev?: string;
  _attachments?: any;

  site_title?: string;
  logo_image?: string;
  logo_url?: string;
  site_description?: string;
	phone?: string;
	landing_page_social_items?: Array<{url:string,name:string}>;

  services_heading?: string;
  about_page_heading?: string;
  about_page_items?: Array<{heading: string, detail: string}>;
  landing_page_items?: Array<{url:string, href:string, attachment:string}>;

  base_order_fields?: Array<OrderField>;

  intro_question?: string; //Hi! Please answer a few questions. You can change your response by tapping on it. 
  closing_question?: string;
  service_question?: string;
  gfx_question?: string;

  constructor(
    public order_statuses: Array<OrderStatus>,
    public services: Array<Service>
  ){ }
}

export class OrderStatus {
	collapsed?: boolean;
  constructor(public name: string, public position: number) { }
}

export class Service {
  slug?: string;
  internal?: boolean;
	image?: string;
  image_url?: string;
	detail_images?: Array<{url: string, attachment: string}>;
	detail_items?: Array<{heading: string, detail: string}>;

  vendor_goods_catalog?: string;
  notes: boolean;
  order_fields?: Array<OrderField>;

	constructor(public name: string) { 
    let qty = new OrderField;
    qty.name = "qty";
    qty.type = 3;
    qty.required = true;
    let total = new OrderField;
    total.name = "total";
    total.type = 3;    
    this.order_fields = [qty, total];
  }
}

