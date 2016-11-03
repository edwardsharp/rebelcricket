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

var products_by_category = [
  {
    "category": "T-Shirts ",
    "sub_item": "Tall",
    "items": [
      {
        "img_href": "http://cdn.companycasuals.com/cache/cc/PC61PT.jpg",
        "a": "Port & Company® - Tall Essential Pocket Tee. PC61PT $5.04",
        "href": "http://www.companycasuals.com/rebelcricket/b.jsp?id=6826161&parentId=7794664"
      }
    ]
  },
  {
    "category": "T-Shirts ",
    "sub_item": "Specialty",
    "items": [
      {
        "img_href": "http://cdn.companycasuals.com/cache/cc/DT276.jpg",
        "a": "District® Juniors Mesh Sleeve V-Neck Tee. DT276 $7.41",
        "href": "http://www.companycasuals.com/rebelcricket/b.jsp?id=11374714&parentId=8213733"
      }
    ]
  }
];

var x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value
    }
  }
});

_.each(products_by_category, function(item){
  _.each(item.items, function(subitem){

    x(subitem.href, {
      prod_id: 'input[name="productId"]@value',
      prod_desc_text: '.prod_desc_text',
      prod_desc_items: x('.prod_desc_text ul', ['li']),
      price_href: x('.prod_add_to_cart', ['a@href']),
      colors: x('#color_swatch_list li', [{
        href: 'img@src',
        name: 'img@title | trim'
      }])
    })(function(err, obj) {
      if(err){
        return console.log(err);
      }

      products.push({
        category: item.category,
        sub_item: item.sub_item,
        title: subitem.a,
        items: obj
      });
      console.log(JSON.stringify(products, null, 2))

    });

  });
});
