---
title: Scaling and Autoscaling
layout: docs
sitemap: false
nav: firecracker
---

There are multiple dimensions of scaling on Fly.

* [Ensuring the application has instances running in one or more regions](#count-scaling)
* [Anchoring application instances using volumes in one or more regions](#anchor-scaling)
* [Increasing the CPU cores and memory size of application instances](#scaling-virtual-machines)
* [Alternate scaling models with autoscaling](#autoscaling)

## Regions and Scaling

Your Fly application runs on servers in a pool of regions, selected from our [available regions](/docs/reference/regions).  That pool, which [you can configure](/docs/flyctl/regions/), represents the regions your app _can_ be deployed in. 

When you deploy an application for the first time, we pick a first region to deploy in, and some backup regions. Our selections are simple:

* If you’re [turbo-charging a Heroku application](https://fly.io/heroku), we pick regions close to the Heroku application (currently, this means `iad` for US Heroku applications (howdy!), and `ams` for European applications (hallo!).
* Otherwise, we pick regions close to you, the human running the `flyctl` command.

You can confirm this by running `flyctl regions list`. 

```cmd
flyctl regions list
```
```output
Region Pool:
lhr
Backup Region:
ams
fra
```

The create command, in this case, was issued in the UK, so London (LHR-London Heathrow) is the closest region. 

### Backup Regions

Continuing our previous example: if for any reason your application can't be deployed in LHR, Fly will attempt to bring it up in either `ams` (Amsterdam) or `fra` (Frankfurt). Users won't notice this! They’re directed to the nearest running instance automatically. Backup Regions are selected based on the geographical closeness of the regions selected for your region pool.

### Modifying The Region Pool

You can build your own region pool easily.

* `flyctl regions add ord iad` adds `ord` and `iad` to your region pool. 
* `flyctl regions remove ord` removes `ord` from your region pool.

Both commands simply take a space-separated list of regions to add or remove. 

## Count Scaling

Now that we have control over where our application runs, we can talk about how many instances of your app are running. 

Your application has a “scale count”. The scale count defaults to 1, meaning 1 instance of your application runs on Fly, in one of the regions in your pool.

If you want to run more than 1 instance, change your scale count with the `flyctl scale count` command. `flyctl scale count 3` tells us to run 3 instances of your application.

When you bump up your scale count, we’ll place your app in different regions (based on your region pool). If there are three regions in the pool and the count is set to six, there will be two app instances in each region.

You can see your current scaling parameters with `flyctl scale show`.

```cmd
flyctl scale show
```
```output
        VM Size: shared-cpu-1x
      VM Memory: 512 MB
          Count: 4
```

This application uses the shared-cpu-1x (one shared CPU) VM size, with 512MB of RAM for each instance and there should be four instances created of it created.

## Anchor Scaling

Fly optimizes the placement of your app based on conditions on our network. But if you want finer-grained control over where your apps run, you can achieve that with [Fly volumes](/docs/reference/volumes/).

If your app is associated with Fly volume persistent storage, you can use them to anchor your app to specific regions.  So if you want three instances of an app in one region (say LHR), and one instance in another (say FRA), and the app looked for a volume named `example` you can:

* Create three volumes in LHR named `example`
* Create one volume in FRA named `example`
* Set the scale count to 4

When an app which has storage starts up, it looks for a volume with a particular name. We’ll place your app to fit your available volumes. In that way, volumes act as anchors that attach your app to specific regions in specific numbers.

## Scaling Virtual Machines

Each application instance on Fly runs in a virtual machine. The number of cores and amount of memory available in the virtual machine can be set for all application instances using the `flyctl scale vm` command.

### Viewing The Current VM Size

Using `flyctl scale vm` on its own will display the details of the application's current VM sizing.

```cmd
flyctl scale vm
```
```output
           Size: shared-cpu-1x
      CPU Cores: 1
         Memory: 256 MB
```

It shows the size name (`shared-cpu-1x`), number of CPUs, memory (in GB or MB).

### Viewing Available VM Sizes

The `flyctl platform vm-sizes` command will display the various sizes with cores and memory and current pricing:

```cmd
flyctl platform vm-sizes
```
```output
NAME             CPU CORES MEMORY 
shared-cpu-1x    1         256 MB 
dedicated-cpu-1x 1         2 GB   
dedicated-cpu-2x 2         4 GB   
dedicated-cpu-4x 4         8 GB   
dedicated-cpu-8x 8         16 GB  
```

The CPU Cores column shows how many vCPU cores will be allocated to the virtual machine. 

CPU Types are either shared or dedicated. In a nutshell: shared CPU instances run lighter-weight tasks, and can have up to 2GB of memory. Dedicated CPU instances handle more demanding applications and can scale to 64GB.

### Upgrading a VM

You can easily change the type of your VMs.  Just add the required size name to `fly scale vm` and we’ll take care of the rest. For example to go from `shared-cpu-1x` to `dedicated-cpu-1x` is:

```cmd
fly scale vm dedicated-cpu-1x
```
```output
Scaled VM size to dedicated-cpu-1x
      CPU Cores: 1
         Memory: 2 GB
```

### Adjusting a VM's memory

The `fly scale memory` command lets you directly set the VM memory allocation, in MB. For example, if we wanted our app to use 1GB of memory we'd run:

```cmd
fly scale memory 1024
```
```out
Scaled VM Memory size to 1 GB
      CPU Cores: 1
         Memory: 1 GB
```

You can also change the VM type and memory size at the same time. The `fly scale vm` command can take an additional memory flag which specifies the megabytes of RAM to be allocated to the VM. For example, if we wanted to allocate 4GB of RAM to our application and switch to a dedicated CPU option, we'd run:

```cmd
fly scale vm dedicated-cpu-1x --memory 4096
```
```output
Scaled VM size to dedicated-cpu-1x
      CPU Cores: 1
         Memory: 4 GB
```

### Viewing The Application's Scaled Status

To view where the instances of a Fly application are currently running, use `flyctl status`:

```cmd
flyctl status
```
```output
App
  Name     = hellofly
  Owner    = personal
  Version  = 318
  Status   = running
  Hostname = hellofly.fly.dev

Deployment Status
  ID          = 8c3137c2-94d2-5fb6-e1ff-d46608def053
  Version     = v318
  Status      = running
  Description = Deployment is running
  Instances   = 3 desired, 3 placed, 2 healthy, 0 unhealthy

Instances
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
a592ecf4 318     iad    run     running 1 total, 1 passing 0        1m7s ago
382dd4ce 318     lhr    run     running 1 total, 1 passing 0        1m33s ago
075c8c53 318     sjc    run     running 1 total, 1 passing 0        3m1s ago
```

## Autoscaling

Autoscaling is based on a pool of regions where the application can be run. Using a selected model, the system will then create at least the minimum number of application instances across those regions. The model will then be able to create instances up to the maximum count. The min and max are global parameters for the scaling. There are two scaling modes, Standard and Balanced.

* *Standard*: Instances of the application, up to the minimum count, are evenly distributed among the regions in the pool. They are not relocated in response to traffic. New instances are added where there is demand, up to the maximum count.

* *Balanced*: Instances of the application are, at first, evenly distributed among the regions in the pool up to the minimum count. Where traffic is high in a particular region, new instances will be created there and then, when the maximum count of instances has been used, instances will be moved from other regions to that region. This movement of instances is designed to balance the supply of compute power with demand for it.

* *Disabled*: By default, autoscaling is in Disabled mode and count-based scaling is in operation. You can turn autoscaling on by setting the autoscale mode to `standard` or `balanced` 

To determine what the current autoscale settings of an application are, run `flyctl autoscale show`:

```cmd
flyctl autoscale show
```
```output
     Scale Mode: Standard
      Min Count: 1
      Max Count: 10
```

This scaling plan sees a standard, even distribution on instances, with a minimum of 1 instance and up to 10 instances that can be created on-demand.

### Modifying The Autoscaling Plan

You can switch the plan by calling flyctl autoscale and then selecting disabled, balanced or standard.

```cmd
flyctl autoscale standard
```

The `balanced` and `standard` commands can take parameters that control the model, specifically `max` and `min`.

For example if you want to run at least three instances in a `balanced` model, but no more than ten, you would run:

```cmd
flyctl autoscale balanced min=3 max=10
```
```out
     Scale Mode: Balanced
      Min Count: 3
      Max Count: 10
```

And if you wanted to change that to a standard model with a minimum number of 5 instances, you would run:

```cmd
flyctl autoscale standard min=5
```
```out
     Scale Mode: Standard
      Min Count: 5
      Max Count: 10
```

The autoscale show command will display the rules that currently apply to the app:

```cmd
fly autoscale show
```
```out
     Scale Mode: Standard
      Min Count: 5
      Max Count: 10
```

You can continue to see your current scaling parameters using `flyctl scale show`.

```cmd
flyctl scale show
```
```out
VM Resources for hellofly
        VM Size: shared-cpu-1x
      VM Memory: 256 MB
          Count: 5
```

The count field here now shows the number of instances currently running.

You can also turn off autoscaling and return to the recommended count-scaling option by disabling autoscaling:

```cmd
flyctl autoscale disable
```
```out
     Scale Mode: Disabled
```