var outfile
  , outfileData
  , products = []
  , fs = require('fs')
  , _ = require('underscore')
  , now = new Date().getTime()
  , Xray = require('x-ray')
  , Promise = require("bluebird")
  , promises = []
  ;



var x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value
    }
  }
});

fs.readFile('companycasuals_1478145832925_product_details.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  console.log('reading outfile!: companycasuals_1478145832925_product_details.json');
  products = JSON.parse(data);

  _.each(products, function(product){
    if(product.items.price_href[1] == undefined){
      console.log(product.items.price_href);
    }
    
  });

});



// x('https://www.companycasuals.com/rebelcricket/b.jsp?productId=2000&parentId=624&prodimage=2000.jpg&cart=Y&swatch=&httpsecure=Y', {
//   colors: x('.shoptable tr', [{
//     img_href: '.swatch img@src',
//     name: '.description | trim',
//     prices: ['td | trim']
//   }])
// })(function(err, obj) {
//   if(err){
//     return console.log(err);
//   }

//   console.log(JSON.stringify({
//     colors: _.reject(obj.colors, function(color){
//       return _.every(color.prices, function(price){ 
//         return price == '' 
//       }) || color.name == undefined || color.prices == undefined || color.prices[0] != '';
//     })
//   }, null, 2))

// });


