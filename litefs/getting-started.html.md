---
title: Getting Started with LiteFS
layout: docs
sitemap: false
nav: litefs
toc: true
---

This tutorial will get you up and running with LiteFS on Fly.io. While using
Fly.io is not required, it provides services such as Consul that make it easy
to run LiteFS with minimal configuration. It should take you about 10 minutes
to go through this tutorial.


## Prerequisites

First, you'll need to install [`flyctl`](/docs/hands-on/install-flyctl/).
Then, either sign up or log in:

```sh
# Sign up for a new account.
fly auth signup
```

```sh
# Or sign in with an existing account.
fly auth login
```

Once the CLI is ready, you'll need to download the [`litefs-example`](https://github.com/superfly/litefs-example)
repository. The app will give you a simple Go & SQLite app that can utilize
LiteFS' distributed database layer.

```sh
git clone https://github.com/superfly/litefs-example
cd litefs-example
```

## Deploying your app

### Set up your Fly.io config

Once you have the `litefs-example` repository downloaded, create a new `fly.toml`
file in the root with the following contents:

```toml
[experimental]
  enable_consul = true

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80
    force_https = true

  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

This config will give you a Consul endpoint to use with LiteFS and it will
configure your application so it's publicly visible over HTTPS.


### Launching your app

The next step is to launch & deploy your app with the following command:

```sh
fly launch
```

This will ask you a few questions such as if you want to use the `fly.toml` in
the current directory. Go ahead and answer `"Y"` to that and choose a region.
You'll also have the option to make a name for your application or have it
randomly generated. Remember that application name for later.

The application should build and deploy and you should see it up in running
after a minute or so. You can go to `https://$APPNAME.fly.dev/` and see your
application running live.


## Scaling up your app

The application is a simple interface for generating fake people records. It's
just for illustrating how LiteFS can easily replicate your data between nodes.

When you click the _"Generate Record"_ button, it will create that row in a
local SQLite database that is running on a LiteFS file system. Any other node
running LiteFS will automatically get those updates and apply them to their
local copy of the database. That lets every node keep an exact copy of the same
database.

Right now we only have 1 instance of our application running in the region that
you chose during launch. Let's add more regions in London (`lhr`) and
Sydney (`syd`):

```sh
fly regions add lhr syd
```

Now that we have the regions, we also need to scale the number of instances up:

```sh
fly scale count 3 --max-per-region=1
```

You can use `fly status` or `fly logs` to monitor for the new nodes to startup
and join the cluster automatically.

LiteFS uses [Consul](https://www.consul.io/) to track the current primary node
in the cluster. Other nodes will automatically find the primary on startup and
connect to it and replicate from it. In the event that the primary node fails,
it will lose its `"primary"` status and another node can become primary.

The directory that LiteFS mounts on the file system provides a file called
`.primary` that tells the application the hostname of the current primary node.
The application can use this to redirect write requests to the primary node
and the replica node can service any read-only requests.


## Watching real-time replication

Fly.io will automatically connect you to the closest region in order to minimize
latency. If you're in Europe, you'll connect to the `lhr` region. If you're in
Australia, you'll connect to the `syd` region.

However, we want to see that our data replicates to each region. For that, we've
added a `region` query parameter to our application's logic. If you want to view
the application from the `lhr` region, you can navigate to:

```
https://$APPNAME.fly.dev?region=lhr
```

Replication in LiteFS is fast though so let's set up real-time updates using the
[`watch`](https://linux.die.net/man/1/watch) command in our terminal. If you're
using macOS, you may need to install it using `brew install watch`.

The `watch` command will continuously run a subcommand and display its output
until we stop it with `CTRL-C`.

We'll be running a cURL command to continuously fetch our app's data every 100ms
so we can see updates as they happen. Open a new terminal window for each of
your regions and run the following (except change the "region" at the end):

```sh
watch -n 0.1 "curl -s -H 'Accept: text/plain' https://${APPNAME}.fly.dev?region=lhr"
```

Now, when you click on the _"Generate Record"_ in your browser, you should see
your other nodes update with new data almost instantly. The time to update is
approximately the ping time. For example, a ping from London to Sydney is
around 250ms.


### Safety & Persistence

By default, Fly.io runs ephemeral instances which means that all data is deleted
when the instance is shutdown. Since we have multiple instances running and
replicating, data is automatically copied between nodes during a rolling restart
so it appears that our cluster has persistence.

However, in the event that all nodes shutdown at the same time, the database
would be lost. That's no good.

To protect against this, you're encouraged to use volumes. This allows nodes to
retain their data between restarts. Please see the [Volumes](/docs/reference/volumes/)
documentation for more information.

Additionally, you'll need to set the `data-dir` in the `litefs.yml` configuration
file to point to your mount directory for your volume.


