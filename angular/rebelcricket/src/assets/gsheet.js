

/* template html:
<button id="authorize-button" style="display: none;">Authorize</button>
<button id="signout-button" style="display: none;">Sign Out</button>


<div id="content"></div>

<button id="create-sheet-button" style="display: none;">Create Sheet</button>
<div id="new-sheet-content"></div>

<script async defer src="https://apis.google.com/js/api.js"
  onload="this.onload=function(){};handleClientLoad()"
  onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>

"updateSheetProperties": {
            "properties": {
              "sheetId": sheetId,
              "gridProperties": {
                "rowCount": rows.length + 2
                // ,"columnCount": COLUMNS.length
              }
            },
            "fields": '*'
          }

                 "userEnteredFormat": {
                    'backgroundColor': {
                        'red': .2,
                        'blue': .75,
                        'green': .75
                    },
                    "horizontalAlignment" : "CENTER",
                    "textFormat": {
                      "foregroundColor": {
                        "red": 1.0,
                        "green": 1.0,
                        "blue": 1.0
                      },
                      "fontSize": 12,
                      "bold": true
                    }
                }
                */

var sheetId;
var rows = [];

var fields = [];
var fieldsRow = [];
var orderedFields = [];

let companycasualz = [
  '/assets/vendor-goods/1481360436454-companycasuals-accessories.json',
  '/assets/vendor-goods/1481360436454-companycasuals-activewear.json',
  '/assets/vendor-goods/1481360436454-companycasuals-bags.json',
  '/assets/vendor-goods/1481360436454-companycasuals-caps.json',
  '/assets/vendor-goods/1481360436454-companycasuals-infant___toddler.json',
  '/assets/vendor-goods/1481360436454-companycasuals-juniors___young_men.json',
  '/assets/vendor-goods/1481360436454-companycasuals-ladies.json',
  '/assets/vendor-goods/1481360436454-companycasuals-outerwear.json',
  '/assets/vendor-goods/1481360436454-companycasuals-polos_knits.json',
  '/assets/vendor-goods/1481360436454-companycasuals-sweatshirts_fleece.json',
  '/assets/vendor-goods/1481360436454-companycasuals-t_shirts_.json',
  '/assets/vendor-goods/1481360436454-companycasuals-tall.json',
  '/assets/vendor-goods/1481360436454-companycasuals-workwear.json',
  '/assets/vendor-goods/1481360436454-companycasuals-woven_shirts.json',
  '/assets/vendor-goods/1481360436454-companycasuals-youth.json'
]
appendPre('loading '+companycasualz.length+' filez...');
for(let url of companycasualz){
  
  fetch(url)
    .then(res => res.json())
    .then((out) => {
      if(fields.length == 0){
        fields = _.reduce(out, function(vendorGood,v){
          return _.union(vendorGood,Object.keys(v));
        });
        //["selected","price","title","category","sub_item","colors","color_prices","prod_id","prod_desc_text","prod_desc_items","price_href"]
        //price title category  sub_category  colors  color_size_price  prod_id prod_desc_text  prod_desc_items price_href 
        
        _.each([ "category",
          "sub_item",
          "title",
          "prod_id",
          "price",
          "colors_count",
          "prod_desc_text",
          "prod_desc_items",
          "price_href",
          "colors",
          "color_prices"], function(f){

          if(f == 'sub_item'){
            f = 'sub_category';
          }
          if(f == 'color_prices'){
            f = 'color_size_prices';
          }
          if(f == 'price_href'){
            f == 'href_items';
          }
          if(f != 'selected'){
            fieldsRow.push({
              "userEnteredValue": { "stringValue": f },
              "userEnteredFormat": {
                "horizontalAlignment" : "CENTER",
                "textFormat": { "bold": true }
              }
            });
            orderedFields.push(f);
          }
          
        });
        fieldsRow = {
          "values": fieldsRow
        };
      }

      _.each(out, function(g){
        // S+T+R+I+N+G+I+F+Y
        // g.selected = g.selected ? 't' : 'f';
        delete g.selected;
        g["sub_category"] = g.sub_item;
        delete g.sub_item;

        g.colors = JSON.stringify( _.map(g.colors, function(c){return [c.name, c.href]}) );
        
        var color_size_prices = [];
        _.each(g.color_prices, function(v){
          var color = v.shift()[1];
          color_size_prices.push({color:color,size_prices:v});
        });
        delete g.color_prices;
        g["color_size_prices"] = JSON.stringify(color_size_prices);
        g["colors_count"] = color_size_prices.length.toString();
        g.color_prices = JSON.stringify(g.color_prices);
        g["href_items"] = JSON.stringify(g.href_items);
        delete g.price_href; 
        g.prod_desc_items = JSON.stringify(g.prod_desc_items);

        var values = [];
        _.each(orderedFields, function(f){
          if(g[f] != undefined){
            values.push({
              "userEnteredValue": 
              {
                "stringValue": g[f]
              }
            });
          }
        });

        rows.push({
          "values": values
        });
    
      });

      console.log('vendor goodz JSON:', rows);
    })
    .catch(err => {console.error('o noz! vendor json err:',err);appendPre('o noz! fetch and parse json err:',err);} );

}

