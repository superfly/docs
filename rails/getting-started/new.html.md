---
title: Starter Rails App
layout: framework_docs
order: 1
redirect_from: /docs/getting-started/rails/
subnav_glob: docs/rails/getting-started/*.html.*
objective: Quickly get a very basic Rails blog up and running at Fly. This guide is the fastest way to try using Fly, so if you're short on time start here.
related_pages:
  - /docs/rails/the-basics
  - /docs/rails/the-basics/sidekiq
  - /docs/rails/the-basics/configuration
  - /docs/reference/redis
  - /docs/reference/postgres
---

In this guide we'll create a new Rails app from scratch and deploy it to Fly in as few steps as possible.

Before continuing, be sure you have a Ruby on Rails development environment configured on your machine with a PostgreSQL database, which we'll be using in production.

To keep this guide fast, we're going to skip a few things that are covered in [the basics](./the-basics) like setting up [Sidekiq workers](./the-basics/sidekiq), [Turbo Streams](./the-basics/turbo-streams-and-action-cable), and [configuring secrets and environment variables](./the-basics/configuration).


## Create a Rails App

Let's create a Rails blog for our first Fly app.

```cmd
rails new blog -d postgresql
```

This generates a bunch of Rails files that will be used for your application. The `-d` flag tells Rails that we're going to use Postrges for the database, which is what Fly currently recommends for production Rails apps.

When the command is finished, change into that directory:

```cmd
cd blog
```

Now lets create the database on your workstatation:

```cmd
bin/rails db:create
```

Then generate the blog scaffolding:

```cmd
bin/rails generate scaffold Post title:string body:text
```

The scaffolding creates a database migration. Run the following command to create the `posts` table in your local Postgres database:

```cmd
bin/rails db:create
```

Once that's complete, open the `config/routes.rb` file and add `root "posts#index"` so that it looks like this:

```ruby
Rails.application.routes.draw do
  resources :posts
  root "posts#index"
end
```

Congrats! You now have a very basic Blog. Let's deploy it to production.

<%= partial "docs/getting-started/partials/install_flyctl_login" %>

## Provision Rails and Postgres Servers

To configure and launch the app, you can use `fly launch` and follow the wizard:

```cmd
fly launch
```
```output
Creating app in ~/Projects/blog
Scanning source code
Detected a Rails app
? App Name (leave blank to use an auto-generated name): blog
Automatically selected personal organization: John Smith
? Select region: sjc (San Jose, California (US))
Created app blog in organization personal
Set secrets on blog: RAILS_MASTER_KEY
Wrote config file fly.toml
? Would you like to setup a Postgresql database now? Yes
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clusters
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster blog-db in organization personal
Postgres cluster blog-db created
  Username:    postgres
  Password:    <redacted>
  Hostname:    blog-db.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place, you won't be able to see them again!
```

You can set a name for the app, choose a default region, and choose to launch and attach a Postgresql database.

Deploying your application is done with the following command:

```cmd
fly deploy
```

Once it's done, you can use `fly status` to check the app's status and deployment, and you should see something like this:

```cmd
fly status
```
```output
App
  Name     = blog
  Owner    = personal
  Version  = 0
  Status   = running
  Hostname = blog.fly.dev

Deployment Status
  ID          = c3ca80bf-4034-837a-ce92-682e6528c5c7
  Version     = v0
  Status      = successful
  Description = Deployment completed successfully
  Instances   = 1 desired, 1 placed, 1 healthy, 0 unhealthy

Instances
ID        PROCESS VERSION REGION  DESIRED STATUS  HEALTH CHECKS       RESTARTS  CREATED
748868bc  app     0       lhr     run     running 1 total, 1 passing  0         20s ago
```

If you elected to provision a Postgres database during setup, it's deployed as a seperate Fly app to `blog-db`.

That's it! Run `fly open` to see your deployed app in action.

```cmd
fly open
```

## Next steps


At this point you now have a basic Rails application running that points at a Postgres database, but most Rails applications need more then that like access to a Redis database for caching and background workers. Read through [the basics](/docs/rails/the-basics) to setup the remainder of your Rails application.
