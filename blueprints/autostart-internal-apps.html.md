---
title: Autostart and autostop private apps
layout: docs
nav: firecracker
---

You have a private, or internal, app that communicates only with other apps on your [private network](/docs/networking/private-networking/). This private app might be a database, authentication server, or any other "backend" app that you don't want exposed to the public Internet. You want the app's Machines to stop when they're not serving requests from your other apps, and start again automatically when needed.

To use Fly Proxy autostop/autostart you need to configure services in `fly.toml`, like you would for a public app. But instead of using a public Anycast address, you assign a Flycast address to expose those services only on your private network.

This blueprint focuses on using autostop/autostart to control Machines based on incoming requests. But when you use Flycast for private apps you also get other [Fly Proxy features](/docs/reference/fly-proxy/) like geographically aware load balancing.

Learn more about [Flycast](/docs/networking/flycast/).

## Create a new private app with a Flycast address

When you run `fly launch` to create a new app, it automatically assigns your app a public IPv6 address and a shared public IPv4 address. If you know your app won't need to be reachable from the Internet, you can inform Fly Launch to assign a Flycast private IPv6 address instead:

```
fly launch --flycast
```

Next steps: [Configure and deploy a private app](#configure-and-deploy-a-private-app).

## Use Flycast for an existing app

If you already have an app and you want to make it private and use Flycast, it's important to make sure you remove the app's public IP addresses.

### Add a Flycast address

```
fly ips allocate-v6 --private
```

### Remove public IP addresses

List your IPs to check whether your app has public IP addresses:

```
fly ips list
```

Example output:

```
VERSION	IP                  	TYPE              	REGION	CREATED AT
v6     	2a09:8280:1::2d:1111	public (dedicated)	global	Sep 1 2023 19:47
v6     	fdaa:2:45b:0:1::11  	private           	global	Mar 16 2024 18:20
v4     	66.241.124.11       	public (shared)   	      	Jan 1 0001 00:00
```

This example app has public IPv4 and IPv6 addresses. These public addresses are automatically assigned to an app with services on the first deploy.

Copy the public IP addresses and run the `fly ips release` command to remove them from your app:

```
fly ips release <ip address> <ip address> ...
```

For example:

```
fly ips release 2a09:8280:1::2d:1111 66.241.124.11
```

Next steps: [Configure and deploy a private app](#configure-and-deploy-a-private-app) below.

## Configure and deploy a private app

Whether you're creating a new app or making an existing app private, there are a few things you'll need to check or configure.

### Add services in your `fly.toml` config file

If your app was private, you might not have configured an `[http_services]` or `[services]` section in `fly.toml` because you didn't want it reachable through the public Internet. Now that you removed the public IPs, you can safely add services to allow access to the app on your private network and enable Fly Proxy to control Machines and load balance traffic.

Here's an example `fly.toml` snippet:

```toml
[http_service]
  # the port on which your app receives requests over the 6PN
  internal_port = 8081
  # must be false - Flycast is http-only
  force_https = false
  # Fly Proxy stops Machines based on traffic
  auto_stop_machines = "stop"
  # Fly Proxy starts Machines based on traffic
  auto_start_machines = true
  # Number of Machines to keep running in primary region
  min_machines_running = 0
  [http_service.concurrency]
    type = "requests"
    # Fly Proxy uses this limit to determine Machine excess capacity
    soft_limit = 250
```

<div class="important icon">
**Important:** Set `force_https = false`; Flycast only works over HTTP. HTTPS isn't necessary because all your private network traffic goes through encrypted WireGuard tunnels.
</div>

Learn more about [app configuration](/docs/reference/configuration/) and [Fly Proxy autostop/autostart](/docs/launch/autostop-autostart/).

### Make sure your app binds to `0.0.0.0:<port>`

To be reachable by Fly Proxy, an app needs to listen on `0.0.0.0` and bind to the `internal_port` defined in the `fly.toml` configuration file.

### Deploy the app 

Run `fly deploy` for the configuration changes to take effect.

Other apps in your organization can now reach your private app using the [Flycast](/docs/networking/flycast/) IP address or the `<appname>.flycast` domain.

## Read more

We've talked about Flycast in some past blog posts:

- [Deploy Your Own (Not) Midjourney Bot on Fly GPUs](https://fly.io/blog/not-midjourney-bot/)

- [Scaling Large Language Models to zero with Ollama](https://fly.io/blog/scaling-llm-ollama/)
