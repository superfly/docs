---
title: Volumes
layout: docs
sitemap: false
nav: firecracker
---

Volumes offer persistent storage for Fly apps. Volumes can be mounted in a Fly app and they appear as a directory. Applications can then write to files in that directory and those files will persist beyond the app being shutdown or restarted.

This allows an app to save its state, preserving configuration, session or user data and be restarted with that information in place.

Volumes are managed using the [**`fly volumes`**](/docs/flyctl/volumes/) command.

## Creating Volumes

Volumes can be created for an App using the sub-command `create`, such as:

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

This command creates a new volume named "myapp_data" with 40GB of storage in the lhr (London Heathrow) region for the current application. 

The results from the command shows when the volume was created and its encryption status. Volumes are, by default, created with encryption-at-rest enabled for additional protection of the data on the volume. Use `--encrypted=false` to not encrypt the volume for improved performance at deployment and runtime.

Volumes are bound to both apps and regions. A volume is directly associated with only one app and exists in only one region. No other app can see this volume and only an instance of the app running in the LHR region can access it.

When creating a volume, the region specified is added to the apps region pool to allow app instances to be started with it.

## Using Volumes

In the `fly.toml` for the app, there should be a section that mounts a volume into the app, like so:

```
[mounts]
source="myapp_data"
destination="/data"
```

This would make `myapp_data` appear under the `/data` directory of the application. With this present, if an app instance is started and cannot find an unused volume named `myapp_data`, it will not be started and the system will look elsewhere in the region pool to start the app instance. 

Also, if you have specified a mounts section in `fly.toml` and forgotten to create a volume, your deployment will fail. 

There can be multiple volumes of the same volume name in a region. Each volume has a unique ID to distinguish itself from others to allow for this. This allows multiple instances of an app to run in one region; creating three volumes named `myapp_data` would let up to three instances of the app to start up and run. A fourth instance would find no volume to attach to and the system would look elsewhere to start it up.

## Listing Volumes

You can get a list of all volumes created for an app using the sub-command `list`. 

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

## Deleting Volumes

The `delete` sub-command allows you to delete a specific volume.

```cmd
fly volumes delete vwKLw4w09BPoef06laL3
```
```out
Deleted volume Qn1Ln6nBZOz0lHM268OZ from myapp
```




