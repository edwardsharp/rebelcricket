#!/bin/sh

unicorn -c /rebelcricket/unicorn.rb -E production -D 
/usr/sbin/nginx -c /etc/nginx/nginx.conf