// Client ID and API key from the Developer Console
var CLIENT_ID = '89197182438-ubo90q5tik0pktvh88vcekks34knjcsa.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCBoUSi-sA5Yofhcu4XRyviiyWJ0E2y9Ig';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var createSheetButton = document.getElementById('create-sheet-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  console.log('handleClientLoad');

  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  console.log('initClient');

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    createSheetButton.onclick = writeNewSheet;
  });


  ///wellllll///////
  // .then(()=> {
  //     // Listen for sign-in state changes.
  //   gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));

  //     // Handle the initial sign-in state.
  //     this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  //   });

}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log('gonna updateSigninStatus()');
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    createSheetButton.style.display = 'block';
    getSpreadsheet();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    createSheetButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function getSpreadsheet() {
  console.log('gonna getSpreadsheet()');
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s',
    range: 'Sheet1!A1:ZZ',
  }).then(function(response) {
    console.log('ZZZZZZZOMG response:',response);
    var range = response.result;
    appendPre('ready!');
    // if (range.values.length > 0) {
    //   appendPre(' ');
    //   for (i = 0; i < range.values.length; i++) {

    //     appendPre(range.values[i]);
    //   }
    // } else {
    //   appendPre('No data found.');
    // }
  }, function(response) {
    appendPre('o noz! getSpreadsheet err: ' + response.result.error.message);
  });
}

// function writeNewSheet() {
//   var params = {
//     // The ID of the spreadsheet to update.
//     spreadsheetId: '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s',  // TODO: Update placeholder value.

//     // The A1 notation of a range to search for a logical table of data.
//     // Values will be appended after the last row of the table.
//     range: 'Sheet-'+Math.random().toString(36).substr(2, 5)+'!A1:ZZ',  // TODO: Update placeholder value.

//     // How the input data should be interpreted.
//     valueInputOption: 'RAW', 
//     ['RAW','USER_ENTERED'] 
//       RAW The values the user has entered will not be parsed and will be stored as-is.
//       USER_ENTERED  The values will be parsed as if the user typed them into the UI. 
//       Numbers will stay as numbers, but strings may be converted to numbers, dates, etc. 
//       following the same rules that are applied when entering text into a cell via the 
//       Google Sheets UI.

//     // How the input data should be inserted.
//     insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
//   };

//   var valueRangeBody = {
//     // TODO: Add desired properties to the request body.
//   };

//   var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
//   request.then(function(response) {
//     // TODO: Change code below to process the `response` object:
//     console.log(response.result);

//     var pre = document.getElementById('new-sheet-content');
//     var textContent = document.createTextNode(response.result + '\n');
//     pre.appendChild(textContent);

//   }, function(reason) {
//     console.error('error: ' + reason.result.error.message);
//   });
// }

function writeSheetRows(sheetId){
  var params = {
    spreadsheetId: '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s'
  };
  var batch = {};
  batch['requests'] = [];

  for (var i = 0; i < rows.length; i += 999){

    var batch_rows = rows.slice(i, i + 999);

    batch.requests.push({
      "updateCells": {
        "start": {
          "sheetId": sheetId,
          "rowIndex": i+2, //+2 to not write the header row.
          "columnIndex": 0
        },
        "rows": batch_rows,
        "fields": '*'
      }
    });
  } // for batch_rows

  batch.requests.push({
    "addProtectedRange": {
      "protectedRange": {
        "range": {
          "sheetId": sheetId,
        },
        "description": "Read Only",
        "warningOnly": true
      }
    }
  });
  gapi.client.sheets.spreadsheets.batchUpdate(params, batch).then(function(resp){
    document.getElementById('new-sheet-content').appendChild(document.createTextNode(
       sheetId + ' batch rows written \n')
    );
  }, function(err){
    console.log('write sheet err:',err);
    document.getElementById('new-sheet-content').appendChild(document.createTextNode(
       'batch rows write err:' + err.result.error.message + ' \n')
    );
  });
}


function writeNewSheet() {
  var params = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s',  // TODO: Update placeholder value.
  };

  sheetId = Math.random().toString(36).substr(2, 5);
  var batchUpdateSpreadsheetRequestBody = {
    // A list of updates to apply to the spreadsheet.
    // Requests will be applied in the order they are specified.
    // If any request is not valid, no requests will be applied.
    requests: [
        {
          "addSheet": {
            "properties": {
              "title": sheetId,
              "gridProperties": {
                "rowCount": rows.length+2
                // ,"columnCount": 12
              }
            }
          }
        }
      ]

    // TODO: Add desired properties to the request body.
  };

  
  var request = gapi.client.sheets.spreadsheets.batchUpdate(params, batchUpdateSpreadsheetRequestBody);
  request.then(function(response) {
    console.log(response.result);
    if(response.result.replies["0"].addSheet.properties.sheetId){
      sheetId = response.result.replies["0"].addSheet.properties.sheetId;

      gapi.client.sheets.spreadsheets.batchUpdate(params, {requests: [
        {
          "updateCells": {
            "start": {
              "sheetId": sheetId,
              "rowIndex": 0,
              "columnIndex": 0
            },
            "rows": fieldsRow,
            "fields": '*'
          }
        }
      ]}).then(function(resp){
        document.getElementById('new-sheet-content').appendChild(document.createTextNode(
           sheetId + ' fields added to new sheet \n')
        );
      }, function(err){
        console.log('write sheet err:',err);
        document.getElementById('new-sheet-content').appendChild(document.createTextNode(
           'err:' + err.result.error.message + ' \n')
        );
      });

      writeSheetRows(sheetId);

    }

    if(response.result.replies["0"].addSheet.properties.title){
      document.getElementById('new-sheet-content').appendChild(document.createTextNode(
        response.result.replies["0"].addSheet.properties.title + '\n')
      );
    }
    
  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}
