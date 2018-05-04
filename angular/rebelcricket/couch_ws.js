const socketPouchServer = require('socket-pouch/server');
const httpProxy = require('http-proxy');
const express = require('express');
const app = express();

app.get('/_up', function(req, res) {
  res.send('ok');
});

const webProxy = httpProxy.createProxyServer({ target: 'http://localhost:8080' });
app.get('/*', function(req, res){
    webProxy.web(req, res);
});
app.post('/*', function(req, res){
    webProxy.web(req, res);
});

socketPouchServer.listen(8080, {
  remoteUrl: 'http://localhost:5984',
  socketOptions: {origins: [ 
    'http://localhost:8080', 
    'http://localhost:8090']}
});

const proxy = httpProxy.createProxyServer({ target: 'http://localhost:8080', ws: true });
const server = require('http').createServer(app);
server.on('upgrade', function (req, socket, head) {
  console.log("proxying upgrade request", req.url);
  proxy.ws(req, socket, head);
});

server.listen(8888);
