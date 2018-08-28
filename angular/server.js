// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PouchDB = require('pouchdb');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request-promise');
const crypto = require('crypto');
const Handlebars = require('handlebars');
const imagemagick = require('imagemagick');
const fs = require('fs');
const multer = require('multer'); 
let filenameID = crypto.randomBytes(6).toString('hex');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/opt/rebelcricket/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, filenameID + '_' + file.originalname);
  }
});
const fileFilter = function fileFilter (req, file, cb) {
  if(file.mimetype.match(/image\//) 
    || file.mimetype.match(/application\/postscript/)
    || file.mimetype.match(/application\/pdf/)
  ){
    cb(null, true);
  }else{
    cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files', 11);

//check how full the disk is every five min and set bool var that will disable uploadz
let diskFull = false;
const util  = require('util'),
      spawn = require('child_process').spawn;
const checkFree = function(){
  try{
    free = spawn('sh', ['-c', 'df -h uploads/ | tail -1 | awk \'{print $5}\'']);
    free.stdout.on('data', function (data) {
      diskFull = parseInt(data) > 90;
    });
  }catch(e){ 
    //hmm :/
    checkInterval(checkInterval);
  }
}
checkFree();
const checkInterval = setInterval(checkFree, 500000);

app.use(bodyParser.json()); // for parsing application/json

const corsOptions = {
  origin: [ 
    'http://localhost',
    'https://rebelcricket.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.static(__dirname + '/dist'));
app.use('/uploads', express.static('/opt/rebelcricket/uploads'));

/* 
 * express routez 
 */

app.options('*', cors(corsOptions)) // cors for all options pre-flight requests

app.get('/uploads/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/uploads/default-image-square.jpg'));
});

app.post('/quote', cors(corsOptions), function(req, res){

  if(req.body.order){
    let order = req.body.order;
    if(order._id 
      && parseInt(order._id, 36) > 1524981538689 //4-29-2018  1524981538689
      && parseInt(order._id, 36) < 1840601036000 //10 yearz later
      && order.name && order.name != ''
      && order.email && order.email != '' ){
      



      try{
        delete order._rev;
        delete order._rev_tree;
      }catch(e){ }
      
      sendMail(order);

      order.status = 'new';
      order.submitted = true;
      order.confirmation = Date.now();

      orders.get(order._id).then( _order => {
        order._rev = _order._rev;

        let idUpdated = false;
        if(  _order.status != 'new' 
          && _order.status != 'quote' 
          && _order.status != 'Inbox'
        ){
          //create a new order.
          idUpdated = true;
          order._id = Date.now().toString(36);
          delete order._rev;
        }

        orders.put(order).then( response => {
          if(response.ok){
            res.json({ok: true});
          }else{
            res.status(500).json({ok: false});
          }
        }).catch( err => {
          res.status(500).json({ok: false, idUpdated: idUpdated, err: err});
        });

      }).catch( err => {
        order.auth_key = crypto.randomBytes(16).toString('hex');
        orders.put(order).then( response => {
          if(response.ok){
            res.json({ok: true});
          }else{
            res.status(500).json({ok: false});
          }
        }).catch( err => {
          res.status(500).json({ok: false, hmm: 'notget', err: err});
        });
      });

    }else{
      res.status(500).json({ok: false, valid: false});
    }
  }else{
    res.status(500).json({ok: false});
  }
});

app.post('/upload', cors(corsOptions), function (req, res){
  if(!diskFull){
    filenameID = crypto.randomBytes(6).toString('hex');
    upload(req, res, function (err) {
      // process.stdout.write 
      if (err) {
        // An error occurred when uploading
        res.status(500).send(err);
      }else{
        let outfiles = [];
        for(const file of req.files){
          let outf = {name: file.originalname, original: file.filename, thumb: file.filename.replace(path.extname(file.filename), '.jpg')}
          imagemagick.convert([file.path, '-resize', '400x400', 'jpg:-'], (err, stdout, stderr) => {
            if (!err){
              fs.writeFileSync(file.path.replace(path.extname(file.filename), '.jpg'), stdout, 'binary');
            }
          });
          outfiles.push(outf);
        }

        uploads.put({_id: filenameID, date: Date.now(), files: outfiles });
        
        res.json({
          ok: true,
          filenameID: filenameID,
          date: Date.now(),
          files: outfiles
        });
      }
    });
  }else{
    res.status(500).send('Not accepting uploads!');
  }
});

//registration for non-admin user filling out a quote:
// app.post('/auth/session', cors(corsOptions), function(req, res){
//   const auth_user = crypto.randomBytes(6).toString('hex');
//   const auth_key = crypto.randomBytes(64).toString('hex');
//   const registration = {
//     "_id": `org.couchdb.user:${auth_user}`,
//     "name": auth_user,
//     "type": "user",
//     "roles": ["rebelcricket"],
//     "password": auth_key
//   }
//   _users.put(registration).then(function (response) {
//     res.json({
//       auth_user: auth_user,
//       auth_key: auth_key
//     });
//   }).catch(function (err) {
//     res.json(err);
//   });
// });

// registration currently disabled.
// app.post('/auth/register', cors(corsOptions), function(req, res){
//   _users.put(req.body).then(function (response) {
//     res.json(response);
//   }).catch(function (err) {
//     res.json(err);
//   });
// });

//redirect everything (else) to angular (index.html)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

//boot.
app.listen(process.env.PORT || 8090);

/* 
 * couch-related utilz
 * init db & set user rolez, user listener & replication stuffz.
 */

// let active_tasks = [];
// const _replicator = new PouchDB(`${process.env.COUCH_HOST}/_replicator`)
// const _users = new PouchDB(`${process.env.COUCH_HOST}/_users`);
const orders = new PouchDB(`${process.env.COUCH_HOST}/orders`);
const settings = new PouchDB(`${process.env.COUCH_HOST}/settings`);
const privatesettings = new PouchDB(`${process.env.COUCH_HOST}/privatesettings`);
const uploads = new PouchDB(`${process.env.COUCH_HOST}/uploads`);
const vendor_goods = new PouchDB(`${process.env.COUCH_HOST}/vendor_goods`);
//give some time (~10s) for couchdb to init. then scan all the users for json users list
// & set roles so admin user can access user's docz 
setTimeout( () => {

  request({
    method: 'GET',
    uri: `${process.env.COUCH_HOST}/_active_tasks`
  }).then( tasks => {
    _active_tasks = JSON.parse(tasks);
  });

  // _replicator.allDocs({include_docs: true}).then( tasks => {
  //   active_tasks = tasks.rows.map(row => { return {source: row.doc.source, target: row.doc.target}});
  // });

  //make sure app dbz are setup correctly
  //doc.admins.names for admin-write public-read
  vendor_goods.get('_security').then(function (doc) {
    doc.admins = doc.admins || {};
    doc.admins.names = doc.admins.names || [];
    if(doc.admins.names.indexOf('rebelcricket-admin') == -1){
      doc.admins.names.push('rebelcricket-admin');
      //using regular HTTP here since pouchdb doesn't seem to be able to put _security doc
      request({
        method: 'PUT',
        uri: `${process.env.COUCH_HOST}/settings/_security`,
        json: doc
      });
    }
  });
  settings.get('_security').then(function (doc) {
    doc.admins = doc.admins || {};
    doc.admins.names = doc.admins.names || [];
    if(doc.admins.names.indexOf('rebelcricket-admin') == -1){
      doc.admins.names.push('rebelcricket-admin');
      //using regular HTTP here since pouchdb doesn't seem to be able to put _security doc
      request({
        method: 'PUT',
        uri: `${process.env.COUCH_HOST}/settings/_security`,
        json: doc
      });
    }
  });

  //doc.members.names for admin-only (no public read/write)
  orders.get('_security').then(function (doc) {
    let needsPut = false;
    doc.admins = doc.admins || {};
    doc.admins.names = doc.admins.names || [];
    if(doc.admins.names.indexOf('rebelcricket-admin') == -1){
      doc.admins.names.push('rebelcricket-admin');
      needsPut = true;
    }
    doc.members = doc.members || {};
    doc.members.names = doc.members.names || [];
    if(doc.members.names.indexOf('rebelcricket-admin') == -1){
      doc.members.names.push('rebelcricket-admin');
      needsPut = true;
    }
    if(needsPut){
      //using regular HTTP here since pouchdb doesn't seem to be able to put _security doc
      request({
        method: 'PUT',
        uri: `${process.env.COUCH_HOST}/orders/_security`,
        json: doc
      });
    }
  });
  privatesettings.get('_security').then(function (doc) {
    let needsPut = false;
    doc.admins = doc.admins || {};
    doc.admins.names = doc.admins.names || [];
    if(doc.admins.names.indexOf('rebelcricket-admin') == -1){
      doc.admins.names.push('rebelcricket-admin');
      needsPut = true;
    }
    doc.members = doc.members || {};
    doc.members.names = doc.members.names || [];
    if(doc.members.names.indexOf('rebelcricket-admin') == -1){
      doc.members.names.push('rebelcricket-admin');
      needsPut = true;
    }
    if(needsPut){
      //using regular HTTP here since pouchdb doesn't seem to be able to put _security doc
      request({
        method: 'PUT',
        uri: `${process.env.COUCH_HOST}/privatesettings/_security`,
        json: doc
      });
    }
  });
  uploads.get('_security').then(function (doc) {
    let needsPut = false;
    doc.admins = doc.admins || {};
    doc.admins.names = doc.admins.names || [];
    if(doc.admins.names.indexOf('rebelcricket-admin') == -1){
      doc.admins.names.push('rebelcricket-admin');
      needsPut = true;
    }
    doc.members = doc.members || {};
    doc.members.names = doc.members.names || [];
    if(doc.members.names.indexOf('rebelcricket-admin') == -1){
      doc.members.names.push('rebelcricket-admin');
      needsPut = true;
    }
    if(needsPut){
      //using regular HTTP here since pouchdb doesn't seem to be able to put _security doc
      request({
        method: 'PUT',
        uri: `${process.env.COUCH_HOST}/uploads/_security`,
        json: doc
      });
    }
  });


  //check all the current users to make sure their roles are set correctly.
  // _users.allDocs({
  //   include_docs: true
  // }).then(function (result) {
  //   for(i=0; i < result.total_rows; i++){
  //     if( result.rows[i].id.match(/org\.couchdb\.user:/) 
  //         && result.rows[i].doc
  //         && result.rows[i].doc.roles 
  //         && result.rows[i].doc.roles.indexOf('rebelcricket') > -1
  //     ){
  //       let name = result.rows[i].id.split(/org\.couchdb\.user:/).join('');
  //       let user = { 
  //         id: result.rows[i].id, 
  //         name: name, 
  //         db: `userdb-${Buffer.from(name, 'utf8').toString('hex')}` 
  //       };
  //       setupReplication(user);
  //       setUserDBRoles(user);
  //     }
  //   }
  // });

  //listen for changes on the users db (e.g. registrations) and add to users list (json) 
  // & set roles so admin can view docz...
  // const changes = _users.changes({
  //   since: 'now',
  //   live: true,
  //   include_docs: false
  // }).on('change', function(change) {
  //   if(change.id && change.id.match(/org\.couchdb\.user:/)){
  //     let _user = _users.get(change.id).then(function(doc){
  //       if(doc.roles && doc.roles.indexOf('rebelcricket') > -1){
  //         let name = change.id.split(/org\.couchdb\.user:/).join('');
  //         let user = { id: change.id, name: name, db: `userdb-${Buffer.from(name, 'utf8').toString('hex')}` };
  //         if(!change.deleted){ 
  //           setupReplication(user);
  //           setUserDBRoles(user);
  //         }
  //       }
  //     });
  //   }
  // });

  //watch for changes to the uploads db and remove files when needed.
  const uploadChanges = uploads.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function(change) {
    if(change.deleted){
      //#todo: figure out what file(z) to remove to fs
      //fs.unlink
      fs.readdir('/opt/rebelcricket/uploads/', (err, files) => {
        files.forEach(file => {
          // console.log(file);
          if(file.match(change.id)){
            fs.unlink(`/opt/rebelcricket/uploads/${file}`, (err) => {
              if (err){ console.log('["log", "error deleting: '+file+' err: '+err+'", {"level": "error"}]\n'); }
            });
          }
        });
      });
    }
  });

},10000);

//one-way replication for every user's db to admin's orders DB
// function setupReplication(user){
//   if(!_active_tasks.find( task => {return task.source.match(user.db) })){
//     request({
//       method: 'POST',
//       uri: `${process.env.COUCH_HOST}/_replicator`,
//       json: {
//         "source": `${process.env.COUCH_HOST}/${user.db}`,
//         "target":  `${process.env.COUCH_HOST}/orders`,
//         "create_target":  false,
//         "continuous": true
//       }
//     });
//   }
// }

//set user's roles so that admin user can access their docz.
// function setUserDBRoles(user){
//   if(user.db){
//     let user_db = new PouchDB(`${process.env.COUCH_HOST}/${user.db}`);
//     user_db.get('_security').then(function (doc) {
//       doc.admins = doc.admins || {};
//       doc.admins.roles = doc.admins.roles || [];
//       if(doc.admins.roles.indexOf('rebelcricket-admin') == -1){
//         doc.admins.roles.push('rebelcricket-admin');
//         //using regular HTTP here since pouchdb doesn't seem to be able to put _users _security doc
//         request({
//           method: 'PUT',
//           uri: `${process.env.COUCH_HOST}/${user.db}/_security`,
//           json: doc
//         });
//       }
//     });
//   }
// }

function sendMail(order){
  const mailgun = require('mailgun-js')({ apiKey: process.env.MAIL_KEY, domain: process.env.MAIL_DOMAIN });
  const MailComposer = require('nodemailer/lib/mail-composer');

  const text_mail = `
  Date: {{created_at}}
  Name: {{name}}
  Email: {{email}}
  Phone: {{phone}}
  Notes: {{notes}}

  {{#base_order_fields}}
    {{#unless internal}}{{name}}: {{value}}{{/unless}}
  {{/base_order_fields}}


  Line Items:
  {{#line_items}}
    {{service_label}} 
    Quantity: {{quantity}}
    Notes: {{notes}}
    {{#items}}
      {{#unless internal}}{{name}}: {{value}}{{/unless}}
    {{/items}}
    {{#vendor_goods}}
      {{vendor_title}} ({{vendor_category}} {{vendor_sub_category}})
      {{#selected_items}}
        Color: {{color}}, Qty: {{qty_total}}
      {{/selected_items}}
    {{/vendor_goods}}
  {{/line_items}}

  Graphics:
  {{#attachments}}
    {{#files}}
      {{name}} https://rebelcricket.com/uploads/{{thumb}}
    {{/files}}
  {{/attachments}}

  {{#each canvasLayerColors}}
      {{@key}} colors: {{this}}
  {{/each}}
  `;
  //<img src="{{process.env.NG_HOST}}/uploads/{{thumb}}" alt="{{name}}" border="0" />
  const template = Handlebars.compile(text_mail);

  var mailOptions = {
    from: 'Rebel Cricket Screen Prints <rebelcricket@gmail.com>',
    to: 'rebelcricket@gmail.com',
    subject: `Quote Request ${order.email}`,
    // text: template(order),
    html: template(order)
  };
   
  var mail = new MailComposer(mailOptions);
   
  mail.compile().build((err, message) => {
   
      var dataToSend = {
          from: 'Rebel Cricket Screen Prints <rebelcricket@gmail.com>',
          to: 'rebelcricket@gmail.com',
          subject: `Quote Request ${order.email}`,
          message: message.toString('ascii')
      };
   
      mailgun.messages().sendMime(dataToSend, (sendError, body) => {
          if (sendError) {
            console.log('["log", "mail send error!: '+sendError+'", {"level": "error"}]\n');
            return;
          }
      });
  });
}
