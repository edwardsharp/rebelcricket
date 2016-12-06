== REBEL_README

rails api app for handling data storage, email, & other stuff for a polymer webapp. neat!

* Ruby version 

  2.3.0

* System dependencies

  postgres, bundler

* Configuration

  see Dockerfile

* Database creation
  
  $ rake db:create && rake db:migrate

* Database initialization

  $ rake db:seed

* How to run the test suite

  $ rspec 

* Services (job queues, cache servers, search engines, etc.)

  ...none yet

* Deployment instructions

  docker-compose up

* Misc:

  local https, use tunnels!  `rvmsudo tunnels 443 3000`

  docker build -f docker_util/rebelcricket/Dockerfile -t hub.sked.site:5000/rebelcricket .
  
  docker push hub.sked.site:5000/rebelcricket

  ApiKey.create!

  curl http://localhost:3000/api/pages -H 'Authorization: Token token="afbadb4ff8485c0adcba486b4ca90cc4"'


### Some tips on debugging ERB Templates

Convert the template to a ruby file
```sh
$ erb -x -T - file.erb > file.rb
```

Open the file.  At the bottom, you'll see:
```ruby
; _erbout
```

Add a puts in front of this, so instead of returning the output, it is displayed
```ruby
; puts _erbout
```

If there are variables out of scope that need to be referenced, add them to the top.  Now you can run the script directly and investigate the errors.
```sh
$ ruby file.rb
```

