---
title: Deno KV with LiteFS Cloud
layout: docs
sitemap: false
nav: firecracker
author: jesse
date: 2024-05-28
---

## Problem

If you're porting an app from Deno Deploy to Fly.io, you may hit a bit of a snag: if it was built with [Deno KV](https://deno.com/blog/kv), a _traditionally_ FoundationDB backed K/V store made for Deno Deploy, it may seem like you're stuck because there's no obvious way to easily run Deno KV at scale on Fly.io. You _could_ use [denoland/denokv](https://github.com/denoland/denokv) on Fly.io, but due to an alignment of the stars there happens to be an easier way.

Deno KV can actually be backed by an SQLite DB stored on disk in a cache folder, and you can actually specify the path of this DB with the parameter to `Deno.openKv( <here> )`.

This means you can do something like this:

```typescript
const kv = await Deno.openKv("/any/path/i/want.db");
```

To get the SQLite-backed Deno KV implementation to work off an arbitrary SQLite DB.

Now, Fly.io has some special features for SQLite users, namely [LiteFS Cloud](https://fly.io/docs/litefs/speedrun), a distributed file system that transparently replicates and backs up SQLite databases across all your instances. The magic here is that you can just treat it like a local on-disk SQLite database but behind the curtain it’s doing all the work to replicate your DB.

## Setting up LiteFS

Firstly, you need to add a `litefs.yml` file to your project, and make sure it gets included in the Dockerfile.

Here’s an example:

```yml
fuse:
  dir: "/litefs"

data:
  dir: "/var/lib/litefs"

exit-on-error: false

proxy:
  addr: ":8080"
  target: "localhost:8081"
  db: "db"
  passthrough:
    - "*.ico"
    - "*.png"

exec:
  - cmd: "deno run -A main.ts"

lease:
  type: "consul"
  advertise-url: "http://${HOSTNAME}.vm.${FLY_APP_NAME}.internal:20202"
  candidate: ${FLY_REGION == PRIMARY_REGION}
  promote: true

  consul:
    url: "${FLY_CONSUL_URL}"
    key: "litefs/${FLY_APP_NAME}"\
```

This is 99% the [sample config](https://github.com/superfly/litefs-example/blob/main/fly-io-config/etc/litefs.yml), only changing the exec command to a Deno one.

<section class="callout"> It’s not immediately clear based on the config, but you need to make your app listen on 8081, not 8080. Part of LiteFS acts as a proxy, so you need the fly-proxy to send requests to LiteFS which then forwards them on to your app.

If you’re not able to change your application’s port, make sure `target` is set up correctly then change `addr` and `fly.toml` to something other than `:8080`. </section>

Once you've added the config, you just need to make your app look for the SQLite DB in the right location. For Deno KV, that looks like this:

```typescript
const kv = await Deno.openKv(Deno.env.get("DB_LOCATION"));
```

Where `DB_LOCATION` is set to `/litefs/my.db`.

Now, if you’re deploying to Fly.io, you’re almost ready to go. [Here’s where to look if you’re not running on Fly.io](https://fly.io/docs/litefs/getting-started-docker/).

## Creating a LiteFS Cloud cluster

For a more in-depth article, check out [Getting Started with LiteFS on Fly.io](https://fly.io/docs/litefs/getting-started-fly/).

Head over to the [LiteFS section](https://fly.io/dashboard/personal/litefs) of the dashboard and create a cluster, **make a note of the auth token** (you’ll need it later).

### Dockerfile

You need to add the dependencies for LiteFS to your Dockerfile:

```docker
# for alpine-based images
RUN apk add ca-certificates fuse3 sqlite

# or for debian/ubuntu-based images
RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
```

And copy in the LiteFS binary:

```docker
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs
```

And update the `ENTRYPOINT`/`CMD`.

```docker
ENTRYPOINT litefs mount
```

Now you're ready to launch your Fly app!

```bash
# Create a volume
$ fly volumes create litefs --size 10

# Create your app without deploying
$ fly launch --no-deploy

# Attach the Fly.io provided Consul server to your app.
$ fly consul attach

# Set the secret for LiteFS cloud, replace the example value with your token from earlier
$ fly secrets set LITEFS_CLOUD_TOKEN=yoursecrettoken
```

Update your `fly.toml` to mount the LiteFS volume:

```
[mounts]
  source = "litefs"
  destination = "/var/lib/litefs"
```

Aaannnndddd, Deploy!

```
fly deploy
```

Wow! Your reward for all those commands is hopefully a running app with LiteFS! From my (somewhat limited) testing, this appears to be fully functional with Deno KV as a “client”, but I’d love to hear if any of you run into friction using LiteFS with Deno KV or any other client, you can reach out on [the Fly Community](https://community.fly.io/).

### Scaling

Deploying just one node using LiteFS doesn’t actually _do much_, so try scaling outwards! I like to add a few machines in regions close to my friends for hobby apps like this:

```
fly scale count 3 -r yyz,ewr,waw
```

This will automatically add volumes and machines to scale your app out and around the world!
