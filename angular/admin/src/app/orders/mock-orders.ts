// import { Order, OrderField, OrderService, LineItem } from './order';


// export const ORDER_FIELDS: OrderField[] = [{
//   key: 'string',
//   label: 'string',
//   type: 'string',
//   value: 'string',
//   required: false,
//   internal: false
// }];

// export const ORDER_SERVICES: OrderService[] = [{ 
//   key: '',
//   label: '',
//   items: ORDER_FIELDS
// }];

// export const LINE_ITEMS: LineItem[] = [{
//   notes: 'string',
//   quantity: 1,
//   total: 6.66,
//   service_key: 'string',
//   service_label: 'string',
//   items: []
// }];


// export const ORDERS: Order[] = [
//   { _id: '1506309041-zij621', 
//     name: 'Foo Bar',
//     email: 'foo@b.ar',
//     phone: '666-666-6666',
//     org: 'Devel Corp',
//     submitted: false,
//     notes: 'zomg!',
//     date_needed: new Date,
//     wants_mail: false,
//     order_services: ORDER_SERVICES,
//     line_items: LINE_ITEMS
//   },
//   { _id: '1506312654-h10t23', 
//     name: 'Zomg D00d',
//     email: 'z@omg.d00d',
//     phone: '999-666-9999',
//     org: 'Devel Corp',
//     submitted: true,
//     notes: '',
//     date_needed: new Date, //'1506312654'
//     wants_mail: true,
//     order_services: ORDER_SERVICES,
//     line_items: new Array<LineItem>({
//       notes: 'string2',
//       quantity: 2,
//       total: 13.32,
//       service_key: 'string',
//       service_label: 'string',
//       items: []
//     },{
//       notes: 'string3',
//       quantity: 3,
//       total: 19.98,
//       service_key: 'string',
//       service_label: 'string',
//       items: []
//     })
//   },
//   { _id: '1506406224-tsnr3y', 
//     name: 'Some Body',
//     email: 'so@me.body',
//     phone: '999-666-9999',
//     org: '',
//     submitted: true,
//     notes: 'beep beep',
//     date_needed: new Date, //'1506406224'
//     wants_mail: true,
//     order_services: ORDER_SERVICES,
//     line_items: new Array<LineItem>({
//       notes: 'some note',
//       quantity: 2,
//       total: 13.32,
//       service_key: 'string',
//       service_label: 'some service',
//       items: ['a thing', 'another thing']
//     },{
//       notes: 'string3',
//       quantity: 3,
//       total: 19.98,
//       service_key: 'string',
//       service_label: 'some other service',
//       items: ['item 1', 'item 2', 'item 3']
//     })
//   }
// ];



// use in component like:
// import { ORDERS } from './mock-orders';

/** Constants used to fill up our data base. */
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

// let IDZ = [];
// for (let i = 0; i < 1000; i++) { 
//   IDZ.push( Math.floor(new Date(1507096743342 - (100000000 * i) ).getTime()).toString(36) );
// }

	// addOrder() {
  //   const copiedData = this.data.slice();
  //   copiedData.push(this.createFakeOrder());
  //   this.dataChange.next(copiedData);
  // }

  /** Builds and returns a new User. */
  // private createFakeOrder() {
  //   const name =
  //       NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
  //       NAMES[Math.round(Math.random() * (NAMES.length - 1))];
  //   const id = IDZ[Math.round(Math.random() * (IDZ.length - 1))]

  //   return {
  //     id: id,
  //     name: name,
  //     email: `${name}@example.org`,
  //     org: `Testing ${IDZ.indexOf(id)}`,
  //     phone: Math.floor(100000 + Math.random() * 9000000000).toString(),
  //     notes: 'testing',
  //     status: 'new',
  //     tags: []
  //   };
  // }

