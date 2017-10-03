// class Outer {
//     constructor(public inner: Outer.Inner) { }
// }

// namespace Outer {
//     export class Inner {
//         inInner: number
//     };
// }

// // Spec
// let outer1 = new Outer({ inInner: 3 });

// let outerInner = new Outer.Inner();
// let outer2 = new Outer(outerInner);

// @Injectable()  //???
export class Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  org: string;

  submitted: boolean;
  
  notes: string;
  need_by_date: boolean;
  date_needed: string;
  wants_mail: boolean;

  created_at: Date;
  constructor(
    // public order_services: OrderService[],
    // public line_items: LineItem[]
  ) { 
    this.id = this.id || Math.floor(Date.now() / 1000).toString(36); 
    this.created_at = new Date(parseInt(this.id, 36) * 1000);
  }

  order_services: Array<OrderService>;
  line_items: Array<LineItem>;

}

export class OrderField {
  key: string;
  label: string;
  type: string;
  value: string;
  required: boolean;
  internal: boolean;
  sum: boolean;
}


export class OrderService {
  key: string;
  label: string;
  items: Array<OrderField>;
}

export class LineItem {
  notes: string;
  quantity: number;
  total: number;
  service_key: string;
  service_label: string;
  items: Array<any>;
}



// export class OrderGroupItem {
//   service: string;
//   notes: string;
//   fields: Array<OrderField>;
// }

// export class InternalOrderField {
//   label: string;
//   items: Array<OrderField>;
// }

// export class JobOrderField {
//   label: string;
//   items: Array<OrderField>;
// }

// export class ClientContactInfo {
//   label: string;
//   items: Array<OrderField>;
// }

// export class JobCompletionAndShipping {
//   label: string;
//   items: Array<OrderField>;
// }

// export class LineItemApparelProto {
//   service_type: string;
//   brand_style_color: Array<OrderField>;
//   selected_sizes: Array<any>;
//   selected_quantity: Array<any>;
//   apparel_sizes: Array<any>;
//   serviceNotes: string;
// }

// export class LineItemApparelTotalProto {
//   line_total: OrderField;
// }

// export class ApparelSizeQuantityProto extends OrderField{
//   sum: boolean;
// }

// export class LineItems {
//   label: string;
//   items: Array<any>;
// }

// export class LineItemsPosterProto {
//   service_type: string;
//   quantity: number;
//   poster_min: number;
//   poster_stock_colors: Array<string>;
//   selected_poster_stock: string;
//   poster_sizes: Array<string>;
//   selected_poster_size: string;
//   serviceNotes: string;
// }

// export class PosterLineItems {
//   label: string;
//   items: Array<LineItemsPosterProto>;
// }

// export class LineItemStickerProto {
//   service_type: string;
//   quantity: number;
//   sticker_min: number;
//   sticker_stock_colors: Array<string>;
//   selected_sticker_stock: string;
//   sticker_sizes: Array<string>;
//   selected_sticker_size: string;
//   serviceNotes: string;
// }

// export class StickerLineItems {
//   label: string;
//   items: Array<LineItemStickerProto>;
// }

// export class LineItemSandblastingProto {
//   service_type: string;
//   quantity: number;
//   substrates: Array<string>;
//   selected_substrates: Array<any>;
//   needs_color_fill: boolean;
//   fill_colors: Array<string>;
//   selected_fill_colors: Array<string>;
//   serviceNotes: string;
// }
// export class SandblastingLineItems {
//   label: string;
//   items: Array<LineItemSandblastingProto>;
// }

// export class LineItemSublimationProto {
//   service_type: string;
//   quantity: number;
//   bottle_min: number;
//   sublimation_items: Array<string>;
//   selected_sublimation_items: Array<string>;
//   watter_bottle_options: Array<string>;
//   selected_watter_bottle_options: Array<string>;
//   watter_bottle_tops: Array<string>;
//   selected_watter_bottle_tops: Array<string>;
//   notes: string;
// }
// export class SublimationLineItems {
//   label: string;
//   items: Array<LineItemSublimationProto>;
// }

// export class LineItemVinylProto {
//   dimensions: string;
//   quantity: string;
//   options: Array<string>;
//   selected_option: string;
//   serviceNotes: string;
// }
// export class VinylLineItems {
//   label: string;
//   items: Array<LineItemVinylProto>;
// }

// export class LineItemDimensionalPartsProto {
//   dimensions: string;
//   options: Array<string>;
//   selected_options: Array<string>;
//   serviceNotes: string;
// }
// export class DimensionalPartsLineItems {
//   label: string;
//   items: Array<LineItemDimensionalPartsProto>;
// }

