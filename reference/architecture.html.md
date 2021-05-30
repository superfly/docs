---
title: The Fly Architecture
layout: docs
sitemap: false
nav: firecracker
---

## _Fly Scaling_

Fly auto-scaling is designed to be simple and easy to understand. When more users connect to your app, we add CPUs and memory. By default, we allocate one CPU to the first 20 TCP connections, and an additional CPU for every subsequent 20 TCP connections.

You can customize the concurrency threshold per application. If you're running a simple proxy service, you might want to allow 100 connections per CPU. If you're doing heavy CPU work, it might be best to run 4 concurrent connections per CPU.

### MicroVMs

Application code runs in [Firecracker microVMs](https://github.com/firecracker-microvm/firecracker). These are lightweight, secure virtual machines based on strong hardware virtualization. Your workloads are safely isolated no matter where they’re running on our infrastructure.

MicroVMs provide strong hardware-virtualization-based security and workload isolation, this allows us to safely run applications from different customers on shared hardware.

We make a best-effort attempt to dedicate hardware resources to only one microVM at a time. CPU cores, for instance, should only ever be doing work for one microVM so your apps don't have to contend with `steal`.

The virtualized applications run on dedicated physical servers with 8-32 physical CPU cores and 32-256GB of RAM.

### Compute Scaling

MicroVMs each get a portion of a shared vCPU and 512MB of memory by default. We scale up and down by adding or removing application processes, each of which runs in their own microVM.

We use "concurrent connections" to determine microVM capacity. By default, we allocate one microVM per 20 concurrent connections. This is a reasonably good number for most apps, but it is configurable for apps with different needs.

When a client connects, we send them to the nearest microVM with capacity. If the existing VMs are at capacity, we [launch more](#auto-scaling) in the busiest regions. When there are idle VMs, we shut them off.

## _Fly Networking_

### BGP Anycast

We broadcast and accept traffic from ranges of IP addresses (both IPv4 and IPv6) in all our datacenters. When we receive a connection on one of those IPs, we match it back to an active customer application, and then proxy the TCP connection to the closest available microVM.

### Proxy

Every server in our infrastructure runs a Rust-based proxy named `fly-proxy`. The proxy is responsible for accepting client connections, matching them to customer applications, applying [handlers](/docs/services/#connection-handlers) (eg: TLS termination), and [backhaul](#backhaul) between servers.

### Backhaul

If you have users in Dallas, and an available MicroVM in Chicago, we will accept traffic in Dallas, terminate TLS (unless you've disabled that handler), and then connect to your MicroVM over a Wireguard tunnel between datacenters. Wireguard allows us to pass along almost any kind of network connection with very little additional latency.
