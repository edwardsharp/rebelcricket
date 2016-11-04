var outfile
  , outfileData
  , products_by_category = []
  , products_by_category_outfile
  , products = []
  , products_by_price = []
  , fs = require('fs')
  , _ = require('underscore')
  , now = new Date().getTime()
  , Xray = require('x-ray')
  , Promise = require("bluebird")
  , scrape_promises = []
  , scrape_categories_promises = []
  , scrape_details_promises = []
  , scrape_prices_promises = []
  ;

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    console.log('products:',JSON.stringify(products, null, 2));
    console.log('\n\n\n\n\n\n\n');
    console.log('products_by_price:',JSON.stringify(products_by_price, null, 2));
    process.exit();
});

var x = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value
    }
  }
}).throttle(2,200);

var init = function(){
  console.log('now:',now);
  fs.readdir('.', function(err, items) {
    for (var i=0; i<items.length; i++) {
      if(items[i].split('_')[1] != undefined && items[i].split('_')[2] == undefined){
        if( !isNaN(parseInt( items[i].split('_')[1].split('.')[0] )) ){
          console.log('found:',items[i],items[i].split('_')[1].split('.')[0]);
          if((new Date).getTime() - parseInt( items[i].split('_')[1].split('.')[0] ) > 6.048e+8 ){
            //older than 1 week?
            console.log('older than 1 week.', (new Date).getTime() - parseInt( items[i].split('_')[1].split('.')[0] ));
            needsNewData();
          }else{
            outfile = items[i];
          }
        }
      }
    }
    if(outfile == undefined){
      outfile = 'companycasuals_'+now+'.json';
      needsNewData();
    }else{
      readData();
    }
    
  });
}

var needsNewDataPromise = function(){
  return new Promise(function(resolve){
    
    x('http://www.companycasuals.com/rebelcricket/start.jsp', {
      categories: x('.main_nav_container ul li', [{
        title: 'a@title | trim',
        sub_items: x('ul li', [{title: 'li a | trim', href: 'li a@href'}])
      }])
    })(function(err, obj) {

      var companycasuals = { companycasuals: _.filter(obj.categories, function(item){
          return item.category;
        }) 
      }

      // console.log('obj:', JSON.stringify(companycasuals, null, 2));
      fs.writeFile(outfile,  JSON.stringify(companycasuals, null, 2), function(err) {
        if(err) {
          return console.log(err);
        }
        console.log(outfile+' saved');
      });

      resolve();

    });

  });
};


var needsNewData = function(){

  scrape_promises.push(needsNewDataPromise()); 

  Promise.all(scrape_promises).then(function(){
      // console.log('needsNewData completed!');
      readData();
  });

}

var readData = function(){

  fs.readFile(outfile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    console.log('reading outfile!: ',outfile);
    outfileData = data;

    scrapeProductCategories();
  });
}

var scrapeProductCategoriesPromise = function(item,subitem){
  return new Promise(function(resolve){
    
    x(subitem.href, {
      items: x('.cat-list-item-container', [{
        img_href: 'img@src',
        a: '.cat-list-item-text a | trim',
        href: '.cat-list-item-text a@href'
      }])
    })(function(err, obj) {
      if(err){
        resolve();
        return console.log(err);
      }

      products_by_category.push({category: item.category, sub_item: subitem.title, items: obj.items })
      // console.log('scrapeProductCategoriesPromise complete!');
      resolve();

    });


  });
}


var scrapeProductCategories = function(){
  _.each(JSON.parse(outfileData).companycasuals, function(item){
    // var _itemCategory = item.category;
    _.each(item.sub_items, function(subitem){
      // var _subitemTitle = subitem.title;
      scrape_categories_promises.push(scrapeProductCategoriesPromise(item, subitem)); 
    });
  });

  Promise.all(scrape_categories_promises).then(function(){
    products_by_category_outfile = 'companycasuals_'+now+'_products_by_category.json';
    fs.writeFile(products_by_category_outfile, JSON.stringify(products_by_category, null, 2),  function(err) {
      if (err) {
        return console.error(err);
      }
      console.log('scrapeProductCategories complete, wrote to', products_by_category_outfile, ' gonna scrapeProductDetails!');
      scrapeProductDetails();
    });
  });
}

