FROM couchdb:2.1.1

RUN apt-get update -y -qq && apt-get install -y --no-install-recommends apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get install -y --no-install-recommends \
    nodejs \
    imagemagick \
    ghostscript \
  && rm -rf /var/lib/apt/lists/*

ENV COUCH_HOST=http://localhost:5984

RUN mkdir /opt/rebelcricket \
  && mkdir /opt/adminweb \
  && mkdir /opt/adminweb/dist \
  && mkdir /opt/rebelcricket/dist \
  && mkdir /opt/rebelcricket/uploads

COPY default-image-square.jpg /opt/rebelcricket/uploads/default-image-square.jpg

RUN chown -R couchdb /opt/rebelcricket/uploads

VOLUME /opt/rebelcricket/uploads

COPY package_docker.json /opt/rebelcricket/package.json
RUN cd /opt/rebelcricket && npm i
COPY rebelcricket/dist/ /opt/rebelcricket/dist
COPY server.js /opt/rebelcricket

COPY adminweb/package.json /opt/adminweb/package.json
RUN cd /opt/adminweb && npm i
COPY adminweb/dist/ /opt/adminweb/dist
COPY adminweb/admin_prod.js /opt/adminweb/admin.js

COPY rebelcricket.ini /opt/couchdb/etc/local.d/rebelcricket.ini