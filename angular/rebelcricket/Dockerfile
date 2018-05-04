FROM couchdb:2.1.1

RUN apt-get update -y -qq && apt-get install -y --no-install-recommends apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get install -y --no-install-recommends \
    nodejs \
    imagemagick \
    ghostscript \
  && rm -rf /var/lib/apt/lists/*

ENV COUCH_HOST=http://localhost:5984

RUN mkdir /opt/couch_ws \
  && mkdir /opt/sched_admin \
  && mkdir /opt/sched_admin/dist \
  && mkdir /opt/sched_admin/uploads

VOLUME /opt/sched_admin/uploads

COPY uploads/default-image-square.jpg /opt/sched_admin/uploads/default-image-square.jpg

RUN chown -R couchdb /opt/sched_admin/uploads

COPY package_couch.json /opt/couch_ws/package.json
COPY couch_ws.js /opt/couch_ws
RUN cd /opt/couch_ws && npm i

COPY package_docker.json /opt/sched_admin/package.json
RUN cd /opt/sched_admin && npm i

COPY dist/ /opt/sched_admin/dist
COPY couch_ws.ini /opt/couchdb/etc/local.d/couch_ws.ini
COPY server.js /opt/sched_admin
