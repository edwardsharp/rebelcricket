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
*/


/*                 "userEnteredFormat": {
                    'backgroundColor': {
                        'red': .2,
                        'blue': .75,
                        'green': .75
                    }
                }
                */
var rows = [];

var fields = [];
let url = '/assets/vendor-goods/1481360436454-companycasuals-infant___toddler.json';

fetch(url)
  .then(res => res.json())
  .then((out) => {
    fields = _.reduce(out, function(vendorGood,v){
      return _.union(vendorGood,Object.keys(v));
    });

    _.each(out, function(g){
      // S+T+R+I+N+G+I+F+Y
      g.selected = g.selected ? 't' : 'f';
      g.colors = _.map(g.colors, function(c){return [c.name, c.href]}).join(', ');
      g.color_prices = g.color_prices.join(', ');
      g.price_href = g.price_href.join(', ');
      g.prod_desc_items = g.prod_desc_items.join(', ');
      
      var values = [];
      _.each(Object.values(g), function(v){
        values.push({
          "userEnteredValue": 
          {
            "stringValue": v
          }
        });
      });

      rows.push({
        "values": values
      });
  
    });

    console.log('vendor goodz JSON:', rows);
  })
  .catch(err => console.error('o noz! vendor json err:',err));


// Client ID and API key from the Developer Console
var CLIENT_ID = '';
var API_KEY = '';

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
    if (range.values.length > 0) {
      appendPre(' ');
      for (i = 0; i < range.values.length; i++) {

        appendPre(range.values[i]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
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


function writeNewSheet() {
  var params = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: '1yJlSC9LtuBJEPmHJE8CQEWjxmuS0z0GqmYf45YZHM_s',  // TODO: Update placeholder value.
  };

  var sheetId = Math.random().toString(36).substr(2, 5);
  var batchUpdateSpreadsheetRequestBody = {
    // A list of updates to apply to the spreadsheet.
    // Requests will be applied in the order they are specified.
    // If any request is not valid, no requests will be applied.
    requests: [
        {
          "addSheet": {
            "properties": {
              "title": sheetId,
              // "gridProperties": {
              //   "rowCount": 20,
              //   "columnCount": 12
              // }
            }
          }
        }
      ]

    // TODO: Add desired properties to the request body.
  };

  var sheetId;
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
            "rows": rows,
            "fields": '*'
            // ,
            // "fields": fields.join(',') //i guess/hope these are all key'd the same?!
          }
        },{
          "addProtectedRange": {
            "protectedRange": {
              "range": {
                "sheetId": sheetId,
              },
              "description": "Read Only",
              "warningOnly": true
            }
          }
        }
      ]}).then(function(resp){
        document.getElementById('new-sheet-content').appendChild(document.createTextNode(
           sheetId + ' Protected \n')
        );
      }, function(err){
        console.log('write sheet err:',err);
        document.getElementById('new-sheet-content').appendChild(document.createTextNode(
           'err:' + err.result.error.message + ' \n')
        );
      });


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
