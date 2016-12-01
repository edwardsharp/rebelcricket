FROM ruby:2.3.0
MAINTAINER edward@edwardsharp.net

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y nodejs nginx libpq-dev postgresql-server-dev-9.4 vim

EXPOSE 8080

ENV RACK_ENV production 
ENV RAILS_ENV production
ENV NOKOGIRI_USE_SYSTEM_LIBRARIES 1

RUN mkdir /rebelcricket

WORKDIR /rebelcricket

COPY rails-rebelcricket/rebelcricket/Gemfile /rebelcricket/Gemfile

RUN gem update bundler
RUN bundle --without development test

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf
RUN chown -R www-data:www-data /var/lib/nginx
ADD docker_util/rebelcricket/nginx-default.conf /etc/nginx/sites-enabled/default

COPY rails-rebelcricket/rebelcricket/ /rebelcricket
COPY polymer/rebelcricket/build/unbundled /rebelcricket/public
COPY docker_util/rebelcricket/start.sh /rebelcricket

#aarg, .dockerignore should do this...
RUN rm /rebelcricket/.env
RUN rm /rebelcricket/Gemfile.lock
RUN bundle --without development test

CMD ./start.sh

#docker build -f docker_util/rebelcricket/Dockerfile -t hub.sked.site:5000/rebelcricket .
#docker push hub.sked.site:5000/rebelcricket