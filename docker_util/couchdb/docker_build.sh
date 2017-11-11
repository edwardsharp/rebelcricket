#!/bin/sh

docker build -t 3dwardsharp/rebelcricket .
docker run -p 5984:5984 -v $(pwd)/data:/opt/couchdb/data 3dwardsharp/rebelcricket

