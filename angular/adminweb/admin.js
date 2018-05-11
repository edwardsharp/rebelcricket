// admin.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const url = require('url');

const proxy = require('http-proxy-middleware');

const couchProxy = proxy('http://localhost:5984', {
    forwardPath: req => url.parse(req.url).path.replace('/_couch',''),
    pathRewrite: {
      '^/_couch' : '/'           // remove base path
    }
});

app.use("/_couch/*", couchProxy);

const ngProxy = proxy('http://localhost:4200', {
    forwardPath: req => url.parse(req.url).path
});

app.use("/*", ngProxy);

app.use(bodyParser.json()); // for parsing application/json

const corsOptions = {
  origin: [ 
    'http://localhost:8091',
    'https://admin.rebelcricket.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// app.use(express.static(__dirname + '/dist'));

// app.options('*', cors(corsOptions)) // cors for all options pre-flight requests

// app.get('/_couch/*', function(req,res) {
//   var newurl = 'http://localhost:5984/'+url.parse(req.url).path;
//   request(newurl).pipe(res);
// });

//redirect everything (else) to angular (index.html)
// app.get('/*', function(req, res) {
//   //res.sendFile(path.join(__dirname + '/dist/index.html'));
//   var newurl = 'http://localhost:4200/'+url.parse(req.url).path;
//   request(newurl).pipe(res);
// });

//boot.
app.listen(process.env.ADMIN_PORT || 8091);
console.log('listening on http://localhost:',process.env.ADMIN_PORT || 8091);
