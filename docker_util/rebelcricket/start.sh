#!/bin/sh

sleep 10

rake db:migrate && rake db:seed

foreman start
