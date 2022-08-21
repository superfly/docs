---
title: Add a Bit of Splash
layout: framework_docs
order: 0
objective: Create a trivial application, provision and deploy it.
status: alpha
---

A newly generated Rails application will display a flashy splash screen when
run in development, but will do absolutely nothing in production until you
add add code.

In order to demonstrate deployment, we will create a new application, make
a one line change that shows the splash screen even when run in production mode,
and deploy it.

## Create an application

We start by verifying that you have Rails version 7 installed, and then by
creating a new application:

``` shell
$ rails --version
$ rails new list
$ cd list
```

Now use your favorite editor to make a one line change to `config/routes.rb`:

``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
 
   # Defines the root path route ("/")
-  # root "articles#index"
+  root "rails/welcome#index"
 end
 ```

 Now that we have an application that does something, albeit something trivial,
 let's deploy it.

## Provision Rails and Postgres Servers

To configure and launch the app, you can use `fly launch` and follow the wizard.
We are not going to use it yet, but say *yes* to setting up a Postgresql database
in order to prepare for the next step in this guide.

```cmd
fly launch
```
```output
Creating app in ~/list
Scanning source code
Detected a Rails app
? App Name (leave blank to use an auto-generated name): namelist
? Select organization: John Smith (personal)
? Select region: iad (Ashburn, Virginia (US))
Created app namelist in organization personal
Set secrets on namelist: RAILS_MASTER_KEY
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? Yes
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clusters
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster namelist-db in organization personal
Postgres cluster namelist-db created
  Username:    postgres
  Password:    <redacted>
  Hostname:    namelist-db.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place -- you won't be able to see them again!

Monitoring Deployment

1 desired, 1 placed, 1 healthy, 0 unhealthy [health checks: 3 total, 3 passing]
--> v0 deployed successfully

. . .

Now: run 'fly deploy' to deploy your Rails app.
```

You can set a name for the app, choose a default region, and choose to launch and attach a Postgresql database.

## Deploy your application

Deploying your application is done with the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully.  Once complete
visit your app with the following command:

```cmd
fly open 
```

That's it!  You are up and running!  Wasn't that easy?

Now proceed to [Scaffold to Success](/docs/rails/quick-start/scaffold/) to make
your application a bit more interesting.