---
title: Migrate from Heroku
layout: framework_docs
order: 2
status: beta
---

This guide runs you through how to migrate a basic Rails application off of Heroku and onto Fly. It assumes you're running the following services on Heroku:

* Puma web server
* Postgres database
* Redis in non-persistent mode
* Custom domain
* Background worker, like Sidekiq

If your application is running with more services, additional work may be needed to migrate your application off Heroku.

## Provision and deploy Rails app to Fly

From the root of the Rails app you're running on Heroku, run `fly launch` and select the options to provision a new Postgres database.

```cmd
fly launch
```
```output
Creating app in ~/my-rails-app
Scanning source code
Detected a Rails app
? Overwrite "~/my-rails-app/.dockerignore"? Yes
? App Name (leave blank to use an auto-generated name): my-rails-app
Automatically selected personal organization: Brad Gessler
? Select region: sjc (San Jose, California (US))
Created app my-rails-app in organization personal
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? Yes
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clusters
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster my-rails-app-db in organization personal
Postgres cluster my-rails-app-db created
  Username:    postgres
  Password:    <redacted>
  Hostname:    my-rails-app-db.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place -- you won't be able to see them again!

Monitoring Deployment

1 desired, 1 placed, 0 healthy, 0 unhealthy [health checks: 3 total, 2 passing, 1 critical]
```

After the application is provisioned, deploy it by running:

```cmd
fly deploy
```

When that's done, view your app in a browser:

```cmd
fly open
```

There's still work to be done to move more Heroku stuff over, so don't worry if the app doesn't boot right away. There's a few commands that you'll find useful to configure your environment:

* `fly logs` - Read error messages and stack traces emitted by your Rails application.
* `fly ssh console -C "/app/bin/rails console"` - Launches a Rails shell, which is useful to interactively test components of your Rails application.

## Transfer Heroku secrets

To see all of your Heroku env vars and secrets, run:

```cmd
heroku config -s | grep -v "DATABASE_URL" | fly secrets import
```

This command exports the Heroku secrets, excludes `DATABASE_URL` and `REDIS_URL`, and imports them into Fly.

Verify your Heroku secrets are in Fly.

```cmd
fly secrets list
NAME                          DIGEST                            CREATED AT
CANONICAL_HOST                9eda2d21fba2e77ac810c48eff63517e  1m25s ago
DATABASE_URL                  24e455edbfcf1247a642cdae30e14872  14m29s ago
GOOGLE_CLIENT_ID              245b1b58331c175049202a545d9d128e  1m22s ago
HEROKU_POSTGRESQL_BLUE_URL    9ff615b83c883ec662c65b4ec81e21ad  1m26s ago
HEROKU_POSTGRESQL_COBALT_URL  633968cb927c85eeda051935e82aa754  1m25s ago
IMAGEOMATIC_PUBLIC_KEY        e0d4a3b64271c773af9b8469696ddc69  1m22s ago
IMAGEOMATIC_SECRET_KEY        ee38a86b9dcb0dca08beeb71f0980156  1m22s ago
LANG                          95a7bb7a8d0ee402edde95bb78ef95c7  1m24s ago
RACK_ENV                      fd89784e59c72499525556f80289b2c7  1m26s ago
RAILS_ENV                     fd89784e59c72499525556f80289b2c7  1m26s ago
RAILS_LOG_TO_STDOUT           a10311459433adf322f2590a4987c423  1m25s ago
RAILS_SERVE_STATIC_FILES      a10311459433adf322f2590a4987c423  1m23s ago
REDIS_TLS_URL                 b30fe87493e14d9b670dc0263dc935c9  1m25s ago
REDIS_URL                     4583a46e747696319573e8bfbd0db04d  1m21s ago
ROLLBAR_ACCESS_TOKEN          549d72056847fac5059ec564e99043fb  1m22s ago
SECRET_KEY_BASE               5afb43c2ddbba6c02ffa7e2834689692  1m22s ago
SMTP_HOST                     132bf9caf4da0a0a8a445bf79fb2ca0f  1m21s ago
SMTP_PASSWORD                 14569e0c465d4af3744c257af8dacffb  1m28s ago
SMTP_USERNAME                 b22192724f4de33c7763253c9f4741b8  1m27s ago
STRIPE_PRIVATE_KEY            687117f5eed2e36f90dbcb9d30410732  1m23s ago
STRIPE_PUBLIC_KEY             5e9fc2e11e4ad7e623d4125aa09de46f  1m21s ago
STRIPE_SIGNING_SECRET         14c5efb2b758f8cea2a77c7963a971e4  1m21s ago
STRIPE_SUBSCRIPTION_PRICE     edaad046c9c293079ffa14ff59049c2e  1m23s ago
```

## Transfer the Database

<aside class="callout">
  Consider taking your Heroku application offline during this migration so you don't lose data during the transfer.
</aside>

Set the `HEROKU_DATABASE_URL` variable in your Fly environment.

```cmd
fly secrets set HEROKU_DATABASE_URL=$(heroku config:get DATABASE_URL)
```

Alright, lets start the transfer.

```cmd
pg_dump --no-owner -C -d $HEROKU_DATABASE_URL | psql -d $DATABASE_URL
```

After the database transfers unset the `HEROKU_DATABASE_URL` variable.

```cmd
fly secrets unset HEROKU_DATABASE_URL
```

Then launch your Heroku app to see if its running.

```
fly open
```

If you have a Redis server, there's a good chance you need to set that up.

## Provision a Redis server

Create a redis server by running:

```cmd
fly redis create
```

Select the size and configuration Redis server you'd like. When that command completes you should see a Redis URL. Copy the URL and set `REDIS_URL` in your applications secrets.

```cmd
fly secrets set REDIS_URL=redis://default:<redacted>@fly-my-rails-app-redis.upstash.io
```

Once that's done Fly will deploy the application with the new environment variable. Let's open Fly and see if everything is running:

```cmd
fly open
```

At this point, most Rails apps should boot since they depend on Redis and PostgresSQL. If you're stilling having problems run `fly logs` to view error messages and post your issues in the [Fly Community Forum](https://community.fly.io).

## Multiple processes & background workers

Heroku uses Procfiles to describe multi-process Rails applications. Fly describes multi-processes with the [`[processes]` directive](/docs/reference/configuration/#the-processes-section) in the `fly.toml` file.

If your Heroku `Procfile` looks like this:

```Procfile
web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq
```

Add the following to the `fly.toml`:

```toml
[processes]
web = "bundle exec puma -C config/puma.rb"
worker = "bundle exec sidekiq"
```

Then under the `[[services]]` directive, find the entry that maps to `internal_port = 8080`, and add `processes = ["web"]`. The configuration file should look something like this:

```toml
[[services]]
  processes = ["web"] # this service only applies to the web process
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []
```

This associates the process with the service that Fly launches. Save these changes and run the deploy command.

```cmd
fly deploy
```

You should see a `web` and `worker` process deploy.