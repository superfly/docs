---
title: Sidekiq Background Workers
layout: framework_docs
objective: Deploy Rails applications that run in multiple processes to one Fly application, like Sidekiq background jobs.
order: 1
---

Rails applications commonly defer complex tasks that take a long to complete to a background worker to make web responses seem fast. This guide shows how to use [Sidekiq](https://github.com/mperham/sidekiq), a popular open-source Rails background job framework, to set up background workers, but it could be done with other great libraries like [Good Job](https://github.com/bensheldon/good_job), [Resque](https://github.com/resque/resque), [etc](https://www.ruby-toolbox.com/categories/Background_Jobs).

## Provision a Redis server

Sidekiq depends on Redis to communicate between the Rails server process and the background workers. Follow the [Redis setup guide](/docs/reference/redis) to provision a Redis server and set a `REDIS_URL` within the Rails app. Be sure to set the `REDIS_URL` via a secret as demonstrated [here](/rails/the-basics/configuration/#secret-variables).

Verify the `REDIS_URL` is available to your Rails application before you continue by running:

```cmd
fly ssh console -C "printenv REDIS_URL"
```
```output
REDIS_URL=redis://default:yoursecretpassword@my-apps-redis-host.internal:6379
```

If you don't see `REDIS_URL` in the command above, Sidekiq won't be able to connect and process background jobs.

## Run multiple processes

Most production Rails applications run background workers in a separate process. There's a few ways of accomplishing that on Fly that are [outlined in the multiple-processes](/docs/app-guides/multiple-processes) docs.

The quickest way to run multiple processes in one region is via the `processes` directive in the `fly.toml` file.

<aside class="callout">
  The `[processes]` directive currently only works within a single Fly region. [Scaling a Rails application to multiple regions](/docs/rails/advanced-guides/multi-region) requires a different approach to running multiple processes.
</aside>

Add the following to the `fly.toml`:

```toml
[processes]
web = "bin/rails fly:server"
worker = "bundle exec sidekiq"
```

Then under the `[[services]]` directive, find the entry that maps to `internal_port = 8080`, and change `processes = ["app"]` to `processes = ["web"]`. The configuration file should look something like this:

```toml
[[services]]
  processes = ["web"] # this service only applies to the web process
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []
```

This associates the process with the service that Fly launches.

## Deploy and test

Once multiple processes are configured in the `fly.toml` file, deploy them via:

```cmd
fly deploy
```

If all goes well the application should launch with both `web` and `worker` processes. Be sure to run through the application and test features that kick-off background jobs. If you're having issues getting it working, run `fly logs` to see errors.

## Scaling

Scaling up and down processes may be accomplished by running:

```cmd
fly scale count web=3 worker=3
```

To view the current state of the application's scale, run:

```cmd
fly status
```
```output
App
  Name     = my-rails-app
  Owner    = personal
  Version  = 41
  Status   = running
  Hostname = my-rails-app.fly.dev

Instances
ID        PROCESS VERSION REGION  DESIRED STATUS  HEALTH CHECKS       RESTARTS  CREATED
15088508  worker  41      ord     run     running                     0         34s ago
8789ef49  web     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:06:34Z
c419942b  web     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:05:52Z
ea7af986  web     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:05:52Z
d681c33d  worker  41      ord     run     running                     0         2022-07-26T15:42:30Z
d8d8dc08  worker  41      ord     run     running                     0         2022-07-26T15:42:30Z
```

In this case, we can see that 3 worker processes and 3 web processes are running in the `ord` region.
