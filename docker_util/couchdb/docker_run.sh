#!/bin/sh

docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=rebelcricket -i couchdb
