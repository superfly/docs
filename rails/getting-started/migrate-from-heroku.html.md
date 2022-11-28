---
title: Migrate from Heroku
layout: framework_docs
order: 2
---

This guide runs you through how to migrate a basic Rails application off of Heroku and onto Fly. It assumes you're running the following services on Heroku:

* Puma web server
* Postgres database
* Redis in non-persistent mode
* Custom domain
* Background worker, like Sidekiq

If your application is running with more services, additional work may be needed to migrate your application off Heroku.

## Migrating your app

The steps below run you through the process of migrating your Rails app from Heroku to Fly.

### Provision and deploy Rails app to Fly

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

### Transfer Heroku secrets

To see all of your Heroku env vars and secrets, run:

```cmd
heroku config -s | grep -v -e "DATABASE_URL" -e "REDIS_URL" -e "REDIS_TLS_URL" | fly secrets import
```

This command exports the Heroku secrets, excludes `DATABASE_URL` and `REDIS_URL`, and imports them into Fly.

Verify your Heroku secrets are in Fly.

```cmd
fly secrets list
NAME                          DIGEST                            CREATED AT
DATABASE_URL                  24e455edbfcf1247a642cdae30e14872  14m29s ago
LANG                          95a7bb7a8d0ee402edde95bb78ef95c7  1m24s ago
RACK_ENV                      fd89784e59c72499525556f80289b2c7  1m26s ago
RAILS_ENV                     fd89784e59c72499525556f80289b2c7  1m26s ago
RAILS_LOG_TO_STDOUT           a10311459433adf322f2590a4987c423  1m25s ago
RAILS_SERVE_STATIC_FILES      a10311459433adf322f2590a4987c423  1m23s ago
REDIS_TLS_URL                 b30fe87493e14d9b670dc0263dc935c9  1m25s ago
REDIS_URL                     4583a46e747696319573e8bfbd0db04d  1m21s ago
SECRET_KEY_BASE               5afb43c2ddbba6c02ffa7e2834689692  1m22s ago
```

### Transfer the Database

<aside class="callout">
  Any new data created by your Heroku app during this database migration won't be moved over to Fly. Consider taking your Heroku application offline or place in read-only mode if you want to be confident that this migration will move over 100% of your Heroku data to Fly.
</aside>

Set the `HEROKU_DATABASE_URL` variable in your Fly environment.

```cmd
fly secrets set HEROKU_DATABASE_URL=$(heroku config:get DATABASE_URL)
```

Alright, lets start the transfer remotely on the Fly instance.

```cmd
fly ssh console
```

Then from the remote Fly SSH console transfer the database.

```cmd
pg_dump -Fc --no-acl --no-owner -d $HEROKU_DATABASE_URL | pg_restore --verbose --clean --no-acl --no-owner -d $DATABASE_URL
```

You may need to upgrade your Heroku database to match the version of the source Fly database. Refer to Heroku's [Upgrading the Version of a Heroku Postgres Database](https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases) for instructions on how to upgrade, then try the command above again.

After the database transfers unset the `HEROKU_DATABASE_URL` variable.

```cmd
fly secrets unset HEROKU_DATABASE_URL
```

Then launch your Heroku app to see if its running.

```
fly open
```

If you have a Redis server, there's a good chance you need to set that up.

### Provision a Redis server

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

At this point, most Rails apps should boot since they depend on Redis and PostgresSQL. If you're still having problems run `fly logs` to view error messages and post your issues in the [Fly Community Forum](https://community.fly.io).

### Multiple processes & background workers

