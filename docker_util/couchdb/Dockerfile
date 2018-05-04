FROM couchdb:2.1.1

RUN apt-get update -y && apt-get install -y nodejs

COPY local.ini /opt/couchdb/etc/local.ini
RUN mkdir /aauth
COPY node-hello-world.js /aauth/node-hello-world.js
