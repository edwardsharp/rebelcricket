#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//two line hashbang, ugh, gd nodejs binary.. 

var http = require('http');
var sys = require('sys');

// Send a log message to be included in CouchDB's
// log files.

var log = function(mesg) {
    console.log(JSON.stringify(["log", mesg]));
}

// The Node.js example HTTP server

var server = http.createServer(function (req, resp) {
    resp.writeHead(200, {'Content-Type': 'text/plain'});
    resp.end('Hello World\n');
    log(req.method + " " + req.url);
})

// We use stdin in a couple ways. First, we
// listen for data that will be the requested
// port information. We also listen for it
// to close which indicates that CouchDB has
// exited and that means its time for us to
// exit as well.

var stdin = process.openStdin();

stdin.on('data', function(d) {
    server.listen(parseInt(JSON.parse(d)));
});

stdin.on('end', function () {
    process.exit(0);
});

// Send the request for the port to listen on.

console.log(JSON.stringify(["get", "node_hello", "port"]));
