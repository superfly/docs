---
title: Run private apps with Flycast
layout: docs
sitemap: true
nav: guides
author: xe
categories:
  - networking
date: 2026-04-29
---

## Overview

A lot of the time your applications are made to be public and shared with the world. Sometimes you need to be more careful. When you deploy your apps on Fly.io, you get a private network for your organization. This lets your applications in other continents contact each other like they were in the same room.

Sometimes you need a middle ground between fully public apps and fully private apps. [Flycast](/docs/networking/flycast/) addresses are private but global IPv6 addresses inside your private network that go through the Fly Proxy, so you get all of the load management and Machine waking powers that you get for free with public apps.

This blueprint covers what Flycast is, when and why you’d want to use it, and shows you how to deploy a small private HTTP service that you can connect to over Flycast.

## What is Flycast?

Before we get started, let’s talk about Flycast and when you would want to use it. In general we can split every kind of Fly App into two categories: public apps and private apps.

A public app is what you’d expose to the public Internet for your users. These are usually hardened apps that allow users to do some things, but have access limitations that prevent them from stepping outside their bounds. These are mostly programs that listen over HTTP for browsers to interact with. Your users connect to a public app through the platform router via the .fly.dev domain or whatever other domain you’ve set up.

A private app is something internal, like a database server or a worker queue. These are things that run in the background and help you get things done, but are intentionally designed to NOT be exposed to the public Internet. You wouldn’t want to expose your Postgres or Valkey servers to anyone, would you?

However, with a fully private app, all connections go directly to the Machines via their .internal addresses, so you have to keep them running 24/7 to maintain connectivity. This is fine for services like database engines where you want them to be running all the time, but what about an admin panel? You want your admin panel to be separate from your main app so that users can ever get into it, even by accident, but you also want it to shut down when it’s not in use.

Flycast exists for this middle category of apps. With Flycast, your apps are only visible over your organization’s private network, but any traffic to them goes through the proxy so they can turn on when you need them and turn off when you don’t. This allows your administrative panels to be physically separate so that users can’t access them.

When you want to connect to an app via Flycast, you connect to `appname.flycast`.

### Security note

Just a heads-up. In general, it’s a bad idea to assume that network access barriers like Flycast or NAT are security layers. At best, this is an obfuscation layer that makes it more difficult for attackers to get into private applications. Flycast is not a replacement for authentication in your private applications. With Flycast, you don’t know _who_ a request is coming from, but you do know that it’s coming from _something_ or _someone_ in your private network.

One of the biggest platform features that uses Flycast out of the box is [Managed Postgres](/docs/mpg/). Even though Flycast addresses are local to your private network, Managed Postgres still configures usernames and passwords for your database.

## Goal

We'll show Flycast off by deploying a small HTTP service that's only reachable from inside your organization's private network. The classic example is an internal admin panel: a service you and your apps need to reach, but that should never be exposed to the public internet. Flycast also lets the platform turn the service off when nobody's using it, so you're not paying to keep an idle admin panel running.

For this walkthrough we'll use the public [`nginxdemos/hello`](https://hub.docker.com/r/nginxdemos/hello+external) image as a stand-in for any private HTTP service. It's a tiny container that responds to HTTP requests with the server's hostname and address, which makes it easy to confirm that traffic is reaching the right Machine over Flycast.

## Prerequisites

To get started, you need to do the following:

- [sign up or sign in](/docs/getting-started/sign-up-sign-in/) to Fly.io
- [install flyctl](/docs/flyctl/install/) (the Fly CLI)

If you want to interact with your Flycast apps from your computer, you’ll need to [jack into your private network with WireGuard](/docs/blueprints/connect-private-network-wireguard/).

## Steps

Create a new folder on your computer called `flycast-demo` and open a terminal in it. We don't need any source code for this walkthrough — we'll launch the app directly from a public Docker image with the `--flycast` flag, which tells Fly Launch to allocate a private IPv6 address instead of public ones:

```
fly launch --image nginxdemos/hello --flycast
```

The name you choose for your app will be the hostname you use to reach it over Flycast (`<appname>.flycast`). When `fly launch` asks if you want to tweak the settings, you can accept the defaults.

After deploy finishes, you can see the list of IP addresses associated to an app with `fly ips list`:

```
$ fly ips list
VERSION	IP                	TYPE   	REGION	CREATED AT
v6     	fdaa:3:9018:0:1::7	private	global	23h12m ago
```

Learn more about [Fly.io public, private, shared and dedicated IP addresses](/docs/reference/services/#ip-addresses).

This app only has one IP address: a private Flycast IPv6 address. If it had public IP addresses, it'd look like this:

```
$ fly ips list -a recipeficator
VERSION	IP                    	TYPE              	REGION	CREATED AT
v6     	2a09:8280:1::37:7312:0	public (dedicated)	global	May 30 2024 13:51
v4     	66.241.124.113        	public (shared)   	      	Jan 1 0001 00:00
```

Now that we've proven it's private, let’s open an interactive shell Machine to play around with Flycast. Create the shell Machine with `fly machine run`:

```
$ fly machine run --shell ubuntu
root@e784127b51e083:/#
```

The Ubuntu image we chose is very minimal, so we need to install a few tools such as ping, curl, and dig:

```
# apt update && apt install -y curl iputils-ping dnsutils
```

Say my app is named `flycast-demo`. Let’s look up its `.flycast` address with `nslookup flycast-demo.flycast`:

```
# nslookup flycast-demo.flycast
Server:		fdaa::3
Address:	fdaa::3#53

Name:	flycast-demo.flycast
Address: fdaa:3:9018:0:1::7
```

It matches that IP address from earlier. Now let’s see what happens when we ping it:

```
# ping flycast-demo.flycast -c2
PING flycast-demo.flycast (fdaa:3:9018:0:1::7) 56 data bytes
64 bytes from fdaa:3:9018:0:1::7: icmp_seq=1 ttl=63 time=0.138 ms
64 bytes from fdaa:3:9018:0:1::7: icmp_seq=2 ttl=63 time=0.223 ms

--- flycast-demo.flycast ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1009ms
rtt min/avg/max/mdev = 0.138/0.180/0.223/0.042 ms
```

Now let’s make a request to the app with curl:

```
# curl http://flycast-demo.flycast
```

You should get back an HTML page with the server's hostname and address. Wait a few moments so your app goes to sleep, then run the `time` command to see how long the first request takes:

```
# time curl -o /dev/null -s http://flycast-demo.flycast
real	0m2.411s
user	0m0.003s
sys		0m0.003s
```

It took a couple of seconds for the platform to wake the Machine up and make sure it was ready for your request. The next request is a lot faster:

```
# time curl -o /dev/null -s http://flycast-demo.flycast
real	0m0.043s
user	0m0.003s
sys		0m0.003s
```

And if you wait a few moments, it’ll spin back down.

And there we go! We’ve covered what Flycast is, why you’d want to use it, and walked through deploying a private HTTP service to show it off. The same pattern works for any internal app: admin panels, internal APIs, dashboards, or anything else you'd rather keep off the public internet.

## Related reading

- [Autostart and autostop private apps](/docs/blueprints/autostart-internal-apps/)
- [Flycast — private Fly.io services](/docs/networking/flycast/)
- [Private networking](/docs/networking/private-networking/)
