---
title: Getting Started
layout: framework_docs
order: 1
redirect_from: /docs/getting-started/rails/
subnav_glob: docs/rails/getting-started/*.html.*
objective: Quickly get a very basic Rails app up and running on Fly.io. This guide is the fastest way to try using Fly, so if you're short on time start here.
related_pages:
  - /docs/flyctl/
  - /docs/reference/configuration/
  - /docs/upstash/redis/
  - /docs/postgres/
  - /docs/tigris/
---

<div>
  <img src="/static/images/rails-intro.webp" srcset="/static/images/rails-intro@2x.webp 2x" alt="">
</div>

In this guide we'll develop and deploy a Rails application that first
demonstrates a trivial view.

In order to start working with Fly.io, you will need `flyctl`, our CLI app for managing apps. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/flyctl/install/). Once that's installed you'll want to [log in to Fly](/docs/getting-started/sign-up-sign-in/).

Once you have logged on, here are the three steps and a recap.

## Rails Splash Screen

A newly generated Rails application will display a flashy splash screen when
run in development, but will do absolutely nothing in production until you
add code.

In order to demonstrate deployment of a Rails app on fly, we will create a new application, make
a one line change that shows the splash screen even when run in production mode,
and deploy the application.

### Create an application

Start by verifying that you have Rails installed, and then by
creating a new application:

``` shell
$ rails --version
$ rails new welcome
$ cd welcome
```

Now use your favorite editor to make a one line change to `config/routes.rb`:

``` diff
 Rails.application.routes.draw do
  # Define your application routes per the DSL in
  # https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots
  # with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify
  # that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

   # Defines the root path route ("/")
-  # root "articles#index"
+  root "rails/welcome#index"
 end
 ```

 Now that we have an application that does something, albeit something trivial,
 let's deploy it.

### Launch

To configure and launch the app, you can use `fly launch` and follow the
wizard.  This demo does not need a database or redis.

```cmd
fly launch
```
```output
Scanning source code
Detected a Rails app
Creating app in ~/tmp/welcome
We're about to launch your Rails app on Fly.io. Here's what you're getting:

Organization: Jane Developer          (fly launch defaults to the personal org)
Name:         welcome-proud-sun-3423  (generated)
Region:       Ashburn, Virginia (US) (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM (most apps need about 1GB of RAM)
Postgres:     <none>                 (not requested)
Redis:        <none>                 (not requested)
Tigris:       <none>                 (not requested)

? Do you want to tweak these settings before proceeding? (y/N) 
```

For demo purposes you can accept the defaults.  You can always change these later.
So respond with "N" (or simply press enter).

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully. Once complete
visit your app with the following command:

```cmd
fly apps open
```

That's it!  You are up and running!  Wasn't that easy?

## Arrived at Destination

You have successfully built, deployed, and connected to your first Rails application on Fly.

We've accomplished a lot with only just one line of code and
just one command.

Now that you have seen it up and running, a few things are worth noting:

  * No changes were required to your application to get it to work.
  * Your application is running on a VM, which starts out based on a
    docker image. To make things easy, `fly launch` generates a
    `Dockerfile` and a `bin/docker-entrypoint` for you which you are free to modify.
  * As your application needs change, you can have us update your `Dockerfiles` for you by running: `bin/rails generate dockerfile`.
  * There is also a `config/dockerfile.yml` file which keeps track of your
    dockerfile generation options.  This is covered by the
    [FAQ](https://fly.io/docs/rails/getting-started/dockerfiles/).
  * Other files of note: `.dockerignore` and
    [`fly.toml`](https://fly.io/docs/reference/configuration/), both of which
    you can also modify.
    All five files should be checked into your git repository.
  * `fly dashboard` can be used to monitor and adjust your application. Pretty
    much anything you can do from the browser window you can also do from the
    command line using `fly` commands. Try `fly help` to see what you can do.
  * `fly ssh console` can be used to ssh into your VM. `fly console` can be used to open a rails console.

Now that you have seen how to deploy a trivial application, it is time
to move on to [The Basics](../../rails/the-basics/).
