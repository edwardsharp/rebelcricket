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


x('https://www.companycasuals.com/rebelcricket/b.jsp?productId=2000&parentId=624&prodimage=2000.jpg&cart=Y&swatch=&httpsecure=Y', {
  colors: x('.shoptable tr', [{
    img_href: '.swatch img@src',
    name: '.description | trim',
    prices: ['td | trim']
  }])
})(function(err, obj) {
  if(err){
    return console.log(err);
  }

  console.log(JSON.stringify({
    colors: _.reject(obj.colors, function(color){
      return _.every(color.prices, function(price){ 
        return price == '' 
      }) || color.name == undefined || color.prices == undefined || color.prices[0] != '';
    })
  }, null, 2))

});


