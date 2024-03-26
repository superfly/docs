---
title: Easy Clustering from Home to Fly.io
layout: framework_docs
order: 8
objective: Guide for connecting a locally running Elixir application to another application running on Fly.
author: mark
status: stable
categories:
  - elixir
references:
  - /elixir/the-basics/clustering
date: 2024-03-18
---

This explains how to cluster a locally running Elixir application with another Elixir application running on Fly.io. Additionally, a [**bash script** (named `cluster_with_remote`)](https://gist.github.com/brainlid/9e02e95f7d9c65a23312a4df95094d2a) is provided to automate the process of starting the local node and clustering it with the server.

Here we cover _why_ we might want to do this, _what_ is required to make it work, and _how_ to make it happen.

## Why cluster a local application with the one on the server?

Besides being really cool that we can do this, there are some practical reasons as well.

### AI/ML development

With a local Elixir application clustered to an application on Fly.io with a GPU attached, we can keep our local development workflow without having a large GPU in our development machine.

When we leverage [Nx](https://github.com/elixir-nx/nx) and [Bumblebee](https://github.com/elixir-nx/bumblebee), we can easily have the clustered application do all the GPU accelerated AI work and return the processing results seamlessly to our local application.

It really does feel like the GPU is local when we work this way.

### Develop and debug a distributed application

Building a globally distributed application can be challenging to model locally. With [Fly.io Regions](https://fly.io/docs/reference/regions/), we can deploy our cluster-aware application where it makes sense. Then, our local application joins the global cluster, giving us a close-up view of how the application behaves in a truly globally distributed environment.

## How it works

Elixir supports [clustering](https://fly.io/docs/elixir/the-basics/clustering/) multiple running Elixir applications together (thanks to [Erlang](https://www.erlang.org/doc/reference_manual/distributed.html)), even while running on separate machines.

Fly.io makes creating a [WireGuard VPN tunnel](https://fly.io/docs/networking/private-networking/#private-network-vpn) between your local machine and your Fly.io organization easy.

![Image showing an app inside a house connecting to a wire that plugs into a Fly balloon with a region abbreviation on it.](/docs/images/cluster-from-home-to-fly-app-1.png?center)

This means we can connect and cluster our locally running Elixir application with an Elixir application deployed at Fly.io. There are some special configuration requirements needed to make this possible, but we cover it all here.

### Prerequisites

There are a few prerequisites to consider when clustering a local Elixir application to one running in Fly.io. We'll provide tools or instructions to help with each.

1. A [WireGuard connection](https://fly.io/docs/networking/private-networking/#private-network-vpn) must be setup and open from your local machine to Fly.io
1. The same version of Elixir and Erlang OTP must be running on both ends.
1. The locally running Elixir application needs the Erlang COOKIE used on the server.
1. We need the full node name of the Elixir node running on the server (**NOTE:** The bash script provided later does this for you.)
1. The local Elixir application must be started with IPv6 networking support enabled. By default it does not.

### Setting the Erlang cookie

The [recommended way for setting the Erlang COOKIE](https://fly.io/docs/elixir/the-basics/clustering/#making-the-cookie-changes) value in your deployed application is to set an ENV named `RELEASE_COOKIE`. This gives the server a stable, predictable cookie value. In order for the nodes to connect, they need the same cookie.

When [set in the ENV through Fly.io](https://fly.io/docs/flyctl/config-env/), we can read it from the application's information. The script does this so we don't have to do anything else.

### Starting with IPv6 support

Fly.io uses an IPv6 network internally for private IPs. The BEAM needs IPv6 support to be enabled explicitly. On the server, that’s taken care of through a Dockerfile. Locally, however, it needs to be enabled so the local application can cluster with the remote node.

The issue is, if IPv6 support is enabled globally, like in a `.bashrc` file, then setting it in the `cluster_with_remote` script essentially flips it OFF. If NOT set globally, then it should be set in the script. Choose the approach that best fits your situation.

When set globally in your `.bashrc` file (recommended), it looks like this:

```
export ERL_AFLAGS="-kernel shell_history enabled -proto_dist inet6_tcp"
```

This one includes the added benefit of turning on shell history in IEx. Yay!

If not set globally, it can be set in the script command like this:

```
iex --erl "-proto_dist inet6_tcp" --sname local [...]
```

Where the `--erl "-proto_dist inet6_tcp"` portion is the key.

### Hidden by default: A note about production systems

Joining your local application to a production cluster in a public way may result in other application sending work, tasks, or executing processes in your local node, depending on the behavior of your specific application. This may not be what you want!

For this reason, the script uses the `--hidden` option to hide the local node from the rest of the cluster.

To see the **_all_** the connected nodes, including any hidden ones, use:

```elixir
Node.list(:hidden)
```

<div class="note icon">
If you want the local Elixir application to be _fully visible_ to the rest of the cluster, remove the `--hidden` argument in the bash script.
</div>

## Bash script file

Create [this file](https://gist.github.com/brainlid/9e02e95f7d9c65a23312a4df95094d2a) locally in your root of your Elixir project.

<style>
.gist table.lines {
 font-size: 12px;
}
.smallscript .gist-data {
 max-height: 350px;
}
.gist-meta {
 font-size: 80% !important;
}
</style>

<div class="smallscript">
  <script src="https://gist.github.com/brainlid/9e02e95f7d9c65a23312a4df95094d2a.js"></script>
</div>

Make the script file executable.

```
chmod +x cluster_with_remote
```

## Script usage

With the perquisites out of the way, we'll use the `cluster_with_remote` script to start our local Elixir application. The script automates much of what needs to be done to make the process work smoothly. Feel free to customize the script as needed.

The script is designed to be copied into a project with little to no modification required. The only expected customizations are handled through ENV values that can be controlled per-project.

There are two primary ways to use the script:

1. Cluster the local application to the same project deployed at Fly.io. This is the same application running in two places.
1. Cluster a local application to a difference project deployed at Fly.io.  The deployed application's name must be provided.

### Cluster to the same application running on the server

The simplest variation is when we cluster our local application to a deployed version of itself. The `fly.toml` file in the directory with a copy of the `cluster_with_remote` is for the deployed application.

To do this, just execute the script:

```
./cluster_with_remote
```

The script outputs if the clustering connection succeeded and prints the names of the connected nodes.

### Cluster to a different application running on the server

There are times when the local application is connecting to a _different_ application than where the script is running from.

To do this, we need to tell the script the Fly.io app name of the application we want to connect with. It can be done like this:

```
CLUSTER_APP_NAME=server-app-name ./cluster_with_remote
```

This can also be set as a project-specific ENV using a tool like [direnv](https://direnv.net/) or [dotenv](https://www.dotenv.org/). The custom app name to cluster with can be written to env file and then running the script just works.

```
./cluster_with_remote
```

If the Erlang cookie of the deployed application is not set using the recommended `RELEASE_COOKIE` ENV setting, it can still be provided to the script using a local ENV named `RELEASE_COOKIE`. See the script for details.

![Image showing an app inside a house connecting to a wire that plugs into a Fly balloon with a region abbreviation on it. There are three balloons in the sky and for different regions and they are connected by wires.](/docs/images/cluster-from-home-to-fly-app-2.png?center)

Now you're _really_ doing distributed Elixir!

## Summary

When we couple Elixir's clustering ability with Fly.io's networking, VPN, and API discoverability, we can easily cluster a locally running Elixir application with a deployed Elixir application. This makes it easy to leverage hosted GPUs for developing AI/ML applications or working on distributed applications.

The ready-to-use script automates much of the process.
