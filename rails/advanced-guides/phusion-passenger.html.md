---
title: Phusion Passenger
layout: framework_docs
objective: This guide shows you how to replace the Puma web server with nginx and Phusion Passenger.
status: beta
---

This guide shows you how to replace the Puma web server which runs your
Rails application with
[nginx](https://www.nginx.com/) and [Phusion
Passenger](https://www.phusionpassenger.com/).  This may be useful if you need
functionality that nginx and/or Passenger provide, such as reverse
proxying or hosting multiple applications.

## Replacing the Dockerfile

When you previously ran `fly launch` you were provided with a Dockerfile
that was used to package your application.  This Dockerfile provided
reasonable defaults. One of those defaults was to choose the Puma web server.
This is the same default that Rails provides for new applications.

This Dockerfile can be customized or replaced to meet your needs.  This
guide will show you how to replace the Dockerfile with one that chooses
Phusion Passenger.  The new Dockerfile will make use of the
[phusion/passenger-full](https://github.com/phusion/passenger-docker#docker-base-images-for-ruby-python-nodejs-and-meteor-web-apps) image.

To get started, replace your Dockerfile with the following:

```
FROM phusion/passenger-full:2.3.0
RUN rm -f /etc/service/nginx/down
RUN rm -f /etc/service/redis/down

RUN rm /etc/nginx/sites-enabled/default
ADD config/fly/rails.conf /etc/nginx/sites-enabled/rails.conf
ADD config/fly/envvars.conf /etc/nginx/main.d/envvars.conf

ADD config/fly/mkswap.sh /etc/my_init.d/95-mkswap.sh
RUN chmod +x /etc/my_init.d/95-mkswap.sh

ENV RAILS_LOG_TO_STDOUT true

ARG BUNDLE_WITHOUT=development:test
ENV BUNDLE_WITHOUT ${BUNDLE_WITHOUT}

RUN mkdir /app
WORKDIR /app
RUN mkdir -p tmp/pids

COPY Gemfile* ./
RUN bundle install

ENV SECRET_KEY_BASE 1

COPY . .

RUN bundle exec rails assets:precompile

CMD ["/sbin/my_init"]
```

As promised, the passenger-full image that the Phusion team provides
makes your Dockerfile considerably smaller, but there remains more work to
be done as you still need to configure nginx.  We do that next.

## Configuring nginx

The Dockerfile above contains three `ADD` commands.  These copy configuration
files to the image.  The first two files configure ngix.  Place all three files
in a `config/fly` directory.

We start with `config/fly/rails.conf`:

```
server {
    listen 8080;
    server_name www.webapp.com;
    root /app/public;

    # The following deploys your Ruby/Python/Node.js/Meteor app on Passenger.

    # Not familiar with Passenger, and used (G)Unicorn/Thin/Puma/pure Node before?
    # Yes, this is all you need to deploy on Passenger! All the reverse proxying,
    # socket setup, process management, etc are all taken care automatically for
    # you! Learn more at https://www.phusionpassenger.com/.
    passenger_enabled on;
    passenger_user app;

    # If this is a Ruby app, specify a Ruby version:
    # For Ruby 3.1
    passenger_ruby /usr/bin/ruby3.1;
    # For Ruby 3.0
    # passenger_ruby /usr/bin/ruby3.0;
    # For Ruby 2.7
    # passenger_ruby /usr/bin/ruby2.7;
    # For Ruby 2.6
    # passenger_ruby /usr/bin/ruby2.6;

    # Nginx has a default limit of 1 MB for request bodies, which also applies
    # to file uploads. The following line enables uploads of up to 50 MB:
    client_max_body_size 50M;
}
```

The servername doesn't particularly matter, but you can set it to the name
of the machine your application will be deployed to.

The only real customization required is to select the version of Ruby desired.

Next we need to identify what environment variables will be used by the
application.  See the [passenger
documentation](https://github.com/phusion/passenger-docker#setting-environment-variables-in-nginx)
for more details.  We do that by placing the following into
`config/fly/envvars.conf`:

```
env DATABASE_URL;
env REDIS_URL;
env RAILS_LOG_TO_STDOUT;
```

The above are commonly used variables, feel free to adjust as you see fit.

## Making a swapfile

The Dockerfile provided by Phusion will create a swapfile when your application
is run in a container.  Fly uses your Dockerfile to build an image, but then
deploys that image to a VM, so while the commands necessary to build a
swapfile are there, they aren't executed on your VM.  We can execute them by
placing the following into `config/fly/mkswap.sh`:

```
#!/bin/sh
fallocate -l 512M /swapfile
chmod 0600 /swapfile
mkswap /swapfile
swapon /swapfile
exit 0
```

## Deployment

That's it.  As always you deploy your application via `fly deploy` and
can open it via `fly open`.  Everything else remains the same.  You
can use your same Postgre database, redis data store, and any other
secrets you may have set.

Both Puma and Passenger are excellent choices for application servers
for your Rails application, so you normally wouldn't have a need to
replace one with the other.  Further configuration likely is required
to unlock specific features of nginx or passenger for your particular
needs.  The above is only intended as an initial configuration to
get you started.  You have full control over what is installed on your
machine and how both nginx and passenger are configured.

The sky's the limit on what you can achieve with these instructions!
