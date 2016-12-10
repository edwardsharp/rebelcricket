var outfileData
  , newData = []
  , fs = require('fs')
  , _ = require('underscore')
  , now = new Date().getTime()
  ;

var init = function(){
  if(process.argv[2] != undefined){
    fs.readFile(process.argv[2], 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      console.log('reading outfile!: ',process.argv[2]);
      outfileData = JSON.parse(data);

      parseData();

    });

  }else{
    process.exit();
    console.log('need 2 argz: infile, outfile.')
  }
}

var parseData = function(){
  
  _.each(outfileData, function(val, index) {
    if(outfileData[index]["title"].match(/\$/) != undefined){
      newData.push({
        selected: false,
        price: (outfileData[index]["title"].match(/\$\d+(\.\d+)?/g) || [''])[0].replace('$',''),
        title: outfileData[index]["title"],
        category: outfileData[index]["category"],
        sub_item: outfileData[index]["sub_item"],
        colors: outfileData[index]["items"]["colors"],
        color_prices: outfileData[index]["items"]["color_prices"],
        prod_id: outfileData[index]["items"]["prod_id"],
        prod_desc_text: outfileData[index]["items"]["prod_desc_text"],
        prod_desc_items: outfileData[index]["items"]["prod_desc_items"],
        price_href: outfileData[index]["items"]["price_href"]
      });
    }
  });

  if(process.argv[3] != undefined){

    var _catz = _.uniq(_.map(newData, function(item){
      return item.category;
    }));

    _.each(_catz, function(_cat){
      var _catData = _.sortBy(_.where(newData, {category: _cat}), 'price');

      fs.writeFile( now+'-'+process.argv[3]+'-'+_cat.replace(/[^a-z0-9]/gi, '_').toLowerCase()+'.json', JSON.stringify(_catData, null, 2),  function(err) {
        if (err) {
          return console.error(err);
        }
        
      });

    });

    
  }else{
    process.exit();
    console.log('need 2 argz: infile, outfile.')
  }
}

//and go
init();
