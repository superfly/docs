---
title: Persistent Storage for Fly Apps
layout: docs
nav: firecracker
titlecase: false
order: 30
---

Apps can store ephemeral data on the root file systems of their member Machines, but this data will be deleted each time the app is deployed or the Machine is restarted.

Fly Volumes are slices of NVMe disk storage attached to the server your app's Machine runs on. 

## Using Volumes in a Fly App

If your app needs a volume attached, you'll have to provision one volume for each VM. Volumes are independent of one another; Fly.io does not automatically replicate data among the volumes on an app.

### To launch a new app with a volume

A volume has to exist at the time of Machine creation in order for it to be mounted. The Machine has to be created on the server that also hosts the volume.

* launch but don't deploy. Make sure there's a mounts section in fly.toml.
* create the volume
* deploy

In the `fly.toml` for the app, there should be a section that mounts a volume into the app, like so:

```
[mounts]
source="myapp_data"
destination="/data"
```

When a Fly App is deployed with this configuration file, the data from a volume named `myapp_data` appears under the `/data` directory of the application. With this present, if an app instance is started and cannot find an unused volume named `myapp_data`, it will not be started and the system will look elsewhere in the region pool to start the app instance. 

Also, if you have specified a mounts section in `fly.toml` and forgotten to create a volume, your deployment will fail. 
 Creating three volumes named `myapp_data` would let up to three instances of the app start up and run.

## Listing Volumes

You can [get a list of all volumes created for an app](https://fly.io/docs/flyctl/volumes-list/) using the sub-command `list`. 

```cmd
fly volumes list
```
```out
ID                      STATE   NAME          SIZE    REGION  ZONE    ENCRYPTED       ATTACHED VM     CREATED AT    
vol_xme149kke8ovowpl    created myapp_data    1GB     iad     7806    true                            2 minutes ago
vol_od56vjpp95mvny30    created myapp_data    1GB     lhr     79f0    true                            2 minutes ago
vol_kgj54500d3qry2wz    created myapp_data    1GB     yyz     acc6    true                            9 minutes ago
```



Explore options for data storage in [Databases & Storage](/docs/database-storage-guides/)