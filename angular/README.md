# ADMIN

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

for electronjs:  
`ng build --base-href ./`  
`ng build --aot -prod --base-href ./`

electronjs release build:  
`./node_modules/.bin/electron-builder . -m`

for admin web:  
`ng build --aot --env=adminweb`

for rebelcricket web:  
`ng build --aot -prod`

Build artifacts will be stored in the `dist/` directory.

## certbot (letsencrypt)

in 3dwardsharp/nginx-certbot  
`certbot certonly --webroot --agree-tos --email edward@edwardsharp.net -w /var/www/letsencrypt -d couch.rebelcricket.com -d beta.rebelcricket.com --dry-run`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## deploying to heroku

to start (do this once):  
`heroku login`  
`heroku create`  
(probably need to do this a lot):  
`git push heroku master`

## Docker

`docker build -t 3dwardsharp/rebelcricket .`

dev:  

`docker-compose up`  
-or-  
`docker run -p 8080:80 -e NO_SSL=true -e COUCHDB_USER=rebelcricket-admin -e COUCHDB_PASSWORD=zomgzomg -e COUCH_HOST=http://rebelcricket-admin:zomgzomg@localhost:5984 3dwardsharp/rebelcricket`

#### use nginx proxy: 

setup a `.env` file with something like:

```
NO_SSL=true #don't redirect to ssl in dev mode
COUCHDB_USER=admin 
COUCHDB_PASSWORD=zomgzomg 
COUCH_HOST=http://admin:zomgzomg@localhost:5984
MAIL_KEY=key-12345666
MAIL_DOMAIN=somedomain.mailgun.org
NG_HOST=http://beta.rebelcricket.com
```

add persistant volume storage in docker-compose.yml (if you'd like)

`docker-compose up` 