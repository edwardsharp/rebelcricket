// admin.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

const corsOptions = {
  origin: [ 
    'https://admin.rebelcricket.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.static(__dirname + '/dist'));

app.options('*', cors(corsOptions)) // cors for all options pre-flight requests

//redirect everything (else) to angular (index.html)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

//boot.
app.listen(process.env.ADMIN_PORT || 8091);
