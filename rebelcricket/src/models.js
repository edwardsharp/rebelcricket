var orderModel = {
  header: {
    label0: 'REBEL CRICKET SCREEN PRINTS',
    label1: 'WORK ORDER',
    items0: [
      {key: 'estimate_number', label: 'estimate #', type: 'text', col: 's4 m2'},
      {key: 'invoice_number', label: 'invoice#', type: 'text', col: 's4 m6'},
      {key: 'purchase_order_number', label: 'PURCHASE ORDER #', type: 'text', col: 's6 m4'},
    ],
    items1: [
      {key: 'todays_date', label: 'TODAY\'S DATE', value: _now(), type: 'text', col: 's12'}
    ],
    items2: [
      {key: 'in_hands_date', label: 'IN-HANDS DATE', type: 'text', col: 's12'}
    ]
  },
  job: {
    label: 'JOB',
    items: [
      {key: 'job_name', label: 'JOB', type: 'text', col: 's8'},
      {key: 'from_po', label: 'From P.O.#', type: 'text', col: 's4'},
      {key: 'art_notes', label: 'ART NOTES', type: 'textarea', col: 's12', rows: 4},
      {key: 'printers_notes', label: 'Printer\'s Notes', type: 'textarea', col: 's12', rows: 2}
    ]
  },
  services: [],
  notes: '',
  need_by_date: false,
  date_needed: '',
  client_contact_information: {
    label: 'CONTACT INFORMATION',
    items: [
      {key: 'client_name', label: 'Name', type: 'text', col: 's12'},
      {key: 'client_phone', label: 'Phone', type: 'text', col: 's12'},
      {key: 'client_email', label: 'Email', type: 'text', col: 's12'},
      {key: 'client_org', label: 'Company / Org / Band', type: 'text', col: 's12'}
    ]
  },
  job_completion_and_shipping: {
    label: 'COMPLETION & SHIPPING INSTRUCTIONS',  
    items: [
      {key: 'call_when_complete', label: 'Call when complete', type: 'checkbox', value: false, col: 's6'},
      {key: 'will_call', label: 'Will Call', type: 'checkbox', value: false, col: 's3'},
      {key: 'ship_via', label: 'Ship', type: 'checkbox', value: false, col: 's3'},
      {key: 'ship_via_txt', label: 'Ship Via', type: 'text', col: 's6'},
      {key: 'ship_by_date', label: 'Ship by date', type: 'text', col: 's6'},
      {key: 'ship_to', label: 'Ship to', type: 'textarea', col: 's12', rows: 3}
    ]
  },
  line_item_proto: {key: 'xs', label: 'XS', type: 'number', col: 's3 m2 l1', sum: true},
  line_item_sizes: ['xs', 'sm', 'md', 'l', 'xl', '2xl', '3xl', '4xl'],
  line_items: {
    label: 'LINE ITEMS',
    items: [
      [
        {key: 'brand', label: 'BRAND', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
        {key: 'style', label: 'STYLE', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
        {key: 'color', label: 'COLOR', type: 'text', col: 's4 m3 l2', on_tap: true, readonly: true},
        {key: 'line_total', label: 'TOTAL', type: 'number', col: 's4 m3 l2', readonly: true},
      ]
    ]
  },
  graphic: {
    items: [{
      top: [
        {key: 'graphic_name', label: 'Graphic', type: 'text', col: 's12'},
        {key: 'new_setup', label: 'New setup', type: 'text', col: 's6'},
        {key: 'resets', label: 'Resets', type: 'number', col: 's6'},
        {key: 'placement', label: 'Placement', type: 'text', col: 's6'},
        {key: 'line_items_total', label: 'Total', type: 'number', col: 's6', readonly: true},
        {key: 'color_changes', label: 'Color changes', type: 'number', col: 's12'},
        {key: 'pricing_group', label: 'Pricing group', type: 'text', col: 's6'},
        {key: 'flash', label: 'Flash', type: 'text', col: 's6'}
      ],
      color_mesh_print: [ 
        [
          {key: 'graphic_color', label: 'COLOR', type:'text', col: 's4'},
          {key: 'mesh', label: 'MESH', type:'text', col: 's4'},
          {key: 'print_order', label: 'PRINT ORDER', type:'text', col: 's4'}
        ]
      ],
      bottom: [
        {key: 'setup_start', label: 'Setup start', type: 'text', col: 's12'},
        {key: 'setup_complete', label: 'Setup complete', type: 'text', col: 's12'},
        {key: 'approved_by', label: 'Approved by', type: 'text', col: 's12'},
        {key: 'print_start', label: 'Print start', type: 'text', col: 's12'},
        {key: 'breaks', label: 'Break/s', type: 'text', col: 's12'},
        {key: 'print_end', label: 'Print end', type: 'text', col: 's12'}
      ]
    }]
  }
}