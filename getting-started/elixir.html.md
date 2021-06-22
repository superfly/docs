---
title: "Build, Deploy and Run an Elixir Application"
layout: docs
sitemap: false
nav: firecracker
---

Getting an application running on Fly is essentially working out how to package it as a deployable image and attach it to a database. Once packaged it can be deployed to the Fly infrastructure to run on the global application platform. For this _Getting Started_ article, we'll look at building an Elixir Phoenix application from scratch and connecting it to a PostgreSQL database.

## _The HelloElixir Application_

Our example will be a basic "hello world" example using [Phoenix](https://www.phoenixframework.org/). We'll assume that you already have [Elixir](https://elixir-lang.org/install.html) and [Phoenix installed](https://hexdocs.pm/phoenix/installation.html).

Since most web applications require a database, let's get setup with a [Postgres database](/docs/reference/postgres/) as well.

All the code we will create can also be found in [the hello_elixir Github repository](https://github.com/fly-apps/hello_elixir-dockerfile). Just `git clone https://github.com/fly-apps/hello_elixir-dockerfile` to get a local copy if you want to focus on deployment (see the section "Install Flyctl and Login" for that). You can also use the repository as a reference.

Here's how we start the app.

```bash
mix phx.new hello_elixir
```

## _Running the Application_

To run the application locally, we first need to create the database.

**Tip:** Make sure you have a local [PostgreSQL server installed](https://wiki.postgresql.org/wiki/Detailed_installation_guides) and running.

```cmd
mix ecto.setup
```
```output
The database for HelloElixir.Repo has been created
```

Now we can start the application.

```cmd
mix phx.server
```
```output
[info] Running HelloElixirWeb.Endpoint with cowboy 2.8.0 at 0.0.0.0:4000 (http)
[info] Access HelloElixirWeb.Endpoint at http://localhost:4000
```

Connect to localhost:4000 to confirm that you have a working Elixir application. Now to package it up for Fly.

## _Running Migrations in Production_

We want our application to run database migrations when the application starts up. Locally in dev, we use `mix ecto.migrate`. In production when using an Elixir Release, we don't have the `mix` tool available to help out. Let's create a file called `lib/hello_elixir/release.ex` to help with this. This is just following the [Phoenix guide on Deploying with Releases](https://hexdocs.pm/phoenix/releases.html#ecto-migrations-and-custom-commands).

```elixir
defmodule HelloElixir.Release do
  @moduledoc """
  Used for executing DB release tasks when run in production without Mix
  installed.
  """
  @app :hello_elixir

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  defp load_app do
    Application.load(@app)
  end
end
```

We'll call this `migrate` function later.

## _Configure for Releases_

Elixir applications can be compiled into a "release". This means we're not shipping our plain text code in a Docker container. This let's our application start up faster as well. To configure our simple `hello_elixir` application for releases, this is what we do.

### _Special Note on Fly Networking_

Internally Fly uses IPv6 networking. This enables some cool features, but legacy Elixir applications need to be configured to work smoothly with it. Currently, even a newly generated Elixir application needs to be updated as well. These config changes tell Elixir, Phoenix, and the BEAM that we are using IPv6 addresses. The options look like `inet6` and `inet6_tcp`. The next steps are how we configure that in our application.

### _Generate Release Config Files_

We use the `mix release.init` command to create some sample files in the `./rel` directory.

```cmd
mix release.init
```
```output
* creating rel/vm.args.eex
* creating rel/env.sh.eex
* creating rel/env.bat.eex
```

We only need to configure `rel/env.sh.eex`. This file gets turned into a shell script that the release uses to set ENV values used when we run any release commands. Here's the important parts.

```
#!/bin/sh

ip=$(grep fly-local-6pn /etc/hosts | cut -f 1)
export RELEASE_DISTRIBUTION=name
export RELEASE_NODE=$FLY_APP_NAME@$ip
export ELIXIR_ERL_OPTIONS="-proto_dist inet6_tcp"
```

We configure the node to use a full node name when it runs. We get the Fly assigned IPv6 address and use that to name our node. Finally, we configure `inet6_tcp` for the BEAM as well.

Even if you don't care to cluster your nodes together, you still want to do this because it enables running an IEx shell in a running node.

### _Special Note on Clustering_

To make clustering your Elixir applications easier on Fly, in the `env.sh.eex` file, the `RELEASE_NODE` is named using the `$FLY_APP_NAME` and the IPv6 address. It will look something like this in practice.

```
icy-leaf-7381@fdaa:0:1da8:a7b:ac2:216b:da3f:2
```

While our `hello_elixir` app isn't clustered, it could easily be clustered using `libcluster` and a DNS strategy. So to keep things smooth and easy in case you want to go that route, then using the Fly app name as the node name works best.

If you want your application clustered, first focus on getting it deployed. After you have it deployed, there is an optional section at the end of this guide that walks you through getting it clustered.

### _Runtime Config_

Create the file `config/runtime.exs`.

```elixir
import Config

if config_env() == :prod do
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  app_name =
    System.get_env("FLY_APP_NAME") ||
      raise "FLY_APP_NAME not available"

  config :hello_elixir, HelloElixirWeb.Endpoint,
    server: true,
    url: [host: "#{app_name}.fly.dev", port: 80],
    http: [
      port: String.to_integer(System.get_env("PORT") || "4000"),
      # IMPORTANT: support IPv6 addresses
      transport_options: [socket_opts: [:inet6]]
    ],
    secret_key_base: secret_key_base

  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  config :hello_elixir, HelloElixir.Repo,
    url: database_url,
    # IMPORTANT: Or it won't find the DB server
    socket_options: [:inet6],
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")
end
```

This expects to receive some ENV values at runtime. We're expecting `SECRET_KEY_BASE` with our Phoenix secret, our `FLY_APP_NAME` from Fly, and the `DATABASE_URL` for connecting to a Fly hosted Postgres database.

There are a few important config settings in `config/runtime.exs` that are worth covering in more detail.

The Phoenix Endpoint config needs to support IPv6 using the `:inet6` option.

```elixir
  config :hello_elixir, HelloElixirWeb.Endpoint,
    ...
    http: [
      ...
      # IMPORTANT: support IPv6 addresses
      transport_options: [socket_opts: [:inet6]]
    ],
    ...
```

Connecting to the Postgres instance also needs to support IPv6. This is part of the Repo config.

```elixir
  config :hello_elixir, HelloElixir.Repo,
    ...
    # IMPORTANT: Or it won't find the DB server
    socket_options: [:inet6],
    ...
```

Also, you don't need to turn on TLS for connecting to the Postgres instance. Fly private networks operate over an encrypted WireGuard mesh, so traffic between application servers and PostgreSQL is already encrypted and there's no need to TLS.

### _Remove Non-Release Config_

Our newly generated Phoenix app includes some boilerplate config that we need to remove because we're using releases. In our case, the config was moved to the `config/runtime.exs` file.

Delete the file `config/prod.secret.exs`.

Remove the last line of `config/prod.exs` that says `import_config "prod.secret.exs"`.

## _Docker Setup_

### _Dockerfile_

Here is a working Dockerfile that builds the application. The base image used for building the release is using [`hexpm/elixir`](https://hub.docker.com/r/hexpm/elixir/tags?page=1&ordering=last_updated). [Hex.pm](https://hex.pm/) is the official package repository for Elixir. This image is kept up-to-date and the tags allow for easier selection of Elixir and Erlang versions. This one uses Alpine Linux but hexpm provides other base images you can use as well. [See hexpm on Dockerhub](https://hub.docker.com/r/hexpm/elixir/tags?page=1&ordering=last_updated) for other options.

```Dockerfile
###
### Fist Stage - Building the Release
###
FROM hexpm/elixir:1.12.1-erlang-24.0.1-alpine-3.13.3 AS build

# install build dependencies
RUN apk add --no-cache build-base npm

# prepare build dir
WORKDIR /app

# extend hex timeout
ENV HEX_HTTP_TIMEOUT=20

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV as prod
ENV MIX_ENV=prod
ENV SECRET_KEY_BASE=nokey

# Copy over the mix.exs and mix.lock files to load the dependencies. If those
# files don't change, then we don't keep re-fetching and rebuilding the deps.
COPY mix.exs mix.lock ./
COPY config config

RUN mix deps.get --only prod && \
    mix deps.compile

# install npm dependencies
COPY assets/package.json assets/package-lock.json ./assets/
RUN npm --prefix ./assets ci --progress=false --no-audit --loglevel=error

COPY priv priv
COPY assets assets

# NOTE: If using TailwindCSS, it uses a special "purge" step and that requires
# the code in `lib` to see what is being used. Uncomment that here before
# running the npm deploy script if that's the case.
# COPY lib lib

# build assets
RUN npm run --prefix ./assets deploy
RUN mix phx.digest

# copy source here if not using TailwindCSS
COPY lib lib

# compile and build release
COPY rel rel
RUN mix do compile, release

###
### Second Stage - Setup the Runtime Environment
###

# prepare release docker image
FROM alpine:3.13.3 AS app
RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/hello_elixir ./

ENV HOME=/app
ENV MIX_ENV=prod
ENV SECRET_KEY_BASE=nokey
ENV PORT=4000

CMD ["bin/hello_elixir", "start"]
```

This is a two-stage Dockerfile. There are two `FROM` commands. The first stage pulls in the source and builds the release. The second stage takes the prepared release and sets it up in a minimal Docker image. The final deployed image contains only our release.

### _Docker Ignore File_

We add the file `.dockerignore` to the project with the following contents.

```
assets/node_modules/
deps/
```

This keeps any natively compiled Elixir or Node packages from our development environments from causing a problem in the Linux container.

## _Install Flyctl and Login_

We are ready to start working with Fly and that means we need `flyctl`, our CLI app for managing apps on Fly. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/getting-started/installing-flyctl/). Once that's installed you'll want to [login to Fly](/docs/getting-started/login-to-fly/).


## _Launch the App on Fly_

To launch an app on fly, run `fly launch` in the directory with your source code. This creates and configures a fly app for you by inspecting your source code, then prompts you to deploy.

```cmd
fly launch
```
```output
$ fly launch
Scanning source code
Detected Dockerfile app
? Select region: sea (Seattle, Washington (US))
Created app icy-leaf-7381 in organization personal
Wrote config file fly.toml
? Would you like to deploy now? No
```

Don't deploy it just yet. We're going to adjust the generated `fly.toml` file first.

The `fly launch` command scans your source code to determine how to build a deployment image as well as identify any other configuration your app needs, such as secrets and exposed ports.

After your source code is scanned and the results are printed, you'll be prompted for an organization. Organizations are a way of sharing applications and resources between Fly users. Every Fly account has a personal organization, called `personal`, which is only visible to your account. Let's select that for this guide.

Next, you'll be prompted to select a region to deploy in. The closest region to you is selected by default. You can use this or change to another region. You can find the [list of supported regions here](/docs/reference/regions/).

At this point, `flyctl` created an app for you and wrote your configuration to a `fly.toml` file. You'll then be prompted to build and deploy your app. Once complete, your app will be running on fly.

## _Inside `fly.toml`_

The `fly.toml` file now contains a default configuration for deploying your app. In the process of creating that file, `flyctl` has also generated a Fly-side application slot with a new name. In this case, it is `icy-leaf-7381`. If we look at the `fly.toml` file we can see the name in there:

```toml
app = "icy-leaf-7381"

kill_signal = "SIGINT"
kill_timeout = 5

[env]

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 6
    timeout = "2s"
```

The `flyctl` command will always refer to this file in the current directory if it exists, specifically for the `app` name/value at the start. That name is used to identify the application to the Fly platform. The rest of the file contains settings to be applied to the application when it deploys.

We'll have more details about these properties as we progress, but for now, it's enough to say that they mostly configure which ports the application will be visible on.

## _Customizing `fly.toml`_

Elixir applications need a little customization to the generated `fly.toml` file.

```toml
app = "icy-leaf-7381"

kill_signal = "SIGTERM"
kill_timeout = 5

[env]

[deploy]
  release_command = "/app/bin/hello_elixir eval HelloElixir.Release.migrate"

[[services]]
  internal_port = 4000
  protocol = "tcp"

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "30s" # allow some time for startup
    interval = "15s"
    restart_limit = 6
    timeout = "2s"
```

There are two important changes here:

- We added the `[deploy]` setting. This tells Fly that on a new deploy, **run our database migrations**.
- The `kill_signal` is set to `SIGTERM`. An Elixir node does a clean shutdown when it receives a `SIGTERM` from the OS.

Some other values were tweaked as well. Check that `internal_port` matches your application.

## _Preparing to Deploy_

We're almost there! Before we can deploy our new app, we need to setup a few things in our Fly account first. Namely, we want to provide the needed secrets and we need a database!

### _Setting our Secrets on Fly_

Elixir has a mix task that can generate a new Phoenix key base secret. Let's use that.

```bash
mix phx.gen.secret
```

It generates a long string of random text. Let's store that as a secret for our app. When we run this command in our project folder, `flyctl` uses the `fly.toml` file to know which app we are setting the value on.

```
fly secrets set SECRET_KEY_BASE=<GENERATED>
```

### _Creating our Fly Postgres Database_

```cmd
fly postgres create
```
```output
? App name: hello-elixir-db
Automatically selected personal organization: Mark Ericksen
? Select region: sea (Seattle, Washington (US))
? Select VM size: shared-cpu-1x - 256
? Volume size (GB): 10
Creating postgres cluster hello-elixir-db in organization personal
Postgres cluster hello-elixir-db created
  Username:    <USER>
  Password:    <PASSWORD>
  Hostname:    hello-elixir-db.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place, you won't be able to see them again!

Monitoring Deployment

2 desired, 2 placed, 2 healthy, 0 unhealthy [health checks: 6 total, 6 passing]
--> v0 deployed successfully

Connect to postgres
Any app within the personal organization can connect to postgres using the above credentials and the hostname "hello-elixir-db.internal."
For example: postgres://<USER>:<PASSWORD>@hello-elixir-db.internal:5432

See the postgres docs for more information on next steps, managing postgres, connecting from outside fly:  https://fly.io/docs/reference/postgres/
```

We can take the defaults which select the lowest values for CPU, size, etc. This is perfect for getting started.

### _Attach our App to the Database_

We can use `flyctl` to attach our app to the database which also sets our needed `DATABASE_URL` ENV value.

```cmd
fly postgres attach --postgres-app hello-elixir-db
```
```output
Postgres cluster hello-elixir-db is now attached to icy-leaf-7381
The following secret was added to icy-leaf-7381:
  DATABASE_URL=postgres://<NEW_USER>:<NEW_PASSWORD>@hello-elixir-db.internal:5432/icy_leaf_7381?sslmode=disable
```

We can see the secrets that Fly is using for our app like this.

```cmd
fly secrets list
```
```output
NAME            DIGEST                           DATE
DATABASE_URL    830d8769ff33cba6c8b29d1cd6a6fbac 1m10s ago
SECRET_KEY_BASE 84c992ac7ef334c21f2aaecd41c43666 9m20s ago
```

Looks like we're ready to deploy!

## _Deploying to Fly_

To deploy changes to your app, just run just run:

```cmd
fly deploy
```

First, `flyctl` builds our Dockerfile and pushes it to a Fly container registry.

This will lookup our `fly.toml` file, and get the app name `icy-leaf-7381` from there. Then `flyctl` will start the process of deploying our application to the Fly platform. Flyctl will return you to the command line when it's done.

## _Viewing the Deployed App_

Now the application has been deployed, let's find out more about its deployment. The command `fly status` will give you all the essential details.

```cmd
fly status
```
```output
App
  Name     = icy-leaf-7381
  Owner    = personal
  Version  = 3
  Status   = running
  Hostname = icy-leaf-7381.fly.dev

Deployment Status
  ID          = 9762642f-baa4-e4df-c683-13f2ce26a6bc
  Version     = v3
  Status      = successful
  Description = Deployment completed successfully
  Instances   = 1 desired, 1 placed, 1 healthy, 0 unhealthy

Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
f617e72a 3       sea    run     running 1 total, 1 passing 0        1m34s ago
```

## _Connecting to the App_

The quickest way to browse your newly deployed application is with the `fly open` command.

```cmd
fly open
```
```output
Opening https://icy-leaf-7381.fly.dev/
```

Your browser will be sent to the displayed URL. Fly will auto-upgrade this URL to a HTTPS secured URL.

## _Arrived at Destination_

You have successfully built, deployed, and connected to your first Elixir application on Fly. Check out the following bonus sections to go further!

## _Bonus Sections_

With your application up and running, there are some additional things you can do to go further. Using some `flyctl` commands, we can easily do some powerful things with our application.

These bonus tips cover:

- Getting an IEx shell into your running node. This helps you manage and work with your running system.
- Clustering multiple Elixir nodes together. Say "Hello!" to the power of Distributed Computing!
- Scaling your application out to more machines and even distant regions (with or without clustering).

### _What is the IP Address?_

If you want to know what IP addresses the app is using, try `fly ips list`:

```cmd
fly ips list
```
```output
TYPE ADDRESS                              CREATED AT
v4   213.188.199.124                      24m5s ago
v6   2a09:8280:1:ce56:c80f:5071:6e94:6688 24m5s ago
```

### _Getting an IEx Shell into a Running Node_

As mentioned before, Elixir supports getting a IEx shell into a running production node. How cool is that? We already took the steps to configure `rel/env.sh.eex`, so this step should be pretty easy.

There are a couple prerequisites, we first need to establish an [SSH Shell](https://fly.io/docs/flyctl/ssh/) to our machine on Fly.

This step sets up a root certificate for your account and then issues a certificate.

```
fly ssh establish
fly ssh issue
```

With SSH configured, let's open a console.

```cmd
fly ssh console
```
```output
Connecting to icy-leaf-7381.internal... complete
/ #
```

If all has gone smoothly, then you have a shell into the machine! Now we just need to launch our remote IEx shell. The Dockerfile was configured to pull our application into `/app`. So our command for the `hello_elixir` app looks like this:

```cmd
app/bin/hello_elixir remote
```
```output
Erlang/OTP 23 [erts-11.2.1] [source] [64-bit] [smp:1:1] [ds:1:1:10] [async-threads:1]

Interactive Elixir (1.11.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(hello_elixir@fdaa:0:1da8:a7b:ac4:b204:7e29:2)1>
```

Awesome! A running IEx shell into our node. You can safely disconnect it using CTRL+C, CTRL+C.

### _Clustering Your Application_

Elixir and the BEAM have the incredible ability to be clustered together and pass messages seamlessly between nodes. Fly makes clustering easy! This extra (and totally optional) portion of the guide walks you through clustering your Elixir application.

There are 2 parts to getting clustering quickly setup on Fly.

- Installing and using `libcluster`
- Scaling our application to multiple instances

#### _Adding `libcluster`_

The widely adopted library [libcluster](https://github.com/bitwalker/libcluster) helps here.

Libcluster supports multiple strategies for finding and connecting with other nodes. The strategy we'll use is `DNSPoll` which was added in version 3.2.2 of `libcluster`, so make sure you're using that version or newer.


After installing `libcluster`, add it to the application like this:

```elixir
defmodule HelloElixir.Application do
  use Application

  def start(_type, _args) do
    topologies = Application.get_env(:libcluster, :topologies) || []

    children = [
      # ...
      # setup for clustering
      {Cluster.Supervisor, [topologies, [name: HelloElixir.ClusterSupervisor]]}
    ]

    # ...
  end

  # ...
end
```

Our next step is to add the `topologies` configuration to the file `config/runtime.exs`.

```elixir
  app_name =
    System.get_env("FLY_APP_NAME") ||
      raise "FLY_APP_NAME not available"

  config :libcluster,
    debug: true,
    topologies: [
      fly6pn: [
        strategy: Cluster.Strategy.DNSPoll,
        config: [
          polling_interval: 5_000,
          query: "#{app_name}.internal",
          node_basename: app_name
        ]
      ]
    ]
```

**REMEMBER:** Deploy your updated app so the clustering code is available. Ex: `fly deploy`

This configures `libcluster` to use the `DNSPoll` strategy and look for other deployed apps using the `$FLY_APP_NAME` on the `.internal` private networks.

This assumes that your `rel/env.sh.eex` file is configured to name your Elixir node using the `$FLY_APP_NAME`.

Before it can be clustered, we have to have multiple instances. We'll do that next!

#### _Running Multiple Instances_

There are two ways to run multiple instances.

1. Scale our application to have multiple instances in one region.
2. Add an instance to another region (multiple regions).

Both approaches are valid and our Elixir application doesn't change at all for the approach you choose!

Let's first start with a baseline of our single deployment.

```cmd
fly status
```
```output
...
Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
f9014bf7 26      sea    run     running 1 total, 1 passing 0        1h8m ago
```

#### _Scaling in a Single Region_

Let's scale up to 2 instances in our current region.

```cmd
fly scale count 2
```
```output
Count changed to 2
```

Checking on the status we can see what happened.

```cmd
fly status
```
```output
...
Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
eb4119d3 27      sea    run     running 1 total, 1 passing 0        39s ago
f9014bf7 27      sea    run     running 1 total, 1 passing 0        1h13m ago
```

We now have two instances in the same region! That was easy.

Let's make sure they are clustered together. We can check the logs:

```cmd
fly logs
```
```output
...
app[eb4119d3] sea [info] 21:50:21.924 [info] [libcluster:fly6pn] connected to :"icy-leaf-7381@fdaa:0:1da8:a7b:ac2:f901:4bf7:2"
...
```

But that's not as rewarding as seeing it from inside a node. From an IEx shell, we can ask the node we're connected to, what other nodes it can see.

```
fly ssh console
/app/bin/hello_elixir remote
```

```elixir
iex(icy-leaf-7381@fdaa:0:1da8:a7b:ac2:f901:4bf7:2)1> Node.list
[:"icy-leaf-7381@fdaa:0:1da8:a7b:ac4:eb41:19d3:2"]
```

I included the IEx prompt because it shows the IP address of the node I'm connected to. Then getting the `Node.list` returns the other node. Our two instances are connected and clustered!

#### _Scaling to Multiple Regions_

Fly makes it super easy to run instances of your applications physically closer to your users. Through the magic of DNS, they will be directed to their nearest region of your application. You can read about [regions](/docs/reference/regions/#welcome-message) here and see the list of regions to choose from.


Starting back from our baseline of a single instance running in `sea` which is Seattle, Washington (US), I'll add the region `ewr` which is Parsippany, NJ (US). This puts an instance on both coasts of the US.

```cmd
fly regions add ewr
```
```output
Region Pool:
ewr
sea
Backup Region:
iad
lax
sjc
vin
```

Looking at the status right now shows that we're only in 1 region because our count is set to 1.

```cmd
fly status
```
```output
...
Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
cdf6c422 29      sea    run     running 1 total, 1 passing 0        58s ago
```

Let's add a 2nd instance and see it deploy to `ewr`.

```cmd
fly scale count 2
```
```output
Count changed to 2
```

Now our status shows we have two instances spread across 2 regions!

```cmd
fly status
```
```output
...
Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
0a8e6666 30      ewr    run     running 1 total, 1 passing 0        16s ago
cdf6c422 30      sea    run     running 1 total, 1 passing 0        6m47s ago
```

Let's ensure they are clustered together.

```
fly ssh console
/app/bin/hello_elixir remote
```

```elixir
iex(icy-leaf-7381@fdaa:0:1da8:a7b:ac2:cdf6:c422:2)1> Node.list
[:"icy-leaf-7381@fdaa:0:1da8:a7b:ab2:a8e:6666:2"]
```

We have two instances of our application deployed to the West and East coasts of the North American continent and they are clustered together! Our users will automatically be directed to the server nearest them. That is so cool!

Elixir has the built-in super power of Distributed Computing and with very little effort, you can deploy clustered and globally distributed applications yourself!
