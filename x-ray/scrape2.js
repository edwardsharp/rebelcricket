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

function equalLength(){
   var len = arguments.length;
   for (var i = 1; i< len; i++){
      if (arguments[i] == null || arguments[i] != arguments[i-1])
         return false;
   }
   return true;
}

var x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value
    }
  }
});

// fs.readFile('companycasuals_1478145832925_product_details.json', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }

//   console.log('reading outfile!: companycasuals_1478145832925_product_details.json');
//   products = JSON.parse(data);

//   _.each(products, function(product){
//     if(product.items.price_href[1] == undefined){
//       console.log(product.items.price_href);
//     }
    
//   });

// });


var basic_shirt_href = 'https://www.companycasuals.com/rebelcricket/b.jsp?productId=2000&parentId=624&prodimage=2000.jpg&cart=Y&swatch=&httpsecure=Y';
var werid_pantz_size_href = 'http://www.companycasuals.com/rebelcricket/b.jsp?productId=PT20&parentId=7794697&prodimage=PT20.jpg&cart=Y&swatch=&httpsecure=Y';

x(werid_pantz_size_href, {
  colors: x('.shoptable tr', [{
    img_href: '.swatch img@src',
    name: '.description | trim',
    prices: ['td | trim']
  }])
})(function(err, obj) {
  if(err){
    return console.log(err);
  }
  var size_idx = [];
  var low_idx = [];
  var price_idx = [];

  _.each(obj.colors, function(color){
    var pricearr = color.prices;
    if(pricearr != undefined && pricearr[0] != undefined && !pricearr[0].match(/cart/i)){
      if(pricearr[0].match(/Shop/i)){
        console.log('SIZE IDX!');
        size_idx = pricearr;
      }else if(_.contains(pricearr,function(elem){ return elem != undefined && elem.match(/red/i);})){
        console.log('LOW IDX!');
        low_idx = pricearr;
      }else if(pricearr.length > 1){
        console.log('PRICE IDX!');
        pricearr.splice(0, 1);
        price_idx = pricearr;
        console.log('-------------------------------');
        console.log('ZIP: ', _.zip(size_idx, price_idx, low_idx));
        console.log('-------------------------------');
      }else{
        console.log('dunno, pricearr',pricearr);
      }
    }else{
      console.log('ZOMG ELSE!', pricearr);
    }
    
  });

  if(equalLength(price_idx, size_idx, low_idx)){
    console.log('equalLength!');
    
  }else{
    console.log('NOT equalLength!');
    console.log('_idx:',size_idx.length, price_idx.length, low_idx.length);

  }
  

  // console.log(JSON.stringify({
  //   colors: _.reject(obj.colors, function(color){
  //     return _.every(color.prices, function(price){ 
  //       return price == '' 
  //     });// || color.name == undefined || color.prices == undefined || color.prices[0] != '';
  //   })
  // }, null, 2))

});

// var numNotTen = 0;
// var numIsTen = 0;
// var uniqItems = [];
// fs.readFile('companycasuals_1478218199631_product_prices.json', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }

//   console.log('reading outfile!: companycasuals_1478218199631_product_prices.json');
//   json = JSON.parse(data);

//   _.each(json, function(product){
//     _.each(product.items.prices, function(price){
//       uniqItems.push(price.prices.length);
//       uniqItems = _.uniq(uniqItems);
//       if(price.prices.length != 10){
//         numNotTen += 1;
//       }else{
//         numIsTen += 1;
//       }
//       if(price.prices.length > 12){
//         console.log('length > 9? price_href: ',product.items.price_href,' price:',price);
//       }

//     })
    
//   });

//   console.log('numNotTen: ',numNotTen,' numIsTen:',numIsTen,' uniqItems:',uniqItems);
// });



