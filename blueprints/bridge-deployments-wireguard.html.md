---
title: Bridge your other deployments to Fly.io
layout: docs
sitemap: true
nav: firecracker
author: xe
categories:
  - networking
date: 2024-05-27
---

Sometimes you can recreate production on Fly.io without any issues. Other times you need to be able to incrementally move things over. Fly.io [has private networking](https://fly.io/docs/networking/private-networking/) by default for apps in the same organization, but you can also easily connect your existing external servers to this private network. This lets you use your private network as a way to incrementally move services over.

Say you have an existing service on AWS or a database with RDS that needs to be accessed over RDS. You can use that AWS instance to pivot traffic from your Fly Machines to those other services. You can also go the other way and access your Fly apps (such as [an instance of Ollama](https://fly.io/blog/scaling-llm-ollama/)) from AWS, your laptop, or any other self-hosted server you have in your arsenal. Or maybe you're making a tool for a support team, and it needs to hit that one database on prem.

Fly.io private networks use [WireGuard](https://www.wireguard.com/) internally, and when you connect other computers to that network, you do connect to them over WireGuard. WireGuard is used by many people for many reasons, but the primary use is a "site-to-site" VPN like this. This won't route all of your traffic through Fly.io's gateway servers, but it will give you internal access to your private network from anywhere.

## Weaving the networks together

Make sure you have [WireGuard](https://www.wireguard.com/install/) installed on your target server. Their [install page](https://www.wireguard.com/install/) has more details, but on an Ubuntu server all you need to do is:

```docker
sudo apt -y install wireguard
```

Once that's done, you're off to the races!

On your laptop, make the config for the target server with `fly wireguard create`. You'll need the following information:

- The organization you want to join that server to (such as `personal`, or your company's name).
- The region you want to create the peer in: you should choose [the closest region to the target computer](https://fly.io/docs/reference/regions/).
  - If you're really not sure which region is the closest, here's a magic command you can try: `curl -Iso /dev/null -w '%header{fly-request-id}' https://fly.io | cut -d- -f2`.
- The name you want to use for that computer on your Fly network, such as the hostname.
- A path to put the generated WireGuard config, such as `~/fly0.conf` to drop it as `fly0.conf` in your home directory.

For example, I'm going to create a peer in my personal organization for my server named `phantoon`. I live in Ottawa, so the closest datacenter to me is `yyz`. The command to create my peer will look like this:

```docker
fly wireguard create personal yyz phantoon ~/fly0.conf
```

The `fly0.conf` file contains all the configuration WireGuard needs to set up a tunnel, namely:

- The private key for the node
- The local IPv6 address the node should use
- The DNS server for your private network
- Addresses, IP ranges, and public keys for the WireGuard gateway

Copy `fly0.conf` to `/etc/wireguard` on the target computer:

```docker
scp ~/fly0.conf root@phantoon.local:/etc/wireguard/fly0.conf
```

Then connect to the computer (likely over SSH) and enable WireGuard to start on boot:

```docker
ssh root@phantoon.local
systemctl enable --now wg-quick@fly0.service
```

This will create an interface named `fly0`:

```docker
$ ip addr show fly0
4: fly0: <POINTOPOINT,NOARP,UP,LOWER_UP> mtu 1420 qdisc noqueue state UNKNOWN group default qlen 1000
    link/none
    inet6 fdaa:0:641b:a7b:9285:0:a:1b02/120 scope global
       valid_lft forever preferred_lft forever
```

Now try to ping the Machines API server `_api.internal`:

```docker
$ ping _api.internal -c 4
PING _api.internal (fdaa:0:641b::3) 56 data bytes
64 bytes from fdaa:0:641b::3: icmp_seq=1 ttl=64 time=10.4 ms
64 bytes from fdaa:0:641b::3: icmp_seq=2 ttl=64 time=39.2 ms
64 bytes from fdaa:0:641b::3: icmp_seq=3 ttl=64 time=83.7 ms
64 bytes from fdaa:0:641b::3: icmp_seq=4 ttl=64 time=123 ms
```

This means that you can successfully query any [`.internal` addresses](/docs/networking/private-networking/#fly-io-internal-dns) for apps and Machines in your organization. Congrats, you're in!

## Accessing workloads outside of your private network

To access a workload outside of your private network (such as a secret store), use the DNS name `peername._peer.internal`. For example, to access the node `phantoon` from your Fly apps, connect to `phantoon._peer.internal`:

```docker
$ ping phantoon._peer.internal
PING phantoon._peer.internal (fdaa:0:641b:a7b:9285:0:a:1b02) 56 data bytes
64 bytes from phantoon._peer.internal (fdaa:0:641b:a7b:9285:0:a:1b02): icmp_seq=1 ttl=62 time=24.4 ms
64 bytes from phantoon._peer.internal (fdaa:0:641b:a7b:9285:0:a:1b02): icmp_seq=2 ttl=62 time=37.6 ms
64 bytes from phantoon._peer.internal (fdaa:0:641b:a7b:9285:0:a:1b02): icmp_seq=3 ttl=62 time=85.4 ms
64 bytes from phantoon._peer.internal (fdaa:0:641b:a7b:9285:0:a:1b02): icmp_seq=4 ttl=62 time=197 ms
```

## Homework

Getting ping working should be good enough to get you started, but here's some optional homework in case you want to see what you can really do with this:

- Connect your laptop/workstation to your private network with the same flow (you may need to install the GUI WireGuard app if you use Windows or macOS).
- Expose Prometheus metrics on port 9195 of your app and then grab the current metrics with `curl yourapp.internal:9195/metrics` on your laptop.
- Install Postgres on your laptop somehow. Configure your app to connect to that Postgres database on your laptop over WireGuard.
- Connect a few other computers to your private network. Install a Minecraft server on one of them and play together.

Hint: you may need to allow private network addresses through your firewall. Check the documentation of your firewall tool of choice and allow traffic from `fly0` through as if it's an "internal" interface.
