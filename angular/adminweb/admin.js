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
require('dotenv').config({path: '../.env'});

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
  	'http://localhost:4200',
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


const sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@pg:5432/${process.env.POSTGRES_DB}`, { 
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

const Catalog = sequelize.define('catalogs', {
  name: { type: Sequelize.STRING },
  'Style Code': {
   type: Sequelize.STRING,
   references: {
     model: Style,
     key: 'Style Code'
   }
 }
});
// Catalog.hasOne(Style); //, {foreignKey: 'Style Code'} 
Catalog.belongsTo(Style, {foreignKey: 'Style Code'}); //
Catalog.sync()


app.get('/api/vendor_goods/styles/:catalog', cors(corsOptions), function (req, res){
	if(req.params['catalog'] && req.params['catalog'] != 'default'){
		Catalog.findAll({
			where: {
				name: req.params['catalog']
			}
		})
		.then(function (catalogz) { 
			Style.findAndCountAll({
				where: {
					'Style Code': {
						[Sequelize.Op.in]: catalogz.map( c => c['Style Code'])
					}
				},
			  attributes: [
			    'categoryName'
			  ],
			  group: 'Category Name'
			})
			.then(function (data) { 
				res.json({
					data: data.count
						.map(function(v,i) {return {categoryName: data.rows[i]["categoryName"], count: v["count"] } })
						
				}); 
			})
			.catch(function (err) { 
				console.log('style err:',err);
				res.status(500).send(err) });

		})
		.catch(function (err) { console.log('catalog err:',err);res.status(500).send(err) });
	}else{
		Style.findAndCountAll({
		  attributes: [
		    'categoryName'
		  ],
		  group: 'Category Name'
		})
		.then(function (data) { 
			res.json({
				data: data.count
					.map(function(v,i) {return {categoryName: data.rows[i]["categoryName"], count: v["count"] } })
					
			}) 
		})
		.catch(function (err) { res.status(500).send(err) });
	}
});

app.get('/api/vendor_goods/style/:catalog/:categoryName', cors(corsOptions), function (req, res){
	if(req.params['catalog'] != 'default'){
		Catalog.findAll({
				where: {
					name: req.params['catalog']
				}
			})
			.then(function (catalogz) { 
				console.log('catalogz:',catalogz.map( c => c['Style Code']));
				Style.findAll({
					where: {
						'Style Code': {
							[Sequelize.Op.in]: catalogz.map( c => c['Style Code'])
						},
						categoryName: req.params['categoryName']
					},
				  order: [[sequelize.cast(sequelize.col('styles.Popularity'), 'integer'), 'ASC']]
				})
				.then(function (data) { res.json({data: data}) })
				.catch(function (err) { res.status(500).send(err) });

			})
			.catch(function (err) { console.log('catalog err:',err);res.status(500).send(err) });
	}else{
		Style.findAll({
		  where: {
		    categoryName: req.params['categoryName']
		  },
		  order: [[sequelize.cast(sequelize.col('styles.Popularity'), 'integer'), 'ASC']]
		})
		.then(function (data) { res.json({data: data}) })
		.catch(function (err) { res.status(500).send(err) });
	}
});

app.get('/api/vendor_goods/items/:styleNumber', cors(corsOptions), function (req, res){
	Item.findAll({
	  where: {
	    styleNumber: req.params['styleNumber']
	  }
	})
	.then(function (data) { res.json({data: data}) })
	.catch(function (err) { res.status(500).send(err) });
});


app.get('/api/vendor_goods/catalogs', cors(corsOptions), function(req, res){
	Catalog.findAll({
		attributes: [
	    'name'
	  ],
	  group: 'name'
	})
	.then(function (data) { res.json({data: data}) })
	.catch(function (err) { res.status(500).send(err) });
});

app.get('/api/vendor_goods/catalog/:name', cors(corsOptions), function(req, res){
	if(req.params['name'] && req.params['name'] != 'default'){
		Catalog.findAll({
			where: {
				name: req.params['name']
			},
			include: [
		    { model: Style }
		  ]
		})
		.then(function (data) { res.json({data: data}) })
		.catch(function (err) { res.status(500).send(err) });
	}else{
		Style.findAll({
		  order: [
		  	'Category Name'
		  	,[sequelize.cast(sequelize.col('styles.Popularity'), 'integer'), 'ASC']
		  ]
		})
		.map( s => [{name: 'defualt', 'Style Code': s.styleCode, style: s}][0])
		.then(function (data) { res.json({data: data}) })
		.catch(function (err) { res.status(500).send(err) });
	}
});

app.post('/api/vendor_goods/catalog', cors(corsOptions), function(req, res){
	if( req.body 
		&& req.body.name
		&& req.body.styles
		&&req.headers.cookie 
		&& req.headers.cookie.match(/AuthSession=[A-z0-9]+/)
	){
		console.log('req cookie:',req.headers.cookie.match(/AuthSession=[A-z0-9]+/)[0]);
		
		let j = request.jar();
		var url = 'http://localhost:5984/_session';
		j.setCookie(request.cookie(req.headers.cookie.match(/AuthSession=[A-z0-9]+/)[0]), url);
		
		request({url: url, jar: j}, function (error, response, body) {
		  if(error){
		  	console.log('error:', error); // Print the error if one occurred
		  	res.status(500);
		  }else{
		  	body = JSON.parse(body);
			  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			  console.log('body:', body); // Print the HTML for the Google homepage.
			  if(body["userCtx"]["name"] != '' 
			  	&& body["userCtx"]["roles"] 
			  	&& body["userCtx"]["roles"].includes("_admin")
			  ){
			  	console.log('neat, admin user... do admin stuff now...');

			  	for(let style of req.body.styles){
						Catalog.create({
							name: req.body.name,
							'Style Code': style
						});
					}

			  	res.status(200);
			  }else{
			  	res.status(500);
			  }
		  }
		});
	}else{
		res.status(500);
	}
});


const ngProxy = proxy('http://localhost:4201', {
    forwardPath: req => url.parse(req.url).path
});

app.use("/*", ngProxy);

//boot.
app.listen(process.env.ADMIN_PORT || 8091);
console.log('pg_user',process.env.POSTGRES_USER);
console.log('listening on http://localhost:',process.env.ADMIN_PORT || 8091);
