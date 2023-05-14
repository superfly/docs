---
title: Connect to your app
layout: docs
sitemap: false
nav: firecracker
---

There are various ways to connect to a process running in a Fly.io VM. 

## Public apps

If your app is reachable by everyone via a Fly.io hostname, it's routed by Fly Proxy, our load balancing multi-tool. Public web apps fall under this category.

To set up a service that Fly Proxy can expose publicly 

* have the app process listen on 0.0.0.0:<port> 
* define a service in `fly.toml`, making sure the `internal_port` on the service definition is the same port the process is listening on in the VM
* provision public IP addresses for the app


## Private apps with load balancing

An app can use Fly Proxy features privately, too, via a feature called Flycast. A Flycast address is a private IPv6 address that belongs to an app 

* have the app process listen on 0.0.0.0:<port>
* define a service in `fly.toml`, making sure the `internal_port` on the service definition is the same port the process is listening on in the VM
* provision a _private_ Flycast IP for the app




|Purpose |Where to listen |Reasoning |
|---|---|---|
|Public services | `0.0.0.0:<port>`  or `[::]:<port>`| Fly Proxy talks to VMs on a private IPv4 address, whether the end user connected via IPv4 or IPv6. So web apps with public services defined can always just bind to `0.0.0.0` . <br><br>`[::]` may also work, depending on whether IPv4 mapping is enabled in the VM. |
|Private services over Flycast | `0.0.0.0:<port>` or `[::]:<port>` | Same argument. 
|Private services over 6PN | `[::]:<port>` or `fly-local-6pn:<port>` | A service that works publicly might not work over the WireGuard network, because many apps bind to `0.0.0.0` and 6PN addresses are IPv6. <br><br>`fly-local-6pn` is the hostname each VM has in its `/etc/hosts` file for its own 6PN address. |
|UDP services | `fly-global-services:<port>` | Because: Fly UDP proxying logic |


