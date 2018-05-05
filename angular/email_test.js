const PouchDB = require('pouchdb');
const Handlebars = require('handlebars');

const orders = new PouchDB('http://rebelcricket-admin:zomgzomg@localhost:5984/orders');

const text_mail = `
ORDER {{_id}}
  Date: {{created_at}}
  Name: {{name}}
  Email: {{email}}
  Phone: {{phone}}
  Notes: {{notes}}

  {{#base_order_fields}}
    {{#unless internal}}{{name}}: {{value}}{{/unless}}
  {{/base_order_fields}}


  Line Items:
  {{#line_items}}
    {{service_label}} 
    Quantity: {{quantity}}
    Notes: {{notes}}
    {{#items}}
      {{#unless internal}}{{name}}: {{value}}{{/unless}}
    {{/items}}
    {{#vendor_goods}}
      {{vendor_title}} ({{vendor_category}} {{vendor_sub_category}})
      {{#selected_items}}
        Color: {{color}}, Qty: {{qty_total}}
      {{/selected_items}}
    {{/vendor_goods}}
  {{/line_items}}

  Graphics:
  {{#attachments}}
    {{#files}}
      {{name}} {{process.env.NG_HOST}}/uploads/{{thumb}}
    {{/files}}
  {{/attachments}}

  {{#each canvasLayerColors}}
      {{@key}} colors: {{this}}
  {{/each}}
  `;
  //<img src="{{process.env.NG_HOST}}/uploads/{{thumb}}" alt="{{name}}" border="0" />
  
  const template = Handlebars.compile(text_mail);

orders.get('jgsfn6o7').then( order => {
  console.log( template(order) );
});

// orders.allDocs({
//   include_docs: true,
//   attachments: true
// }).then(function (result) {
//   // let i = 0;
//   for(let row of result.rows){
//     // if(i < 15){
//       console.log( template(row.doc) );
//     // }else{
//     //   break;
//     // }
//     // i++;
//   }
// });

  

