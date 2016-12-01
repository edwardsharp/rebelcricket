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

  ApiKey.create!

  curl http://localhost:3000/api/pages -H 'Authorization: Token token="afbadb4ff8485c0adcba486b4ca90cc4"'

