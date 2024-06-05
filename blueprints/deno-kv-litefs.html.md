---
title: Deno KV with LiteFS Cloud
layout: docs
sitemap: false
nav: firecracker
author: jesse
date: 2024-05-28
---

## Problem

If you're porting an app from Deno Deploy to Fly.io, you may hit a bit of a snag: if it was built with [Deno KV](https://deno.com/blog/kv), a _traditionally_ FoundationDB backed K/V store made for Deno Deploy, there's no obvious way to easily run Deno KV at scale on Fly.io. You _could_ use [denoland/denokv](https://github.com/denoland/denokv) on Fly.io, but due to an alignment of the stars there happens to be an easier way.

Deno KV can actually be backed by an SQLite DB stored on disk in a cache folder, and you can specify the path of this DB with the parameter to `Deno.openKv( <here> )`.

This means you can do something like this to get Deno KV to use an arbitrary SQLite DB:

```typescript
const kv = await Deno.openKv("/any/path/i/want.db");
```

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

<div class="important icon">
It's not immediately clear based on the example config, but your app needs to listen on "target" (:8081) and your service/http_service in fly.toml needs to listen on "addr" (:8080). This is because part of LiteFS acts as a proxy, so you need the fly-proxy to send requests to LiteFS which then forwards them on to your app.

If you’re not able to change your application’s port, make sure `target` is set up correctly then change `addr` and `fly.toml` to something other than `:8080`.

</div>

Once you've added the config, you just need to make your app look for the SQLite DB in the right location. For Deno KV, that looks like this:

```typescript
const kv = await Deno.openKv(Deno.env.get("DB_LOCATION"));
```

Where `DB_LOCATION` is set to `/litefs/my.db` in `fly.toml` under `[env]`.

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

And update the `ENTRYPOINT`/`CMD`:

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

Your reward for running all those commands should be a running app with LiteFS! Let us know if you run into friction using LiteFS with Deno KV or any other client, you can reach out on [the Fly Community](https://community.fly.io/).

### Scaling

Deploying just one node using LiteFS doesn’t actually _do much_, so try scaling outwards! You can add a few Machines in regions close to your users like this:

```
fly scale count 3 -r yyz,ewr,waw
```

This will automatically add volumes and Machines to [scale your app](/docs/apps/scale-count/#scale-an-apps-regions) out and around the world!
