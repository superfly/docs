---
title: Persistent Storage for Fly Apps
layout: docs
nav: firecracker
titlecase: false
order: 30
---

Running apps can store ephemeral data on the root file systems of their member Machines, but a Machine's file system is rebuilt from scratch each time the app is deployed or the Machine is restarted.


## Choosing an approach to storage

Often the solution to persistent data storage is to connect your Fly App to a separate [database or object store](/docs/database-storage-guides/).

Fly.io offers a [deploy-it-yourself Postgres app](/docs/postgres/) with some tools to make it easier to manage yourself.

If you need hardware-local disk storage on your Fly App VMs&mdash;for example, if your Fly App _is_ a database (or if you want to use [LiteFS](/docs/litefs))&mdash;you'll want to use [Fly Volumes](/docs/reference/volumes/).

A Fly Volume is a slice of NVMe disk storage attached to the server that hosts your Machine. This has pros and cons, and you should look at the [Fly Volumes](/docs/reference/volumes/) page before deciding that this is the best solution for your use case.

<div class="callout">
**The TLDC (too lazy, didn't click) of that is:** Volume storage attached to your app's worker is a lot like the disk inside your laptop. It's fast and convenient to use, right there in your app's file system. Also like your laptop, an app with a single Machine and a single volume does not have high availability built in. **Hardware fails. You should run at least two Machines per app, and if you're using volumes, that means two volumes. You will experience downtime at some point if you only create one.**
</div>

Explore further options for data storage in [Databases & Storage](/docs/database-storage-guides/).

Fly Postgres has [its own usage docs](/docs/postgres/), so here we'll focus on using Fly Volumes with your app.

## Launch an app with a Fly Volume

The first rule of Fly Volumes is always run at least two of them per application, so that's what we'll do here. Volumes don't sync up by themselves; different apps will have their own ways of dealing with this so we won't get into that here.

### Launch, but don't deploy immediately.

```cmd
fly launch 
```
```out
...
Wrote config file fly.toml
? Would you like to deploy now? No
Your app is ready! Deploy with `flyctl deploy`
```

### Configure the app to mount the volume

Make sure there's a `[mounts]` section in `fly.toml`. As an example, the following configures the app to expose data from a volume named `myapp_data` under the `/data` directory of the application.

```toml
[mounts]
source="myapp_data"
destination="/data"
```

### Provision the volume

Create a volume for the app, with the name you chose, in the same region you're deploying the app to:

```cmd
fly volumes create myapp_data --region lhr --size 1 --app myapp
```

Now create the second volume. If you're OK with downtime

### Deploy the app

```cmd
fly deploy 
```

### Confirm the volume is mounted

After deployment, you can check on all the volumes in your app using `fly volumes list`. The `ATTACHED VM` column lets you know which Machine, if any, the volume is mounted on.

```cmd
fly volumes list
```
```out
ID                      STATE   NAME    SIZE    REGION  ZONE    ENCRYPTED       ATTACHED VM     CREATED AT     
vol_n0l9vlppld84635d    created data    1GB     lhr     b6a7    true            9080e694c64787  1 minute ago 
```

## Remove a volume from an app

To remove a volume from a Fly App, delete the `mounts` section in `fly.toml` and `fly deploy` for a new release with this updated configuration. The volume will no longer be mounted on the file systems of the app's Machines.

If you are done with the volume (or volumes, if there's more than one), **and you no longer need the data stored there**, you can delete each volume using `fly volume delete <vol-id>`. You'll continue to be charged for volumes you've provisioned even if they're not being used by any VMs.