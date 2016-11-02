var fs = require('fs'); 

fs.readdir('.', function(err, items) {
  for (var i=0; i<items.length; i++) {
    // console.log(items[i]);
    if(items[i].split('_')[1] != undefined){
      if( !isNaN(parseInt( items[i].split('_')[1].split('.')[0] )) ){
        console.log('found:',items[i],items[i].split('_')[1].split('.')[0])
        if((new Date).getTime() - parseInt( items[i].split('_')[1].split('.')[0] ) > 6.048e+8 ){
          //older than 1 week?
          console.log('older than 1 week.', (new Date).getTime() - parseInt( items[i].split('_')[1].split('.')[0] ));
        } 
      }
    }
      
  }
});
