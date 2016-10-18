# REBELCRICKET

### Setup

##### Prerequisites

Install [polymer-cli](https://github.com/Polymer/polymer-cli):
(Need at least npm v0.3.0)

    npm install -g polymer-cli


##### Setup
    # Using CLI
    mkdir shop
    cd shop
    polymer init shop
    
    # Or cloning direct from GitHub
    git clone https://github.com/Polymer/shop.git
    cd shop
    bower install

### Start the development server

    polymer serve

### Run web-component-tester tests

    polymer test

### Build

    polymer build

### Docker

    docker build -f docker_util/rebelcricket/Dockerfile -t hub.sked.site:5000/rebelcricket .
    docker push hub.sked.site:5000/rebelcricket
    cd docker_util/rebelcricket && docker-compose up
    
    # sysadmin
    bash -c "clear && docker exec -it rebelcricket_web_1 /bin/bash"

### Test the build

This command serves the minified version of the app in an unbundled state, as it would be served by a push-compatible server:

    polymer serve build/unbundled
    
This command serves the minified version of the app generated using fragment bundling:

    polymer serve build/bundled

    # -or use python-

    python -m SimpleHTTPServer 8000

    python3 -m http.server