// export class LineItemButtonsProto {
//   quantity: number;
//   buttons_min: number;
//   sizes: Array<string>;
//   selected_size: string;
//   serviceNotes: string;
// }
// export class ButtonsLineItems {
//   label: string;
//   items: Array<LineItemButtonsProto>;
// }


// export class GraphicItemProto {
//   colors: Array<string>;
//   price: number;
//   attachment_id: string;
//   position: string;
//   size_inches: string;
// }
// export class GraphicLineItems {
//   label: string;
//   items: Array<GraphicItemProto>;
// }






// internal:  InternalOrderField;
  // job: JobOrderField;
  // client_contact_information: ClientContactInfo;
  // job_completion_and_shipping: JobCompletionAndShipping;

  // line_item_apparel_proto: LineItemApparelProto;
  // line_item_apparel_total_proto: LineItemApparelTotalProto;
  // apparel_size_quantity_proto: ApparelSizeQuantityProto;
  // line_items: LineItems;
  // line_item_poster_proto: LineItemsPosterProto;
  // poster_line_items: PosterLineItems;
  // line_item_sticker_proto: LineItemStickerProto;
  // sticker_line_items: StickerLineItems;
  // line_item_sandblasting_proto: LineItemSandblastingProto;
  // sandblasting_line_items: SandblastingLineItems;
  // line_item_sublimation_proto: LineItemSublimationProto
  // sublimation_line_items: SublimationLineItems;
  // line_item_vinyl_proto: LineItemVinylProto;
  // vinyl_line_items: VinylLineItems;
  // line_item_dimensional_parts_proto: LineItemDimensionalPartsProto;
  // dimensional_parts_line_items: DimensionalPartsLineItems;
  // line_item_buttons_proto: LineItemButtonsProto;
  // buttons_line_items: ButtonsLineItems;
  // graphic_item_proto: GraphicItemProto;
  // graphic: GraphicLineItems;








// var quoteModel = {
//   internal: {
//     label: 'INTERNAL',
//     items: [
//       {key: 'estimate_number', label: 'estimate #', type: 'text', col: 's4 m2'},
//       {key: 'invoice_number', label: 'invoice#', type: 'text', col: 's4 m6'},
//       {key: 'purchase_order_number', label: 'PURCHASE ORDER #', type: 'text', col: 's6 m4'},
//       {key: 'todays_date', label: 'TODAY\'S DATE', value: _now(), type: 'text', col: 's12'},
//       {key: 'in_hands_date', label: 'IN-HANDS DATE', type: 'text', col: 's12'}
//     ]
//   },
//   job: {
//     label: 'JOB',
//     items: [
//       {key: 'job_name', label: 'JOB', type: 'text', col: 's8'},
//       {key: 'from_po', label: 'From P.O.#', type: 'text', col: 's4'},
//       {key: 'art_notes', label: 'ART NOTES', type: 'textarea', col: 's12', rows: 4},
//       {key: 'printers_notes', label: 'Printer\'s Notes', type: 'textarea', col: 's12', rows: 2}
//     ]
//   },
//   submitted: false,
//   services: [],
//   notes: '',
//   need_by_date: false,
//   date_needed: '',
//   wants_mail: false,
//   client_contact_information: {
//     label: 'CONTACT INFORMATION',
//     items: [
//       {key: 'client_name', label: 'Name', type: 'text', col: 's12'},
//       {key: 'client_phone', label: 'Phone', type: 'text', col: 's12'},
//       {key: 'client_email', label: 'Email', type: 'text', col: 's12'},
//       {key: 'client_org', label: 'Company / Org / Band', type: 'text', col: 's12'}
//     ]
//   },
//   job_completion_and_shipping: {
//     label: 'COMPLETION & SHIPPING INSTRUCTIONS',  
//     items: [
//       {key: 'call_when_complete', label: 'Call', type: 'checkbox', value: false, col: 's4', notes: 'When complete.'},
//       {key: 'will_call', label: 'Pick Up', type: 'checkbox', value: false, col: 's4', notes: 'Local.'},
//       {key: 'ship_via', label: 'Ship', type: 'checkbox', value: false, col: 's4'},
//       {key: 'ship_via_txt', label: 'Ship Via', type: 'text', col: 's12', notes: 'ex: UPS, FedEx, USPS. Please specify your account # if you would like us to bill shipping charges.'},
//       {key: 'ship_to', label: 'Ship to Address', type: 'textarea', col: 's12', rows: 3}
//     ]
//   },
//   line_item_apparel_proto: {
//     service_type: 'Apparel',
//     brand_style_color: [
//       {key: 'brand', label: 'BRAND', type: 'text', col: 's4 m3 l2'},
//       {key: 'style', label: 'STYLE', type: 'text', col: 's4 m3 l2'},
//       {key: 'color', label: 'COLOR', type: 'text', col: 's4 m3 l2'},
//     ],
//     selected_sizes: [],
//     size_quantity: [],
//     apparel_sizes: ['XS', 'SM', 'MD', 'L', 'XL', '2XL', '3XL', '4XL'],
//     serviceNotes: ''
//   },
//   line_item_apparel_total_proto: {
//     line_total: {key: 'line_total', label: 'TOTAL', type: 'number', col: 's3 m2'}
//   },
//   apparel_size_quantity_proto: {key: '', label: '', type: 'number', col: 's3 m2', sum: true},
  
