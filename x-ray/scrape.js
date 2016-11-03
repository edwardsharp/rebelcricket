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

var init = function(){
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
        resolve();
      });

    });

  });
};


var needsNewData = function(){

  promises.push(needsNewDataPromise()); 

  Promise.all(promises).then(function(){
      console.log('needsNewData completed!');
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

    scrapeProducts();
  });
}

var scrapeProductsPromise = function(item,subitem){
  return new Promise(function(resolve){
    
    x(subitem.href, {
      items: x('.cat-list-item-container', [{
        img_href: 'img@src',
        a: '.cat-list-item-text a | trim',
        href: '.cat-list-item-text a@href'
      }])
    })(function(err, obj) {
      if(err){
        return console.log(err);
      }

      products.push({category: item.category, sub_item: subitem.title, items: obj.items })
      // writeProductsFile({category: _itemCategory, sub_item: _subitemTitle, items: obj.items });

      resolve();

    });


  });
};


var scrapeProducts = function(){
  _.each(JSON.parse(outfileData).companycasuals, function(item){
    // var _itemCategory = item.category;
    _.each(item.sub_items, function(subitem){
      // var _subitemTitle = subitem.title;
      promises.push(scrapeProductsPromise(item, subitem)); 
    });
  });

  Promise.all(promises).then(function(){
    fs.writeFile('companycasuals_'+now+'_products.json', JSON.stringify(products, null, 2),  function(err) {
      if (err) {
        return console.error(err);
      }
      console.log('wrote to', 'companycasuals_'+now+'_products.json');
      // readData();
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