var scrapeProductDetailsPromise = function(item, subitem){
  return new Promise(function(resolve){
    
    x(subitem.href, {
      prod_id: 'input[name="productId"]@value',
      prod_desc_text: '.prod_desc_text | trim',
      prod_desc_items: x('.prod_desc_text ul', ['li | trim']),
      price_href: x('.prod_add_to_cart', ['a@href']),
      colors: x('#color_swatch_list li', [{
        href: 'img@src',
        name: 'img@title | trim'
      }])
    })(function(err, obj) {
      if(err){
        resolve();
        return console.log(err);
      }

      products.push({
        category: item.category,
        sub_item: item.sub_item,
        title: subitem.a,
        items: obj
      });

      // console.log('scrapeProductDetailsPromise complete!');

      resolve();
      // console.log(JSON.stringify(products, null, 2))

    });


  });
}


var scrapeProductDetails = function(){
  _.each(products_by_category, function(item){
    _.each(item.items, function(subitem){

      scrape_details_promises.push(scrapeProductDetailsPromise(item, subitem)); 

    });
  });

  Promise.all(scrape_details_promises).then(function(){

    fs.writeFile('companycasuals_'+now+'_product_details.json', JSON.stringify(products, null, 2),  function(err) {
      if (err) {
        return console.error('scrapeProductDetails fs.writeFile err:',err);
      }
      console.log('wrote to', 'companycasuals_'+now+'_products_details.json gonna scrapeProductPrices!');
      scrapeProductPrices();
    });
  });

}

var scrapeProductPricesPromise = function(product, _product_href){
  return new Promise(function(resolve){
    x(_product_href, {
      colors: x('.shoptable tr', [{
        img_href: '.swatch img@src',
        name: '.description | trim',
        prices: ['td | trim']
      }])
    })(function(err, obj) {
      if(err){
        resolve();
        return console.log(err);
      }

      product.items["prices"] = _.reject(obj.colors, function(color){
        return _.every(color.prices, function(price){ 
          return price == '' 
        }) || color.name == undefined || color.prices == undefined || color.prices[0] != '';
      });

      //console.log('scrapeProductPricesPromise product',JSON.stringify(product, null, 2));
      products_by_price.push(product);

      resolve();

    });
  });
}

var scrapeProductPrices = function(){

  _.each(products, function(product){
    var _product_href = false;
    if(product.items.price_href[1] == undefined){
      if(product.items.price_href[0] != undefined){
        _product_href = product.items.price_href[0];
      }
    }else{
      _product_href = product.items.price_href[1];
    }

    if(_product_href != undefined){
      scrape_prices_promises.push(scrapeProductPricesPromise(product, _product_href));
    }

  });

  Promise.all(scrape_prices_promises).then(function(){

    fs.writeFile('companycasuals_'+now+'_product_prices.json', JSON.stringify(products_by_price, null, 2),  function(err) {
      if (err) {
        return console.error(err);
      }
      console.log('wrote to', 'companycasuals_'+now+'_product_prices.json');
      console.log('done! time:', new Date().getTime() - now);
      return;
    });
  });

}

init();



// x('http://www.companycasuals.com/rebelcricket/start.jsp', {
//   categories: x('.main_nav_container ul li', [{
//     title: 'a@title | trim',
//     sub_items: x('ul li', [{title: 'li a | trim', href: 'li a@href'}])
//   }])
// }).write(outfile).on('finish', function(){
//   console.log('needsNewDataPromise completed ');
//   resolve();
// });