//   line_items: {
//     label: 'LINE ITEMS',
//     items: []
//   },

//   line_item_poster_proto: {
//     service_type: 'Posters',
//     quantity: 50,
//     poster_min: 50,
//     poster_stock_colors: ['white', 'natural', 'matte black', 'other (please describe)'],
//     selected_poster_stock: '',
//     poster_sizes: ['up to 12"x18"', 'up to 18"x24"', 'up to 24"x38"'],
//     selected_poster_size: '',
//     serviceNotes: ''
//   },

//   poster_line_items: {
//     label: 'POSTER LINE ITEMS',
//     items: []
//   },

//   line_item_sticker_proto: {
//     service_type: 'Stickers',
//     quantity: 250,
//     sticker_min: 250,
//     sticker_stock_colors: ['clear', 'gloss white', 'matte white', 'matte golden yellow', 'matte black'],
//     selected_sticker_stock: '',
//     sticker_sizes: ['1.5" x 6"','2" x 4.5"','2.25 x 4"','3" x 3"','1.125" x 6"','1.75" x 4"','2.25" x 3"','2" x 3.5"', '3" x 6"', '4" x 4.5"','3" x 9"','2.25" x 12"','2.25" x 6"','3" x 4.5"'],
//     selected_sticker_size: '',
//     serviceNotes: ''
//   },

//   sticker_line_items: {
//     label: 'STICKER LINE ITEMS',
//     items: []
//   },

//   line_item_sandblasting_proto: {
//     service_type: 'Sandblasting',
//     quantity: '',
//     substrates: ['Metal', 'Glass', 'Mirror', 'Stone', 'Ceramic', 'Other (please describe)'],
//     selected_substrates: [],
//     needs_color_fill: false,
//     fill_colors: ['red', 'yellow', 'blue', 'white', 'black'],
//     selected_fill_colors: [],
//     serviceNotes: ''
//   },

//   sandblasting_line_items: {
//     label: 'SANDBLASTING LINE ITEMS',
//     items: []
//   },

//   line_item_sublimation_proto: {
//     service_type: 'Sublimation',
//     quantity: 36,
//     bottle_min: 36,
//     sublimation_items: ['11oz Mug (white)', '15oz Mug (white)', '600ml water bottles', 'Other (please describe)'],
//     selected_sublimation_items: [],
//     watter_bottle_options: ['silver', 'white', 'Other (please describe)'],
//     selected_watter_bottle_options: [],
//     watter_bottle_tops: ['screw top', 'straw top'],
//     selected_watter_bottle_tops: [],
//     serviceNotes: ''
//   },

//   sublimation_line_items: {
//     label: 'SUBLIMATION LINE ITEMS',
//     items: []
//   },

//   line_item_vinyl_proto: {
//     dimensions: '',
//     quantity: '',
//     options: ['Indoor Wall Graphic', 'Outdoor Exterior Signage', 'Vehicle', 'Floor', 'Banner', 'Other (Please Explain)'],
//     selected_option: '',
//     serviceNotes: ''
//   },

//   vinyl_line_items: {
//     label: 'DIE-CUT VINYL',
//     items: []
//   },

//   line_item_dimensional_parts_proto: {
//     dimensions: '',
//     options: ['Wood (Raw)', 'Wood (Painted)', 'Metal (Raw)', 'Metal (Powder-coated)', 'Metal (Painted)', 'Plastic (Please Specify Type)', 'Other (Please Specify)'],
//     selected_options: [],
//     serviceNotes: ''
//   },

//   dimensional_parts_line_items: {
//     label: 'DIMENSIONAL PARTS',
//     items: []
//   },

//   line_item_buttons_proto: {
//     quantity: 250,
//     buttons_min: 250,
//     sizes: ['1"', '1.25"', '1.5"', '2.25"'],
//     selected_size: '',
//     serviceNotes: ''
//   },

//   buttons_line_items: {
//     label: 'BUTTONS',
//     items: []
//   },

//   graphic_item_proto: {
//     colors: [],
//     price: 0,
//     attachment_id: '',
//     position: '',
//     size_inches: '',
//   },

//   graphic: {
//     label: 'GRAPHICS',
//     items: []
//   }
// }


