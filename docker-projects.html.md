---
title: You Should Run Your Side-Project Docker Containers On Fly.io
layout: docs
sitemap: false
nav: firecracker
toc: false
---

Of course, we would say that. But you don’t even have to read this; you can [just try us out](https://fly.io/docs/speedrun/): **your container can be up and running on Fly.io in under 10 minutes**.

Here's Fly.io in a nutshell: we take Docker containers and transform them into fleets of Firecracker micro-vms (but, of course, you can just run a single one), running on our own hardware in racks around the world. Containers running on Fly are automatically linked to a global Anycast CDN, so traffic is directed to your closest instance.

If you’ve been frustrated trying to stand up a miniature Kubernetes cluster, or writing Terraform for ECS, you’re going to like our developer UX. Our users drive Fly.io with `flyctl`, an open-source Golang CLI. If you’ve got a working Docker container locally, and you’ve installed `flyctl` and signed up, booting up a new app is just a single command: `flyctl launch`. 

Here’s what you won’t need to do:
* Set up your own Docker registry.
* Figure out Helm charts.
* Use K8s CNIs to get private secure networking.
* Set up load balancers.
* Explicitly provision machines.
* Figure out where to store Terraform state files.

Fly’s network fabric is built on IPv6 and WireGuard, Jason Donenfeld’s amazing lightweight modern VPN protocol. Containers running on Fly are automatically connected to a private network, and it’s easy to tell Fly to build a WireGuard tunnel to your dev workstation, and to generate a WireGuard configuration (`flyctl wireguard create`). But you don’t even have to do that: you can run `flyctl ssh console` and we’ll [generate a WireGuard tunnel for you](https://fly.io/blog/ssh-and-user-mode-ip-wireguard/), on the fly, entirely in (unprivileged) userland, with a TCP/IP stack embedded in `flyctl`; you’ll have a shell on your container without ever thinking about how our network works.

You’ll probably want to let people on the Internet talk to your application. To do that, you’ll edit the `fly.toml` we generated when you launched your application, and tell us about the ports you want to expose. For instance:

```
[[services]]
internal_port = 8080
protocol = "tcp"

[[services.ports]]
handlers = ["http"]
port = "80"

[[services.ports]]
handlers = ["tls", "http"]
port = "443"
```

You can see what this is doing just by looking it at; just know that you can expose lots of ports this way, and that you can pipe raw TCP and UDP packets directly to your application this way as well. Fly is a great way to quickly stand up a DNS server!

There’s a bunch of features we’ve built on Fly that we think are super interesting. You don’t have to care about any of them; we are happy to stay out of your way and just run your containers for you. But, if you’re interested, you can also:

* `flyctl scale count 10` to run 10 instances of your application, spread over a pool of regions. 
* `flyctl regions set ams syd` to run your application in Amsterdam and Sydney.
* `flyctl scale vm dedicated-cpu-8x` to run your container on a bigger slice of compute.
* `flyctl volumes create` to create persistent block devices to attach to your containers to store files on.
* `flyctl domains` to register and manage domains for your application (you can, of course, just use whichever DNS service you’re already using).
* `flyctl certs add` to attach a LetsEncrypt TLS certificate to your application. 
* `flyctl postgres create` to stand up a Postgres cluster with a single write master and read replicas in whichever regions you want them in.

I can keep going; if you run multiple apps on Fly, they can reach each other over a private IPv6 network with private DNS, so Fly is a super easy way to boot up a cluster of anything. Attach new routable IPv4 and IPv6 addresses to your container. You can autoscale. Pass secrets to your application. Collect logs. We’ll even collect Prometheus metrics from your applications and index them, so you can just point your Grafana at us and observe your app running. 

But you don’t have to care about any of this! If you’re reading this because we just dropped into your TL on Twitter with a link, all we really want to say is: Fly’s a super easy way to run a Docker container on the Internet. 

