---
title: Migrate from Heroku to Fly
layout: framework_docs
order: 1
status: alpha
---

This guide runs you through how to migrate a basic Rails application off of Heroku and onto Fly. It assumes you're running the following services on Heroku:

* Puma web server
* Postgres database
* Redis in non-persistent mode
* Custom domain
* Background worker like Sidekiq

If your application is running with more services, additional work may be needed to migrate your application off Heroku.

## Provision Fly application

Run `fly launch` and select the options to create a new Postgres database and Redis server.

## Deploy application to Fly

It won't run yet, but go ahead and deploy it.

## Transfer Heroku secrets

To see all of your Heroku env vars and secrets, run:

```cmd
heroku config
```

## Transfer the Database

<aside class="callout">
  Consider taking your Heroku application offline during this migration so you don't lose data during the transfer.
</aside>

https://community.fly.io/t/migrating-from-heroku-postgres-to-fly-postgres-a-complete-guide/4262