#!/bin/sh

#ugh, 1.6 :(
#docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=rebelcricket -i couchdb

docker run -p 5984:5984 -v $(pwd)/data:/opt/couchdb/data klaemo/couchdb:2.0-single --admin=admin:rebelcricket
