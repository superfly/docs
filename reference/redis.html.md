---
title: Redis on Fly
layout: docs
sitemap: false
nav: firecracker
---


<div class="callout">
The limited, "built-in" Redis caching that was previously known as *Fly Redis* is deprecated. We recommend running Redis as a standard Fly.io app.
</div>

[Redis](https://redis.io) is a versatile key/value database. This guide explains how to run it as a Fly.io app in a single region, with persistent storage. It will only be visible to apps in the same deployment organization.

## Quick setup

Run these commands to get a Redis instance with persistent storage running in a single [region](/docs/reference/regions/).

Create a directory and create a new app. Be sure to replace `my-redis` with a custom name. When prompted, pick a region and a Fly organization.

```
mkdir redis
cd redis
fly launch --image flyio/redis:6.2.6 --no-deploy --name my-redis
```

Add a 1GB storage volume (or larger) and attach it to your app in `fly.toml`. Pick the same region as before!

```
fly volumes create redis_server --size 1
cat >> fly.toml <<TOML
  [[mounts]]
    destination = "/data"
    source = "redis_server"
TOML
```

Set a password on your Redis instance. A password must be set **before** deploying.

```
fly secrets set REDIS_PASSWORD=yoursecretpassword
```
<div class="callout">

Keep track of this password - it won't be visible again after deployment! More on `fly secrets`  [here](https://fly.io/docs/flyctl/secrets/).

</div>

Now remove the contents of the default `[[services]]` block in `fly.toml` (leaving the `[[services]]` header). This ensures your Redis VM is not visible from the public internet.

Finally, deploy Redis!

```cmd
fly deploy
```

Check that things are running correctly.

```cmd
fly status
```

Your Redis instance should be available from any other app in the same organization at this URL:

`redis://default:yoursecretpassword@my-redis.internal:6379`

## Test the Redis server

You can login to your Redis instance with `fly ssh console` to test the deployment.

```cmd
fly ssh console -a my-redis
```

```output
Connecting to top1.nearest.of.my-fly-redis.internal... complete
/ # redis-cli
```

Once in the `redis-cli`, authenticate with your password. Then you can Redis commands interactively on the server.

```output
127.0.0.1:6379> auth yoursecretpassword
OK
127.0.0.1:6379> ping
PONG
```

## Configuration Options

By default the Redis image will set a `maxmemory` of 90% of the VM's available memory and use the `allkeys-lru`
eviction policy, which is a good choice for most use cases, such a caching. You can change these settings by [assigning environment variables in `fly.toml`](/docs/reference/configuration/#the-env-variables-section) or by setting [secrets](/docs/reference/secrets/).

For example, to configure Redis *not to evict any keys* you can use:

```cmd
flyctl secrets set MAXMEMORY_POLICY="noeviction"
```

Or, if you want to trade decreased performance for increased data loss protection by enabling the
`Append Only File` option:

```cmd
flyctl secrets set APPENDONLY="yes"
```

Check out the Redis docs for more info on [cache eviction policies](https://redis.io/topics/lru-cache) and
[persistence options](https://redis.io/topics/persistence).

## More Details

`fly launch` creates the application and sets it up for deployment using our official Redis Docker image.

Adding a [persistent storage volume](https://fly.io/docs/reference/volumes/) is optional. If you skip this step, data will be lost across deploys or restarts. The volume needs to be in the same region as the Redis app instance.

Other apps within the same organization can still access the Redis server over the Fly.io [private network](https://fly.io/docs/reference/private-networking/) from *any region* as long as they share the same organization.

Volumes will pin your Redis instance to the volume region. Without volumes, apps can be deployed to [backup regions](/docs/reference/scaling/#backup-regions) in certain cases. If you have a client app that accesses Redis, ensure it stays in the same region as Redis by setting the primary and backup regions to the same values:

```
fly regions set lax -a myapp
fly regions backup lax -a myapp
```
