import { Order, OrderField, OrderService, LineItem } from './order';


export const ORDER_FIELDS: OrderField[] = [{
  key: 'string',
  label: 'string',
  type: 'string',
  value: 'string',
  required: false,
  internal: false,
  sum: false
}];

export const ORDER_SERVICES: OrderService[] = [{ 
  key: '',
  label: '',
  items: ORDER_FIELDS
}];

export const LINE_ITEMS: LineItem[] = [{
  notes: 'string',
  quantity: 1,
  total: 6.66,
  service_key: 'string',
  service_label: 'string',
  items: []
}];


export const ORDERS: Order[] = [
  { id: '1506309041-zij621', 
    name: 'Foo Bar',
    email: 'foo@b.ar',
    phone: '666-666-6666',
    org: 'Devel Corp',
    submitted: false,
    notes: 'zomg!',
    need_by_date: false,
    date_needed: '',
    wants_mail: false,
    order_services: ORDER_SERVICES,
    line_items: LINE_ITEMS
  },
  { id: '1506312654-h10t23', 
    name: 'Zomg D00d',
    email: 'z@omg.d00d',
    phone: '999-666-9999',
    org: 'Devel Corp',
    submitted: true,
    notes: '',
    need_by_date: true,
    date_needed: '1506312654',
    wants_mail: true,
    order_services: ORDER_SERVICES,
    line_items: new Array<LineItem>({
      notes: 'string2',
      quantity: 2,
      total: 13.32,
      service_key: 'string',
      service_label: 'string',
      items: []
    },{
      notes: 'string3',
      quantity: 3,
      total: 19.98,
      service_key: 'string',
      service_label: 'string',
      items: []
    })
  }
];


