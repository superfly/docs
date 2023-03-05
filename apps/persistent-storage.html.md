---
title: Persistent Storage for Fly Apps
layout: docs
nav: firecracker
titlecase: false
order: 30
---

Running apps can store ephemeral data on the root file systems of their member Machines, but a Machine's file system is rebuilt from scratch each time the app is deployed or the Machine is restarted.

A [Fly Volume](/docs/reference/volumes/) is a slice of NVMe disk storage attached to the server that hosts your Machine, so if your app needs a volume on every Machine, you'll need to run as many volumes as there are Machines. 

A volume has to exist at the time of Machine creation in order to be mounted. A Machine that uses a volume can only be created in a region that has an existing unattached volume.

## Launch an app with a Fly Volume

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

Create the volume for the app, with the name you chose, in the same region you're deploying the app to:

```cmd
fly volumes create myapp_data --region lhr --size 1 --app myapp
```

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

Explore options for data storage in [Databases & Storage](/docs/database-storage-guides/)