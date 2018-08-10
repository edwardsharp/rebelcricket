// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request-promise');
const crypto = require('crypto');

const imagemagick = require('imagemagick');
const fs = require('fs');
const multer = require('multer'); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // console.log('filename file:',file);
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const fileFilter = function fileFilter (req, file, cb) {
  // console.log('filefilter file.mimetype:',file.mimetype);
  if(file.mimetype.match(/image\//) 
    || file.mimetype.match(/application\/postscript/)
    || file.mimetype.match(/application\/pdf/)
  ){
    cb(null, true);
  }else{
    cb(null, false);
  }
}
// const upload = multer({ dest: '/opt/sched_admin/uploads/' }); // for parsing multipart/form-data
const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files', 11);

//check how full the disk is every five min and set bool var that will disable uploadz
let diskFull = false;
const util  = require('util'),
      spawn = require('child_process').spawn;
const checkFree = function(){
  try{
    free = spawn('sh', ['-c', 'df -h uploads/ | tail -1 | awk \'{print $5}\'']);
    free.stdout.on('data', function (data) {
      console.log('uploadz free: ' + parseInt(data));
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

app.use(express.static(__dirname + '/dist'));
app.use('/uploads', express.static('uploads'));
app.get('/uploads/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/uploads/default-image-square.jpg'));
});

const corsOptions = {
  origin: [ 
    'https://rebelcricket.com',
    'http://localhost:8080', 
    'http://localhost:8090'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.options('*', cors(corsOptions)) // cors for all options pre-flight requests

app.post('/upload', cors(corsOptions), function (req, res) {
  if(!diskFull){
    upload(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        return
      }else{
        let outfiles = [];
        for(const file of req.files){
          console.log('tryin to convert',file.path);
          let outf = {name: file.originalname, original: file.path, thumb: file.path.replace(path.extname(file.path), '.jpg')}
          imagemagick.convert([file.path, '-resize', '400x400', 'jpg:-'], (err, stdout, stderr) => {
            if (!err){
              fs.writeFileSync(outf.thumb, stdout, 'binary');
              console.log('renamed out:',outf.thumb);
            }
          });
          outfiles.push(outf);
        }
        
        res.json({
          ok: true,
          files: outfiles
        });
      }
    });
  }else{
    res.status(500).send('Not accepting uploads!');
  }
});

//redirect everything (else) to angular (index.html)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8090);

