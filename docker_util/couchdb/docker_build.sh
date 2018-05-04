#!/bin/sh

docker build -t 3dwardsharp/couch_auth .
docker run -p 5984:5984 -v $(pwd)/data:/opt/couchdb/data 3dwardsharp/couch_auth
