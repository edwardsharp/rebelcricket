export class Settings {
  _id: string = 'settings';

  site_title?: string;
  logo_image?: string;
  site_description?: string;
	phone?: string;
	landing_page_social_items?: Array<{url:string,name:string}>;

  services_heading?: string;
  about_page_heading?: string;
  about_page_items?: Array<{heading: string, detail: string}>;
  landing_page_items?: Array<{url:string, href:string}>;

  constructor(
    public order_statuses: Array<OrderStatus>,
    public google_api: GoogleApi,
    public services: Array<Service>
  ){ }
}

export class OrderStatus {
	collapsed?: boolean;
  constructor(public name: string, public position: number) { }
}

export class GoogleApi {
  constructor(public client_id: string,public api_key: string) { }
}

export class Service {
	slug?: string;
	image?: string;
	detail_images?: Array<{url: string}>;
	detail_items?: Array<{heading: string, detail: string}>;

  order_configuration?: Array<any>;

	constructor(public name: string) { }
}
