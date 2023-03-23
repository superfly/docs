---
title: Volumes
layout: docs
sitemap: false
nav: firecracker
---

Volumes are local persistent storage for [Fly Machines](/docs/machines/). They allow an app to save its state, preserving configuration, session or user data, and be restarted with that information in place.

A Fly Volume is a slice of an NVMe drive on the physical server your Fly App runs on. It is tied to that hardware.

<div class="callout">
**The first rule of Fly Volumes is: Always run at least two of them per application.** If you don't, at some point you'll have downtime.
</div>

Fly Volumes are a lot like the disk inside your laptop, with the speed and simplicity advantage of being attached to your motherboard and accessible from a mount point in your file system. And the disadvantages that come with being tied to that hardware, too.

**Things to consider before settling on volume storage:**

* You'll need to run as many volumes as there are Machines.
* There's a one-to-one mapping between VMs and volumes. You can't share a volume between apps, nor can two VMs mount the same volume at the same time. A single VM can only mount one volume at a time.
* Volumes are independent of one another; Fly.io does not automatically replicate data among the volumes on an app, so if you need the volumes to sync up, your app has to make that happen.
* If your app needs a volume to function, and the NVMe drive hosting your volume fails, that instance of your app goes down. There's no way around that. 
* If you only have a single copy of your data on a single Fly Volume, and that drive fails, data is lost. Fly.io takes daily snapshots, retained for 5 days, but these are meant as a backstop, not your primary backup method.

Explore further options for data storage in [Databases & Storage](/docs/database-storage-guides/).

## Fly Volumes and flyctl

Volumes are managed using the [`fly volumes`](/docs/flyctl/volumes/) command. 

<div class="callout">`fly volumes` is aliased to `fly volume` and `fly vol` for convenience.</div>

## Creating Volumes

Create a volume for an app using `fly volumes create`. The default volume size is 3GB. See [`fly volumes create`](/docs/flyctl/volumes-create/) in the [flyctl reference](/docs/flyctl) for usage and options.

The following command creates a new volume named "myapp_data" with 40GB of storage in the lhr (London Heathrow) region, for the application whose `fly.toml` file is in the working directory. To specify a different app, use the `-a` or `--app` flag.

```cmd
fly volumes create myapp_data --region lhr --size 40
```
```out
        ID: Qn1Ln6nBZOz0lHM268OZ
      Name: myapp_data
    Region: lhr
   Size GB: 40
 Encrypted: true
Created at: 04 Jan 21 10:14 UTC
```

Volumes are, by default, created with encryption-at-rest enabled for additional protection of the data on the volume. Use `--no-encryption` to instead create an unencrypted volume for improved performance at deployment and runtime.

Volumes are bound to both apps and regions. A volume is directly associated with only one app and exists in only one region. No other app can see this volume and only an instance of the app running in the LHR region can access it.

Most people use volumes for databases, so for high availability, we default to putting each of your app's volumes on different hardware (equivalent to using `--require-unique-zone=true` with `fly volumes create`). This setting does limit the number of volumes your app can have in a region.

When you create a volume, its region is added to the apps region pool to allow app instances to be started with it.

## Using Volumes

In the `fly.toml` for the app, there should be a section that mounts a volume into the app, like so:

```
[mounts]
source="myapp_data"
destination="/data"
```

This would make `myapp_data` appear under the `/data` directory of the application. With this present, if an app instance is started and cannot find an unused volume named `myapp_data`, it will not be started and the system will look elsewhere in the region pool to start the app instance. 

Also, if you have specified a mounts section in `fly.toml` and forgotten to create a volume, your deployment will fail. 

There can be multiple volumes of the same volume name in a region. Each volume has a unique ID to distinguish itself from others to allow for this. This allows multiple instances of an app to run in one region. Creating three volumes named `myapp_data` would let up to three instances of the app start up and run.

## Listing Volumes

You can [get a list of all volumes created for an app](https://fly.io/docs/flyctl/volumes-list/) using the sub-command `list`. 

```cmd
fly volumes list
```
```out
ID                   Name       Size Region Created At

Onk6nLnV7yzR9H93wl5O myapp_data 40GB iad    38 minutes ago
x7K57J7klmq14UgY0lG7 myapp_data 40GB lhr    39 minutes ago
Qn1Ln6nBZOz0lHM268OZ myapp_data 40GB lhr    1 hour ago
```

The unique ID can be used in commands that reference a specific volume, such as the `show` or `delete` sub-command. For example, the `show` command can display the details for a particular volume:

```cmd
fly volumes show Qn1Ln6nBZOz0lHM268OZ
```
```out
        ID: Qn1Ln6nBZOz0lHM268OZ
      Name: myapp_data
    Region: lhr
   Size GB: 40
 Encrypted: true
Created at: 04 Jan 21 10:14 UTC
```

## Extending Volumes

[Volumes can be extended](https://fly.io/docs/flyctl/volumes-extend/), but cannot be made smaller. To make a volume larger, find its ID with `fly volumes list`, then use:

```cmd
fly volumes extend <volume-id> -s <new-size>
```

where `<new-size>` is the desired size in GB. 

The VM using the target volume will have to be restarted in order to allow the file system to be resized. For "normal" apps, this will happen automatically; [Machines VMs](/docs/reference/machines/) will have to be restarted explicitly.

## Snapshots and Restores

We take daily block-level snapshots of volumes. Snapshots are kept for five days. [Find the snapshots belonging to your target volume](https://fly.io/docs/flyctl/volumes-snapshots-list/) with `fly volumes snapshots list <volume-id>`:


```cmd
fly volumes snapshots list vol_wod56vjyd6pvny30
```
```out
Snapshots
ID                 	SIZE    	CREATED AT
vs_MgLAggLZkYx89fLy	17638389	1 hour ago
vs_1KRgwpDqZ2ll5tx 	17649006	1 day ago
vs_nymJyYMwXpjxqTzJ	17677766	2 days ago
vs_R3OPAz5jBqzogF16	17689473	3 days ago
vs_pZlGZvq3gkAlAcaZ	17655830	4 days ago
vs_A9k6age3bQov6twj	17631880	5 days ago
```

Restoring from the snapshot to a new volume is a matter of:

```cmd
fly volumes create <volume-name> --snapshot-id <snapshot-id> -s <volume-size> [-a <app-name>]
```

A volume snapshot can be restored into a volume that's the same size as, or larger than, the source volume, but not a smaller one. If you don't specify a size with the `-s` flag, `fly volumes create` will request a 3GB volume. 

```cmd
fly volumes create pg_data --snapshot-id vs_0Gvz2kBKJ28Mph4y -a cat-pg
```
```out
? Select region: Chennai (Madras), India (maa)
        ID: vol_mjn924o9l3q403lq
      Name: pg_data
       App: cat-pg
    Region: maa
      Zone: 180d
   Size GB: 3
 Encrypted: true
Created at: 02 Aug 22 21:27 UTC
```

The `flyctl` output shows the details of the new volume, including its size.

## Deleting Volumes

The `delete` sub-command allows you to delete a specific volume.

```cmd
fly volumes delete vol_2n0l9vlnklpr635d -a myapp
```
```out
Deleting a volume is not reversible.
? Are you sure you want to delete this volume? Yes
Deleted volume vol_2n0l9vlnklpr635d from myapp
```
