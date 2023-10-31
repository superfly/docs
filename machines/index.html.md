---
title: "Fly Machines"
layout: framework_docs_overview
toc: false
redirect_from: /docs/reference/machines/
---

Fly Machines are:

* [The engine](https://fly.io/blog/fly-machines/) behind the Fly.io platform: super-fast lightweight VMs that,
  once created, can be started and stopped at subsecond speeds. 

* [A REST API](/docs/machines/working-with-machines/) you can use for precise control over groups of Machines to deploy
  and scale out applications. 

<section class="warning icon">
**This is a low-level interface**.

Use Fly Machines directly when you need to be picky about how, where, and when to start VMs on Fly.io. For most
applications, most of the time, you don't need to be picky! You scale things up to more cores or more memory, and
out to more regions and more VM counts. [Fly Apps](/docs/apps) does all that for you with simple syntax. 

🌶️ **But some applications get spicy.**🌶️ This is our spicy interface! We use it to build the orchestration
for `fly launch`, but you can use it however you'd like. 
</section>

## Concepts

### Machines

A Machine is the configuration and state for a single VM running on our platform. Every Machine will belong to a Fly App; Apps 
can have more than one Machine. You can start a Machine right now, without configuring anything: 

```cmd
$ fly machine run --shell
```

```output
? Select Organization: (personal)
Searching for image 'ubuntu' remotely...
Image size: 30 MB

Success! A machine has been successfully launched in app flyctl-interactive-shells-g1b7jg6wpdbq0i8b8yrl4q9rlqu5pm-502673
 Machine ID: d8d9510a295118
Connecting to fdaa:1:18:a7b:191:1aa9:a2a5:2... complete
root@d8d9510a295118:/# uname -a
Linux d8d9510a295118 5.15.98-fly #gf0950f1d7c SMP Sun Sep 17 02:33:12 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
```

Go ahead and try it! When you `run` a Machine with `--shell`, we'll make a small one, and we'll tear it down when you're done poking around.

### Machine State

The big Fly Machine trick is: starting up super fast; like, "in response to an HTTP request from a user" fast. Doing things like 
that is why you'd use Fly Machines directly, rather than a [Fly App](https://fly.io/docs/apps/deploy/). 

To get your head around that trick, start by understanding the lifecycle of a Fly Machine:

1. You create a Fly Machine with a [Create Machine request](https://docs.machines.dev/swagger/index.html#/Machines/Machines_create), or 
   with `fly machine create`. The Machine is in `created` state. This step can take some time: you're asking us to reserve space
   for your Machine, and then fetch your container from our global registry, and build a root file system; low double digit seconds, maybe. 
   
2. Now that the Fly Machine exists, you can start it with a [Start Machine request](https://docs.machines.dev/swagger/index.html#/Machines/Machines_start), or 
   with `fly machine start`. We boot a VM. The Machine is in `started` state. It's running. You can talk to it. This happens fast! Everything's
   already assembled; we're just booting. Usually this takes _well under a second_.
   
3. You're done with the Fly Machine, so you stop it with a [Stop Machine request](https://docs.machines.dev/swagger/index.html#/Machines/Machines_stop), or
  `fly machine stop`. The VM shuts down. The Machine is in `stopped` state. Its components are still assembled on our worker host, ready to start back up; if
   you want to do that, `GOTO 2`. 
   
4. You're tired of the Fly Machine, and want it to go away. Send a [Delete Machine request](https://docs.machines.dev/swagger/index.html#/Machines/Machines_delete), or 
   use `fly machine destroy`. We clear the resources we were holding for the Machine off our server. You can easily create and start
   a new Machine from the same image, but it'll be slower than stopping and starting an existing Machine. 

Here's [more detail on using flyctl to manage individual Machines](/docs/machines/guides-examples/machines-app-using-flyctl/).

### Scaling Machines

<div class="border border-blue-600 bg-blue-50 rounded-l p-4 my-4 text-base text-navy">
Remember, the ordinary way to scale an application on Fly.io is to use [Fly Apps](/docs/apps), which offer convenient
commands to scale instances out or up. Here, we're going to scale Machines directly, in a fiddly way.
<br><br>
Whether or not you use `fly launch` to boot up a Fly App, every Machine belongs to an "App" (an "App" is ultimately just a named 
collection of resources, configuration, and routing rules). But you don't have to use the `fly apps` commands to manage Machines;
you can do it directly.
</div>

Scale a workload out horizontally with `fly machine clone`:

```cmd
$ fly machine clone -a my-app --region ord 7811373c095228
```

```output
Cloning machine 7811373c095228 into region ord
Provisioning a new machine with image registry-1.docker.io/my-app/sleep:latest@sha256:597c3e
  Machine 28749edf4047d8 has been created...
  Waiting for machine 28749edf4047d8 to start...
Machine has been successfully cloned!
```
   
You can clone a specific Machine as many times as you like, into specific regions; you can manage each of those Machines
individually with `flyctl machines stop` and `flyctl machines start`.

Scale a Machine up vertically with `fly machine update`:

```cmd
$ fly machine update -a my-app --vm-memory 512M 7811373c095228
```

```output
Configuration changes to be applied to machine: 7811373c095228 (twilight-field-6033)

  	... // 12 identical lines
  	    "cpu_kind": "shared",
  	    "cpus": 1,
- 	    "memory_mb": 256
+ 	    "memory_mb": 512
  	  },
  	  "dns": {}
  	}
  	
? Apply changes? Yes
Updating machine 7811373c095228
No health checks found
Machine 7811373c095228 updated successfully!
```

Updating a Machine takes it down (like with `fly machine stop`), applies configuration changes, and brings it back up. If you're
not changing the image, so we don't have to go fetch it from the global registry, this is fast, for the same reason `stop` and `start`
are; we've already done the heavy lifting. 

### Placement

When you `create`, `run`, or `clone` a Machine, you can pick a Fly.io region to place it in. Our API will contact the Machines API
server (we call it `flaps`, but you don't have to care), which will in turn reach out to all the worker servers we have in the region, 
find out which ones have the requisite resources to host the Machine, and try to make a smart choice about which of those servers to 
put the Machine in.

You don't get to pick particular servers (there are ways to cheat and do it anyways, but you shouldn't want to), just the region. 

If you pick a particular region, like `ord` or `yyz`, we will _only_ create the Machine in that region. 

<section class="warning icon">
**Placement can fail!** It shouldn't happen often, but we can run out of capacity in particular regions. Both flyctl and the Fly Machines 
API are best-effort. If you're working with us at this level of control, it's on you to retry requests and ensure they go through. In exchange for
that burden, we try to make sure the Fly Machines API is responsive, so you get quick answers.
</section>

## Recapping Machine Features

1. They can be managed by API
1. They turn off automatically when a program exits
1. They can be started very quickly
1. Restarted machines are a blank slate - they are ephemeral
1. They can be started manually, but can also wake on network access
1. You can run multiple machines within an application
