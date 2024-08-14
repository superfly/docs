---
title: Connect to an App Service
layout: docs
nav: firecracker
redirect_from: 
  - /docs/getting-started/app-services/
---

<figure>
  <img src="/static/images/docs-servers.webp" alt="">
</figure>

There are two basic ways to talk to a process running in your Fly Machine: 

1. Via Fly Proxy, the Fly.io component that handles load balancing&mdash;this is what you'll need for any public web service
2. Over the WireGuard [IPv6 private network ("6PN")](/docs/networking/private-networking/) that the app belongs to&mdash;this can be useful for, e.g., providing private supporting services to your Fly Apps

## TL;DR

Here's a cheat sheet for configuring apps to be reachable by each of these means:

| &nbsp; |Fly Proxy|Internal (6PN)|
|---|---|---|
|Bind to | `0.0.0.0:<port>` ([<u>not UDP</u>](#udp-is-special)) | `fly-local-6pn:<port>`|
|Needs `services` or<br>`http_service` in config? | YES | NO |
|App needs an IP? | YES ([<u>not for Fly-Replay</u>](#a-note-on-fly-app-ips-and-fly-replay-routing))| NO |

There's a bit more to the whole picture, which is why the rest of this document exists.

## Services Routed with Fly Proxy

All services reachable from the public internet via a Fly App's global Anycast address are routed by Fly Proxy.

Fly Proxy can load-balance requests for both public and private ([Flycast](/docs/networking/flycast)) services among a Fly App's VMs. Routing to a service with Fly Proxy also enables other Fly Proxy features, such as [automatically starting and stopping Machines](/docs/launch/autostop-autostart/) in response to fluctuations in request traffic.

### Get the service listening on the right address within the VM

Fly Proxy reaches services through a private IPv4 address on each VM, so the process should listen on `0.0.0.0:<port>` (but see [A note on IPv4 and IPv6 wildcards](#a-note-on-ipv4-and-ipv6-wildcards)).

#### UDP is special
UDP services have to listen at a different specific address, `fly-global-services`, on their VM, due to how our UDP proxying logic works.

### Configure the service for Fly Proxy to reach it

#### Public apps

Define a [service](/docs/reference/configuration/#the-http_service-section) in `fly.toml` (or in the case of standalone Machines that don't belong to Fly Launch, in individual Machine configs), making sure the `internal_port` on the service definition is the same port the process is bound to inside the VM. Without this config, Fly Proxy isn't aware of the service and can't route to it.

#### Private (Flycast) apps

Configure a service as for a public app, but in addition: [Flycast](/docs/networking/flycast/) doesn't do HTTPS, so make sure you've defined a non-HTTPS service, and also ensure that `force_https = true` is **not** included in any HTTP service definition.

### Allocate a public or private IP to the app

#### Public apps

To have Fly Proxy route requests to an app from the public internet, provision at least one public Anycast IP for the app. An app with HTTP and HTTPS services defined is allocated public IPs automatically on the first run of `fly deploy`; you can confirm with `fly ips list`.

#### Private (Flycast) apps

To have Fly Proxy load-balance among VMs on a non-public app, [allocate a _private_ (Flycast) IPv6 address](/docs/networking/flycast/) using `fly ips allocate-v6 --private`, and **remove any public IPs from the app** using `fly ips release <address>`. A Flycast IP can only be reached from within the private network it's allocated on, which must belong to the same Fly Organization as the Fly App it points to. 

<section class="warning icon">
If your configuration includes any services for Fly Proxy to route to, and the app has a public IP, that service is exposed to the whole internet.</section>

### A note on Fly App IPs and Fly-Replay routing

App-wide IP addresses (public and private) tell Fly Proxy which app to deliver a request to. If a service _only_ needs to be reachable by Fly Proxy in its handling of the [Fly-Replay](/docs/networking/dynamic-request-routing/) response header, its app does not need an IP; app information is incorporated directly in the header.

## Private services on 6PN (direct WireGuard connections)

If you don't need load balancing or other Fly Proxy features, you (or one of your apps) can connect directly on a VM's 6PN address (i.e., its address on its IPv6 private WireGuard network).

<section class="callout">By default, all of an organization's Fly Apps live on the same private network, but you can create apps on different private networks to isolate them from one another. You'd want to do this if you run separate apps for your customers, for example.</section>

### Get the service listening on the right address within the VM

Each VM has the hostname `fly-local-6pn` mapped to its own 6PN address in its `/etc/hosts` file, so to make a service reachable over the private network, bind it to `fly-local-6pn:<port>`. Binding to a port on the IPv6 wildcard "address" (`[::]:<port>`) also works (but see [A note on IPv4 and IPv6 wildcards](#a-note-on-ipv4-and-ipv6-wildcards)). 

That's it, really. There's no need to define any service in `fly.toml`, and there's no need to provision any IPs for the app.

If your service works publicly but can't be reached directly over WireGuard, the problem may be that it's not listening on IPv6.

### Fly.io internal DNS and 6PN addresses 

Fly.io runs a specialized internal DNS service to find 6PN addresses for VMs. Queries on the various `.internal` names return either AAAA records for 6PN addresses, or a TXT record with information about your app, your network, or your Machines. 

Internal DNS gives us some useful presets for targeting requests. For instance, a DNS query on the address `<region>.<appname>.internal` yields the 6PN addresses of the VMs of app `<appname>` in region `<region>`. Addressing a request to `<region>.<appname>.internal` gets it delivered to one of those VMs.

Our [private networking docs](https://fly.io/docs/networking/private-networking/#fly-io-internal-addresses) list the `.internal` names and what kind of information a DNS query returns for each.

## A note on IPv4 and IPv6 wildcards

Services to be routed to using Fly Proxy need to bind to IPv4 addresses, and services to be reached over 6PN need to bind to IPv6, as described above. However, you may find that your service works even if you haven't used the addresses we specified. IPv4-mapped IPv6 addresses, if enabled on the VM, can allow IPv4 (and thus Fly Proxy) connections to a service bound on `[::]`. Further, the wildcard syntax `[::]` or `0.0.0.0` sometimes covers both IPv4 and IPv6, depending on the language, library, or application. 

## Troubleshoot connections to a service


### Connect to the process from inside the VM

You may want to make sure the process is doing what you think it is, inside the VM. If you should have a service running internally, you can try connecting to it with cURL from within the VM (use `fly ssh console` to pop a shell; see note [2] below the tables). If your app's Docker image doesn't have `curl` installed, you can install it; it'll be wiped away next time the VM is restarted (e.g. on the next `fly deploy`).

A HEAD request (`curl -I`) should be enough to see if you're getting a response:

```cmd
# curl -I http://localhost:80
```
```out
HTTP/1.1 200 OK
Server: nginx/1.23.4
Date: Tue, 02 May 2023 20:32:32 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Tue, 28 Mar 2023 15:01:54 GMT
Connection: keep-alive
ETag: "64230162-267"
Accept-Ranges: bytes

```

That `200 OK` means the service (nginx) is running, and listening on port 80 as anticipated.

You can further check that the right HTML is being served, with `curl http://localhost:<port>` (leaving out the `-I`).

cURL is a useful tool for checking that a service is reachable where it should be. Here are some further tests that may help with understanding networking issues. We'll carry on with the example of an HTTP app.

### Connect to Public or Flycast services

|Check that the service is |From | Use |
|---|---|---|
|Listening on the expected<br>address and port [1] | within the VM [2]| `curl -I http://0.0.0.0:<port>` [3] |
|Reachable by Anycast [4] | anywhere | `curl -I https://<app-name>.fly.dev:443`<br>or<br>`curl -IL http://<app-name>.fly.dev:80` [5]|
|Reachable by Flycast [6]| within the<br>Flycast IP's 6PN [7]| `curl -I http://<app-name>.flycast:80`<br>or<br>`curl -I 'http://[<app-flycast-ip>]:80'`|


### Connect to Private 6PN services

|Check that the service is |From | Use |
|---|---|---|
|Listening on the expected<br> address and port [8] | within the VM [2]| `curl -I http://fly-local-6pn:<port>` |
|Reachable on the app<br>via internal DNS | within the app's 6PN | `curl -I http://<app-name>.internal:<port>` |
|Reachable on a<br>particular VM | within the app's 6PN | `curl -I 'http://[<vm-6pn-address>]:<port>'`|

[1] If this fails (i.e. you don't get the expected response from the service), then either (a) the service isn't functioning the way you expect (b) it's not bound to the port you pointed cURL at, or (&#99;) it's not bound to the IPv4 address Fly Proxy uses to reach the VM, and so Fly Proxy won't be able to route to it.

[2] Pull up an interactive shell on a VM that should be running this service, with `fly ssh console`. Don't use the `fly console` command; this brings up an ephemeral VM from the app's Docker image, but doesn't start up the same process(es), so your service won't be running there.

[3] [Except UDP services.](#udp-is-special) 

[4] If this fails, but the local check succeeded, the next thing to confirm is that the app or Machine config includes a properly configured `services` or `http_service` section, with `internal_port` matching `<port>` used in this test.

[5] The HTTP URL always elicits a 301 redirect, because the Fly Proxy upgrades HTTP connections to HTTPS. To get cURL to follow the redirect to see if there's anything there, use the `-L` flag. This example has the services configured to handle HTTP and HTTPS requests on the conventional ports 80 and 443 respectively; if you're using different ports, substitute those in.

[6] If the check within the VM succeeded, but this step fails, check everything in note [5], plus: Ensure that there's an HTTP service configured and `force_https` is not set to `true`; Flycast doesn't work over HTTPS.

[7] A Flycast IP [can be allocated](/docs/networking/flycast) on a different private network from the app it points to, if both networks belong to the same org. This lets your apps reach your service in a different 6PN, if the service is configured to be available over Flycast.

[8] If this fails (i.e. you don't get the expected response from the service), then either (a) the service isn't functioning the way you expect, (b) it's not bound to the port you pointed cURL at, or (&#99;) it's not bound to its 6PN address, and won't be reachable via the private WireGuard network (including at `.internal` addresses).

