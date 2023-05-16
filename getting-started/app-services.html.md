---
title: Reach a Service on your App
layout: docs
sitemap: false
nav: firecracker
---

There are two basic ways to talk to a process running in your Fly.io VM: 

1. Via Fly Proxy, the Fly.io component that handles load balancing
2. Over the private WireGuard network (_6PN_) that the app belongs to 

## TL:DR

Here's a cheat sheet for configuring apps to be reachable by each of these means:

||Fly Proxy|Internal (6PN)|
|---|---|---|
|Bind to | `0.0.0.0:<port>` | `fly-local-6pn:<port>`|
|Configure services? | YES | NO |
|App needs an IP? | YES (generally)| NO |

## Services Routed with Fly Proxy

Fly Proxy can load-balance requests for both public and private services among a Fly App's VMs. Routing to a service with Fly Proxy enables other Fly Proxy features, such as starting and stopping Machines in response to fluctuations in request traffic.

### Get the service listening on the right address within the VM

Fly Proxy reaches services through a private IPv4 address on each VM, so the process should listen on `0.0.0.0:<port>` (but see [A note on IPv4 and IPv6 wildcards](#a-note-on-ipv4-and-ipv6-wildcards)).

### Configure the service for Fly Proxy

Define a service in `fly.toml` (or in the case of non-App-platform Machines, in individual Machine configs), making sure the `internal_port` on the service definition is the same port the process is bound to inside the VM. Without this config, Fly Proxy isn't aware of the service and can't route to it.

### Allocate a public or private IP to the app

#### Public apps

To have Fly Proxy route requests to an app from the public internet, provision at least one public Anycast IP for the app. An app with HTTP and HTTPS services defined is allocated public IPs automatically on the first run of `fly deploy`; you can confirm with `fly ips list`.

#### Private apps

To have Fly Proxy load-balance among VMs on a non-public app, allocate a _private_ (Flycast) IPv6 address using `fly ips allocate-v6 --private`, and **remove any public IPs from the app** using `fly ips release`. Flycast IPs can only be reached from within the app's private WireGuard network. 

<section class="warning icon">
If your configuration includes any services for Fly Proxy to route to, and the app has a public IP, that service is exposed to the whole internet.</section>

<section class="callout"> App-wide IP addresses (public and private) tell Fly Proxy which app to deliver a request to. If a service _only_ needs to be reachable by Fly Proxy in its handling of the Fly-Replay response header, its app does not need an IP; app information is incorporated directly in the header.</section>

## Private services on 6PN (direct WireGuard connections)

If you don't need load balancing or other Fly Proxy features, you (or one of your apps) can connect directly on a VM's 6PN address: its address on its IPv6 private WireGuard network.

<section class="callout">By default, all of an organization's Fly Apps live on the same private network, but you can set up multiple private networks to isolate apps from one another. You'd want to do this if you run separate apps for your customers, for example.</section>

### Get the service listening on the right address within the VM

Each VM has the hostname `fly-local-6pn` mapped to its own 6PN address in its `/etc/hosts` file, so to make a service reachable over the private network, bind it to `fly-local-6pn:<port>`. Binding to a port on the IPv6 wildcard "address" (`[::]:<port>`) also works (but see [A note on IPv4 and IPv6 wildcards](#a-note-on-ipv4-and-ipv6-wildcards)). 

That's it, really. There's no need to define any service in `fly.toml`, and there's no need to provision any IPs for the app.

If your service works publicly but can't be reached directly over WireGuard, the problem may be that it's not listening on IPv6.

### Finding a 6PN address 

Fly.io runs a specialized internal DNS service to find 6PN addresses for VMs. Queries on the various `.internal` names return either AAAA records for 6PN addresses, or a TXT record with information about your app, your network, or your Machines. 

Internal DNS gives us some useful presets for targeting requests. For instance, a DNS query on the address `<region>.<appname>.internal` yields the 6PN addresses of the VMs of app `<appname>` in region `<region>`. Addressing a request to `<region>.<appname>.internal` gets it delivered to one of those VMs.

Our [private networking docs](https://fly.io/docs/reference/private-networking/#fly-internal-addresses) list the `.internal` names and what kind of information a DNS query returns for each.

## A note on IPv4 and IPv6 wildcards

Services to be routed to using Fly Proxy need to bind to IPv4, and services to be reached over 6PN need to bind to IPv6, as described above. However, the strictness of `[::]` or `0.0.0.0` to IPv6 or IPv4 may vary by language, library, or application. IPv4 mapping, if enabled on the VM, can also allow Fly Proxy to reach a service bound to a port on `[::]`.


* I thought our DNS did round-robin rotations but I can't see any evidence that it does.
* It looks like `fly-global-services` is an IPv4 address; can a UDP service just listen on `0.0.0.0`?