// var orderModel = {
//   header: {
//     label0: 'REBEL CRICKET SCREEN PRINTS',
//     label1: 'WORK ORDER',
//     items0: [
//       {key: 'estimate_number', label: 'estimate #', type: 'text', col: 's4 m2'},
//       {key: 'invoice_number', label: 'invoice#', type: 'text', col: 's4 m6'},
//       {key: 'purchase_order_number', label: 'PURCHASE ORDER #', type: 'text', col: 's6 m4'},
//     ],
//     items1: [
//       {key: 'todays_date', label: 'TODAY\'S DATE', value: _now(), type: 'text', col: 's12'}
//     ],
//     items2: [
//       {key: 'in_hands_date', label: 'IN-HANDS DATE', type: 'text', col: 's12'}
//     ]
//   },
//   job: {
//     label: 'JOB',
//     items: [
//       {key: 'job_name', label: 'JOB', type: 'text', col: 's8'},
//       {key: 'from_po', label: 'From P.O.#', type: 'text', col: 's4'},
//       {key: 'art_notes', label: 'ART NOTES', type: 'textarea', col: 's12', rows: 4},
//       {key: 'printers_notes', label: 'Printer\'s Notes', type: 'textarea', col: 's12', rows: 2}
//     ]
//   },
//   services: [],
//   notes: '',
//   need_by_date: false,
//   date_needed: '',
//   client_contact_information: {
//     label: 'CONTACT INFORMATION',
//     items: [
//       {key: 'client_name', label: 'Name', type: 'text', col: 's12'},
//       {key: 'client_phone', label: 'Phone', type: 'text', col: 's12'},
//       {key: 'client_email', label: 'Email', type: 'text', col: 's12'},
//       {key: 'client_org', label: 'Company / Org / Band', type: 'text', col: 's12'}
//     ]
//   },
//   job_completion_and_shipping: {
//     label: 'COMPLETION & SHIPPING INSTRUCTIONS',  
//     items: [
//       {key: 'call_when_complete', label: 'Call when complete', type: 'checkbox', value: false, col: 's6'},
//       {key: 'will_call', label: 'Will Call', type: 'checkbox', value: false, col: 's3'},
//       {key: 'ship_via', label: 'Ship', type: 'checkbox', value: false, col: 's3'},
//       {key: 'ship_via_txt', label: 'Ship Via', type: 'text', col: 's6'},
//       {key: 'ship_by_date', label: 'Ship by date', type: 'text', col: 's6'},
//       {key: 'ship_to', label: 'Ship to', type: 'textarea', col: 's12', rows: 3}
//     ]
//   },
//   line_item_proto: {key: 'xs', label: 'XS', type: 'number', col: 's3 m2 l1', sum: true},
//   line_item_sizes: ['xs', 'sm', 'md', 'l', 'xl', '2xl', '3xl', '4xl'],
//   line_items: {
//     label: 'LINE ITEMS',
//     items: [
//       [
//         {key: 'brand', label: 'BRAND', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
//         {key: 'style', label: 'STYLE', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
//         {key: 'color', label: 'COLOR', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
//         {key: 'line_total', label: 'TOTAL', type: 'number', col: 's4 m3 l2', readonly: true},
//       ]
//     ]
//   },
//   graphic: {
//     items: [{
//       top: [
//         {key: 'graphic_name', label: 'Graphic', type: 'text', col: 's12'},
//         {key: 'new_setup', label: 'New setup', type: 'text', col: 's6'},
//         {key: 'resets', label: 'Resets', type: 'number', col: 's6'},
//         {key: 'placement', label: 'Placement', type: 'text', col: 's6'},
//         {key: 'line_items_total', label: 'Total', type: 'number', col: 's6', readonly: true},
//         {key: 'color_changes', label: 'Color changes', type: 'number', col: 's12'},
//         {key: 'pricing_group', label: 'Pricing group', type: 'text', col: 's6'},
//         {key: 'flash', label: 'Flash', type: 'text', col: 's6'}
//       ],
//       color_mesh_print: [ 
//         [
//           {key: 'graphic_color', label: 'COLOR', type:'text', col: 's4'},
//           {key: 'mesh', label: 'MESH', type:'text', col: 's4'},
//           {key: 'print_order', label: 'PRINT ORDER', type:'text', col: 's4'}
//         ]
//       ],
//       bottom: [
//         {key: 'setup_start', label: 'Setup start', type: 'text', col: 's12'},
//         {key: 'setup_complete', label: 'Setup complete', type: 'text', col: 's12'},
//         {key: 'approved_by', label: 'Approved by', type: 'text', col: 's12'},
//         {key: 'print_start', label: 'Print start', type: 'text', col: 's12'},
//         {key: 'breaks', label: 'Break/s', type: 'text', col: 's12'},
//         {key: 'print_end', label: 'Print end', type: 'text', col: 's12'}
//       ]
//     }]
//   }
// }