Heroku uses Procfiles to describe multi-process Rails applications. Fly describes multi-processes with the [`[processes]` directive](/docs/reference/configuration/#the-processes-section) in the `fly.toml` file.

If your Heroku `Procfile` looks like this:

```Procfile
web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq
release: rails db:migrate
```

Move everything except for the `release:` line to you `fly.toml` file:

```toml
[processes]
web = "bundle exec puma -C config/puma.rb"
worker = "bundle exec sidekiq"
```

If you have a `release:` line in your Heroku Procfile, that will be handled by your
`lib/tasks/fly.rake` file:

```ruby
task :release => 'db:migrate'
```

Next, under the `[[services]]` directive, find the entry that maps to `internal_port = 8080`, and add `processes = ["web"]`. The configuration file should look something like this:

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

### Custom Domain & SSL Certificates

After you finish deploying your application to Fly and have tested it extensively, [read through the Custom Domain docs](/docs/app-guides/custom-domains-with-fly) and point your domain at Fly.

In addition to supporting [`CNAME` DNS records](/docs/app-guides/custom-domains-with-fly#option-i-cname-records), Fly also supports [`A` and `AAAA` records](/docs/app-guides/custom-domains-with-fly#option-ii-a-and-aaaa-records) for those who want to point `example.com` (without the `www.example.com`) directly at Fly.

## Cheat Sheet

Old habits die hard, especially good habits like deploying frequently to production. Below is a quick overview of the differences you'll notice initially between Fly and Heroku.

### Commands

Fly commands are a bit different than Heroku, but you'll get use to them after a few days.

| Task         | Heroku     | Fly |
|--------------|-----------|------------|
| Deployments | `git push heroku` | `fly deploy` |
| Rails console | `heroku console` | `fly ssh console -C "/app/bin/rails console"` |
| Database migration | `heroku rake db:migrate` | `fly ssh console -C "/app/bin/rake db:migrate"` |
| Postgres console | `heroku psql` | `fly postgres connect -a <name-of-database-app-server>`
| Tail log files | `heroku logs` | `fly logs` |
| View configuration | `heroku config` | `fly ssh console -C "printenv"` |
| View releases | `heroku releases` | `fly releases` |
| Help | `heroku help` | `fly help` |

Check out the [Fly CLI docs](https://fly.io/docs/flyctl/) for a more extensive inventory of Fly commands.

### Deployments

By default Heroku deployments are kicked off via the `git push heroku` command. Fly works a bit differently by kicking of deployments via `fly deploy`—git isn't needed to deploy to Fly. The advantage to this approach is your git history will be clean and not full of commits like `git push heroku -am "make app work"` or `git push heroku -m "ok it will really work this time"`.

To achieve the desired `git push` behavior, we recommend setting up `fly deploy` as the final command in your continious integration pipeline, as outlined for GitHub in the [Continuous Deployment with Fly and GitHub Actions](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/) docs.

#### Release phase tasks

Heroku has a `release: rake db:migrate` command in their Procfiles to run tasks while the application is deployed. Fly accomplishes the same thing by making `assets:precompile` a dependency of the `:release` task in your `lib/tasks/fly.toml` file:

```ruby
task :release => 'db:migrate'
```

If you don't want to run migrates by default per release, delete the prequite but leave the `:release` task. You'll be able to manually run migrations on Fly via `fly ssh console -C "/app/bin/rails db:migrate"`.

#### Build commands

Asset compilations and build activities that happen before an application deploys can also be customized in the `lib/tasks/fly.toml` that's included in your project.

```ruby
task :build => 'assets:precompile'
```

Remove this dependency or add more depending on the build process required for your application.

#### Deploy via git

Heroku's default deployment technique is via `git push heroku`. Fly doesn't require a git commit, just run `fly deploy` and the files on your local workstation will be deployed.

Fly can be configured to deploy on git commits with the following techniques with a [GitHub Action](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/).

### Databases

Fly and Heroku have different Postgres database offerings. The most important distinction to understand about using Fly is that it automates provisioning, maintenance, and snapshot tasks for your Postgres database, but it does not manage it. If you run out of disk space, RAM, or other resources on your Fly Postgres instances, you'll have to scale those virtual machines from the [Fly CLI](https://fly.io/docs/reference/postgres/).

Contrast that with Heroku, which fully manages your database and includes an extensive suite of tools to provision, backup, snapshot, fork, patch, upgrade, and scale up/down your database resources.

The good news for people who want a highly managed Postgres database is they can continue hosting it at Heroku and point their Fly instances to it!

#### Heroku's managed database

One command is all it takes to point Fly apps at your Heroku managed database.

```cmd
fly secrets set DATABASE_URL=$(heroku config:get DATABASE_URL)
```

This is a great way to get comfortable with Fly if you prefer a managed database provider. In the future if you decide you want to migrate your data to Fly, you can do so [pretty easily with a few commands](#transfer-the-database).


#### Fly's databases

The most important thing you'll want to be comfortable with using Fly's database offering is [backing up and restoring your database](/docs/rails/the-basics/backup-and-restoring-data/).

As your application grows, you'll probably first [scale disk and RAM resources](/docs/reference/postgres/#scaling-vertically-adding-more-vm-resources), then [scale out with multiple replicas](/docs/reference/postgres/#scaling-horizontally-adding-more-replicas). Common maintaince tasks will include [upgrading Postgres](/docs/reference/postgres/#upgrading-the-postgres-app) as new versions are released with new features and security updates.

[You Postgres, now what?](/docs/reference/postgres-whats-next/) is a more comprehensive guide for what's required when running your Postgres databases on Fly.

### Pricing

Heroku and Fly have very different pricing structures. You'll want to read through the details on [Fly's pricing page](/docs/about/pricing/) before launching to production. The sections below serve as a rough comparison between Heroku and Fly's plans as of August 2022.

<div class="callout">
  Please do your own comparison of plans before switching from Heroku to Fly. The examples below are illustrative estimates between two very different offerings, which focuses on the costs of app & database servers. It does not represent the final costs of each plan. Also, the prices below may not be immediately updated if Fly or Heroku change prices.
</div>

#### Free Plans

Heroku will not offer free plans as of November 28, 2022.

Fly offers free usage for up to 3 full time VMs with 256MB of RAM, which is enough to run a tiny Rails app and Postgres database to get a feel for how Fly works.

#### Plans for Small Rails Apps

Heroku's Hobby tier is limited to 10,000 rows of data, which gets exceeded pretty quickly requiring the purchase of additional rows of data.

| Resource | Specs | Price |
|----------|------|-------|
| App Dyno | 512MB RAM | $7/mo |
| Database Server | 10,000,000 rows | $9/mo |
| **Estimated cost** | | $16/mo |

Fly's pricing is [metered for the resources](https://fly.io/docs/about/pricing/) you use. Database is billed by the amount of RAM and disk space used, not by rows. The closest equivalent to the Heroku Hobby tier on Fly looks like this:

| Resource | Specs | Price |
|----------|------|-------|
| App Server | 1GB RAM | ~$5.70/mo |
| Database Server | 256MB RAM / 10Gb disk | ~$3.44/mo |
| **Estimated cost** | | ~$9.14/mo |

#### Plans for Medium to Large Rails Apps

There's too many variables to compare Fly and Heroku's pricing for larger Rails applications depending on your needs, so you'll definitely want to do your homework before migrating everything to Fly. This comparison focuses narrowly on the costs of app & database resources, and excludes other factors such as bandwidth costs, bundled support, etc.

| Resource | Specs | Price | Quantity | Total  |
|----------|-------|-------|----------|--------|
| App Dyno | 2.5GB RAM | $250/mo | 8 | $2,000/mo |
| Database | 61GB RAM / 1TB disk | $2,500/mo | 1 | $2,500/mo |
| **Estimated cost** | | | | $4,500/mo |

Here's roughly the equivalent resources on Fly:

| Resource | Specs | Price | Quantity | Total  |
|----------|-------|-------|----------|--------|
| App Server | 4GB RAM / 2X CPU | ~$62.00/mo | 8 | ~$496/mo |
| Database Server | 64GB RAM / 500GB disk | ~$633/mo | 2 | ~$1,266/mo |
| **Estimated cost** | | | | ~$1,762/mo |

Again, the comparison isn't realistic because it focuses only on application and database servers, but it does give you an idea of how the different cost structures scale on each platform. For example, Heroku's database offering at this level is redundant, whereas Fly offers 2 database instances to achieve similar levels of redundancy.
