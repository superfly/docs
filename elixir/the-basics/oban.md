---
title:  Oban Workers
layout: framework_docs
objective: Deploy Phoenix applications that run in multiple processes to one Fly application, like Oban background jobs.
order: 1
---

Phoenix applications commonly defer complex tasks that take a long to complete to a background worker to avoid blocking on HTTP requests and to shed load from the HTTP Server. This guide shows how to use [Oban](https://getoban.pro/), a popular open source Elixir background job framework, to set up background workers that run on their own machines.

## Prerequisites

1. PostgreSQL working with a standard Phoenix Application.
2. Oban configured and working on a single machine.

## Run multiple processes

To run multiple processes on Fly, you need to configure the `fly.toml` file to run multiple processes. The quickest way to get started is to follow the process [outlined in the multiple-processes](/docs/app-guides/multiple-processes) docs.

Add the following to the `fly.toml`:

```toml
[processes]
app = "/app/bin/server"
worker = "/app/bin/worker"
```

Then under the `[http_service]` directive, add `processes = ["app"]`. The configuration file should look something like this:

```toml
[http_service]
  processes = ["app"] # this service only applies to the app process
```

This associates the process with the service that Fly launches.

### Create the worker script

Copy the server script as the base for our worker script:
```cmd
cp rel/overlays/bin/server rel/overlays/bin/worker
```

Edit the worker script to look like this:
```bash
#!/bin/sh
cd -P -- "$(dirname -- "$0")"
PHX_SERVER=false OBAN_QUEUES="*" exec ./my_app start
```

And edit your server script to look like this:
```bash
#!/bin/sh
cd -P -- "$(dirname -- "$0")"
PHX_SERVER=true OBAN_QUEUES="default,1 media,0, events,0" exec ./my_app start
```

### Update Configuration

Edit your `config/runtime.exs` for Oban to look like this:
```elixir

env_queues = System.get_env("OBAN_QUEUES")
# Based on https://hexdocs.pm/oban/splitting-queues.html#content
queues =
  case env_queues do
    nil -> []
    "*" -> [default: 15, media: 10, events: 25] # The default
    _ ->
     env_values
       |> String.split(" ", trim: true)
       |> Enum.map(&String.split(&1, ",", trim: true))
       |> Keyword.new(fn [queue, limit] ->
         {String.to_existing_atom(queue), String.to_integer(limit)}
       end)
  end

config :my_app, Oban,
  repo: MyApp.Repo,
  queues: queues

```

Once we do this we simply need to change the OBAN_QUEUES environment variable per-worker if we want queue specific workers. This also allows us to dynamically change our runtime configuration of each worker if we need to.


## Deploy and test

Once multiple processes are configured in the `fly.toml` file, deploy them via:

```cmd
fly deploy
```

If all goes well the application should launch with both `app` and `worker` processes. Be sure to run through the application and test features that kick-off background jobs. If you're having issues getting it working, run `fly logs` to see errors.

## Scaling

Scaling up and down processes may be accomplished by running:

```cmd
fly scale count app=3 worker=3
```

To view the current state of the application's scale, run:

```cmd
fly status
```
```output
App
  Name     = my-app
  Owner    = personal
  Version  = 41
  Status   = running
  Hostname = my-app.fly.dev

Instances
ID        PROCESS VERSION REGION  DESIRED STATUS  HEALTH CHECKS       RESTARTS  CREATED
15088508  worker  41      ord     run     running                     0         34s ago
8789ef49  app     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:06:34Z
c419942b  app     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:05:52Z
ea7af986  app     41      ord     run     running 1 total, 1 passing  0         2022-07-26T16:05:52Z
d681c33d  worker  41      ord     run     running                     0         2022-07-26T15:42:30Z
d8d8dc08  worker  41      ord     run     running                     0         2022-07-26T15:42:30Z
```

In this case, we can see that 3 worker processes and 3 app processes are running in the `ord` region.


## Distribution

If you need your applications to be connected and handled via distribution you only need to follow our [Clustering Guide](/docs/elixir/the-basics/clustering/) and it will magically work.
