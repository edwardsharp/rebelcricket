// admin.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const url = require('url');
const proxy = require('http-proxy-middleware');
const Sequelize = require('sequelize');

const couchProxy = proxy('http://localhost:5984', {
    forwardPath: req => url.parse(req.url).path.replace('/_couch',''),
    pathRewrite: {
      '^/_couch' : '/'           // remove base path
    }
});

app.use("/_couch/*", couchProxy);

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


const sequelize = new Sequelize('postgres://rebelcricket:password@localhost:5432/rebelcricket', { 
	define: {
  	timestamps: false
  }
});

const Style = sequelize.define('styles', {
	company: { type: Sequelize.TEXT, field: 'Company'},
	styleCode: { type: Sequelize.TEXT, field: 'Style Code', primaryKey: true},
	description: { type: Sequelize.TEXT, field: 'Description'},
	features: { type: Sequelize.TEXT, field: 'Features'},
	domain: { type: Sequelize.TEXT, field: 'Domain'},
	prodDetailImage: { type: Sequelize.TEXT, field: 'ProdDetail Image'},
	prodThumbnailImage: { type: Sequelize.TEXT, field: 'ProdThumbnail Image'},
	prodCompareImage: { type: Sequelize.TEXT, field: 'ProdCompare Image'},
	prodSearchImage: { type: Sequelize.TEXT, field: 'ProdSearch Image'},
	millCategory: { type: Sequelize.TEXT, field: 'Mill-Category'},
	millCode: { type: Sequelize.TEXT, field: 'Mill Code'},
	categoryCode: { type: Sequelize.TEXT, field: 'Category Code'},
	itemCount: { type: Sequelize.TEXT, field: 'Item Count'},
	millName: { type: Sequelize.TEXT, field: 'Mill Name'},
	categoryName: { type: Sequelize.TEXT, field: 'Category Name'},
	popularity: { type: Sequelize.TEXT, field: 'Popularity'}
});
// Style.sync();
const Item = sequelize.define('items', {
  company: { type: Sequelize.TEXT, field: 'Company'},
	itemNumber: { type: Sequelize.TEXT, field: 'Item Number'},
	description: { type: Sequelize.TEXT, field: 'Description'},
	features: { type: Sequelize.TEXT, field: 'Features'},
	piece: { type: Sequelize.TEXT, field: 'Piece'},
	dozen: { type: Sequelize.TEXT, field: 'Dozen'},
	case: { type: Sequelize.TEXT, field: 'Case'},
	styleCode: { type: Sequelize.TEXT, field: 'Style Code', primaryKey: true},
	sizeName: { type: Sequelize.TEXT, field: 'Size Name'},
	sizeCategory: { type: Sequelize.TEXT, field: 'Size Category'},
	sizeCode: { type: Sequelize.TEXT, field: 'Size Code'},
	colorName: { type: Sequelize.TEXT, field: 'Color Name'},
	hexCode: { type: Sequelize.TEXT, field: 'Hex Code'},
	colorCode: { type: Sequelize.TEXT, field: 'Color Code'},
	weight: { type: Sequelize.TEXT, field: 'Weight'},
	domain: { type: Sequelize.TEXT, field: 'Domain'},
	prodDetailImage: { type: Sequelize.TEXT, field: 'ProdDetail Image'},
	prodGalleryImage: { type: Sequelize.TEXT, field: 'ProdGallery Image'},
	retailPrice: { type: Sequelize.TEXT, field: 'Retail Price'},
	styleNumber: { type: Sequelize.TEXT, field: 'Style Number'},
	gTINNumber: { type: Sequelize.TEXT, field: 'GTIN Number'},
	maxInventory: { type: Sequelize.TEXT, field: 'Max Inventory'},
	closeout: { type: Sequelize.TEXT, field: 'Closeout'},
	millName: { type: Sequelize.TEXT, field: 'Mill Name'},
	packQty: { type: Sequelize.TEXT, field: 'Pack Qty'},
	caseQty: { type: Sequelize.TEXT, field: 'Case Qty'},
	launchDate: { type: Sequelize.TEXT, field: 'Launch Date'},
	comingSoon: { type: Sequelize.TEXT, field: 'Coming Soon'},
	frontofImageName: { type: Sequelize.TEXT, field: 'Front of Image Name'},
	backofImageName: { type: Sequelize.TEXT, field: 'Back of Image Name'},
	sideofImageName: { type: Sequelize.TEXT, field: 'Side of Image Name'},
	pMSCode: { type: Sequelize.TEXT, field: 'PMS Code'},
	sizeSortOrder: { type: Sequelize.TEXT, field: 'Size Sort Order'}
});
// Item.sync();

// Style.findOne().then(style => {
//   console.log('a style:',JSON.stringify(style));
// });

app.get('/api/vendor_goods/styles', cors(corsOptions), function (req, res){
  Style.aggregate('Category Name', 'DISTINCT', { plain: false })
	.map(function (row) { return row.DISTINCT })
	.then(function (data) { res.json({data: data}) })
	.catch(function (err) { res.status(500).send(err) });
});

app.get('/api/vendor_goods/style/:categoryName', cors(corsOptions), function (req, res){
	Style.findAll({
	  where: {
	    categoryName: req.params['categoryName']
	  },
	  order: [[sequelize.cast(sequelize.col('styles.Popularity'), 'integer'), 'DESC']]
	})
	.then(function (data) { res.json({data: data}) })
	.catch(function (err) { res.status(500).send(err) });
});

app.get('/api/vendor_goods/items/:styleCode', cors(corsOptions), function (req, res){
	Item.findAll({
	  where: {
	    styleCode: req.params['styleCode']
	  }
	})
	.then(function (data) { res.json({data: data}) })
	.catch(function (err) { res.status(500).send(err) });
});


const ngProxy = proxy('http://localhost:4200', {
    forwardPath: req => url.parse(req.url).path
});

app.use("/*", ngProxy);

//boot.
app.listen(process.env.ADMIN_PORT || 8091);
console.log('listening on http://localhost:',process.env.ADMIN_PORT || 8091);
