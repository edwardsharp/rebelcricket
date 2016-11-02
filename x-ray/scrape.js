var Xray = require('x-ray');
var x = Xray();
var fs = require('fs'); 
var outfile;

var _ = require('underscore');

var init = function(){
  fs.readdir('.', function(err, items) {
    for (var i=0; i<items.length; i++) {
      // console.log(items[i]);
      if(items[i].split('_')[1] != undefined){
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
      }9
    }
    if(outfile == undefined){
      outfile = 'companycasuals_'+ new Date().getTime() +'.json';
      needsNewData();
    }else{
      readData();
    }
    
  });
}


var needsNewData = function(){

  x('http://www.companycasuals.com/rebelcricket/start.jsp', {
    items: x('.main_nav_container ul li', [{
      category: 'a@title',
      sub_items: x('ul li', [{title: 'li a', href: 'li a@href'}])
    }])
  })(function(err, obj) {

    var companycasuals = { companycasuals: _.filter(obj.items, function(item){
        return item.category;
      }) 
    }
    // console.log('obj:', JSON.stringify(companycasuals, null, 2));
    fs.writeFile(outfile,  JSON.stringify(companycasuals, null, 2), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log(outfile+' saved');
      readData();
    });

  });

}

var readData = function(){

  fs.readFile(outfile, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    console.log('read outfile: ',data);
  });
}


init();


