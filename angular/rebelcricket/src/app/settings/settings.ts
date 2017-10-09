export class Settings {
  _id: string = 'settings';

  services_heading?: string;

  constructor(
    public order_statuses: Array<OrderStatus>,
    public google_api: GoogleApi,
    public services: Array<Service>
  ){ }
}

export class OrderStatus {
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
	constructor(public name: string) { }
}
