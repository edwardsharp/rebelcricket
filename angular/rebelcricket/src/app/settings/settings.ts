export class Settings {
  _id: string = 'settings';
  constructor(
    public order_statuses: Array<OrderStatus>,
    public google_api: GoogleApi
  ){ }
}

export class OrderStatus {
  constructor(public name: string) { }
}

export class GoogleApi {
  constructor(public client_id: string,public api_key: string) { }
}
