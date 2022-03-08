---
title: Redis on Fly
layout: docs
sitemap: false
nav: firecracker
---


<div class="callout">

The limited, "built-in" Redis caching that was previously known as Fly Redis is deprecated; we now recommend running Redis as a Fly.io app.

</div>

You can run a key/value store like [Redis](https://redis.io) or [KeyDB](https://keydb.dev/) on Fly.io.

Here's a quick procedure to  create a standalone Redis server as a Fly.io app in a single region, with persistent storage, and accessible only from apps within your organization.

## Create the Fly.io app

We have a sweet Redis image you can use to create your own Redis instances on Fly.io. Use `fly launch` to create the new Redis app, but don't deploy yet:

`fly launch --image flyio/redis:6.2.6 --no-deploy`

When prompted,  give the app a name (in this case `my-fly-redis`), and select a region. Let's use Chicago (`ord`) for this example.

The newly-generated `fly.toml` will specify the `flyio/redis:6.2.6` image:

```toml
[build] 
 image = "flyio/redis:6.2.6"
```

## Add persistent storage

We recommend adding a [volume](https://fly.io/docs/reference/volumes/) for persistent storage of Redis data. If you skip this step, data will be lost across deploys or restarts. The volume needs to be in the same region as the `my-fly-redis` app instance.

Here the volume is called `redis_server` and we use `fly volumes create` to put it in `ord` where the app is configured to deploy.

```cmd
fly volumes create redis_server --region ord
```
```output
       ID: vol_6d7xkrk7do64w2q9 
     Name: redis_server 
   Region: ord
      Zone: 2c30 
  Size GB: 10 
 Encrypted: true 
Created at: 03 Dec 21 21:47 UTC
```

## Tweak `fly.toml`

When we ran `fly launch`, it generated a `fly.toml` configuration file. We need to make some adjustments to it.

### Attach the storage volume

The following `[[mounts]]` section tells the new Redis app to mount the `redis_server` volume at `/data` when it starts.

```toml
[[mounts]]
  destination = "/data"
  source = "redis_server"
```

### Hook up metrics

Add [metrics](https://fly.io/docs/reference/metrics/):

```toml
[metrics]
  port = 9091
  path = "/metrics"
```

### Services

A default [[[services]] section](https://fly.io/docs/reference/configuration/#the-services-sections) was generated on `fly launch` for internal port 8080. Redis doesn't use port 8080; additionally, it's unlikely that you want your public Redis exposed on the public internet.

So delete the `[[services]]` section.

Other apps within the same organization can still access the Redis server over the Fly.io [private network](https://fly.io/docs/reference/private-networking/), at `my-fly-redis.internal:6379`, but will not be mapped to the external internet.

## Add a password for Redis

This installation requires setting a password on Redis **before** deploying.

`fly secrets set REDIS_PASSWORD=MY_REDIS_PW`

<div class="callout">

Keep track of this password - it won't be visible again after deployment! More on `fly secrets`  [here](https://fly.io/docs/flyctl/secrets/).

</div>

## Deploy

`fly deploy`

If all goes well (check with `fly status`), the new Redis server app `my-fly-redis` will now accept connections from your organization's other apps on the private IPv6 network, on the standard port `6379`.

## Test the Redis server

You can test the app with `fly ssh console`. Your Fly.io organization must have a root SSH certificate [established](https://fly.io/docs/flyctl/ssh-establish/) in order to do this; check using `fly ssh log`.

Connect to `my-fly-redis`:

```cmd
fly ssh console -a my-fly-redis
```

```output
Connecting to top1.nearest.of.my-fly-redis.internal... complete
/ # redis-cli
```

Once in the `redis-cli`, authenticate. At that point you can run Redis commands interactively on the server.

```output
127.0.0.1:6379> auth MY_REDIS_PW
OK
127.0.0.1:6379> ping
PONG
```

## Configuration Options

By default the Redis image will set a `maxmemory` of 90% of the VM's available memory and use the `allkeys-lru`
eviction policy, which is a good choice for most use cases. You can set some alternative configurations
via environment variables by assigning them as secrets on your Redis app.

For example, to configure Redis not to evict any keys you can use:

```cmd
flyctl secrets set MAXMEMORY_POLICY="noeviction"
```

Or if you want to trade decreased performance for increased data loss protection by enabling the
`Append Only File` option, you can do:

```cmd
flyctl secrets set APPENDONLY="yes"
```

Check out the Redis docs for more info on [cache eviction policies](https://redis.io/topics/lru-cache) and
[persistence options](https://redis.io/topics/persistence).
