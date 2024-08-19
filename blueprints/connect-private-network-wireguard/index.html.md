---
title: Jack into your private network with WireGuard
layout: docs
sitemap: true
nav: firecracker
author: xe
categories:
  - networking
date: 2024-06-14
---

<center><iframe width="600" height="315" src="https://www.youtube-nocookie.com/embed/4NcvlIlIlso?si=DPbDPwzlRTQFx0hB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center><br />

Every [Fly.io](http://Fly.io) organization comes with a [private network](https://fly.io/docs/networking/private-networking/) that lets all your apps connect to each other. This is super convenient when you need to have microservices call each other’s endpoints or use [Flycast](/docs/networking/flycast/) to let your private apps turn off when you’re not using them. However, this isn’t just limited to your apps. You can jack into this network with WireGuard.

This blueprint shows you how to create a WireGuard peer to your private network and connect to it so that you can access it from anywhere.

## Prerequisites

To get started, you need to have the following:

- A [fly.io](http://fly.io) account
- `flyctl` installed (https://fly.io/docs/hands-on/install-flyctl/)
- The [WireGuard client](https://www.wireguard.com/install/) installed

## Steps

To create a WireGuard peer, you need the following information:

- The organization you want to create the peer in, such as your personal organization.
- The [Fly.io region](/docs/reference/regions/) that’s closest to you.
- The name of the peer, such as your computer’s hostname.
- A filename to save the configuration to.

```
$ fly wg create --help
Add a WireGuard peer connection to an organization

Usage:
  fly wireguard create [org] [region] [name] [file] [flags]
```

You can figure out your list of organizations with `fly orgs list`:

```
$ fly orgs list
Name                 Slug                 Type
----                 ----                 ----
Xe Iaso              personal             PERSONAL
devrel-demos         devrel-demos         SHARED
```

You can figure out which region is nearest you with `fly platform regions` or by checking the [regions page](https://fly.io/docs/reference/regions/) in the documentation:

```
$ fly platform regions
```

With all this in mind, let’s assemble the command. Each of these steps is going to build up the command, but don't hit enter until it's all done.

Start with the base command `fly wireguard create`:

```
$ fly wireguard create
```

I want to create this in my personal organization, so I’ll enter in personal for the organization name.

```
$ fly wireguard create personal
```

I’m in Ottawa, so I’m using the Montreal region `yul`.

```
$ fly wireguard create personal yul
```

My computer’s hostname is Camellia, so I’ll use that as the peer name.

```
$ fly wireguard create personal yul camellia
```

Finally I want to save this as camellia.conf so that WireGuard can load it.

```
$ fly wireguard create personal yul camellia camellia.conf
```

Then run the command (you can hit enter now), and once it’s done open up the WireGuard app.

Import the tunnel from the configuration file and then turn it on. macOS may prompt if you want the WireGuard app to manage VPN connections. If it does, hit accept, otherwise you won’t be able to get into your network.

<video width="886" height="574" controls autoplay loop style="margin-bottom: 2rem;">
  <source src="./wireguard-activate.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

The above video shows how you import a WireGuard config on macOS. Here's a summary of the steps:

- Click on the "Import tunnel(s) from file" button.
- Select the configuration file you saved earlier.
- Click on the "Activate" button.
- macOS will ask you if you want to allow the WireGuard app to manage VPN connections. Click "Allow" if you trust it.

On a Linux system you can use [wg-quick](https://www.man7.org/linux/man-pages/man8/wg-quick.8.html+external):

```sh
wg-quick up camellia.conf
```

To test the connection, ping `_api.internal` (on macOS you need to run `ping6 _api.internal` because it's an IPv6 address):

```
$ ping6 _api.internal -c4
PING6(56=40+8+8 bytes) fdaa:3:9018:a7b:9285:0:a:602 --> fdaa:3:9018::3
16 bytes from fdaa:3:9018::3, icmp_seq=0 hlim=64 time=9.741 ms
16 bytes from fdaa:3:9018::3, icmp_seq=1 hlim=64 time=49.103 ms
16 bytes from fdaa:3:9018::3, icmp_seq=2 hlim=64 time=97.667 ms
16 bytes from fdaa:3:9018::3, icmp_seq=3 hlim=64 time=14.726 ms

--- _api.internal ping6 statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/std-dev = 9.741/42.809/97.667/35.111 ms
```

To test the connection with an instance of [Ollama](https://ollama.com), you can fire it up with the following commands in an empty folder (don't forget to delete it after!):

```
fly launch --from https://github.com/fly-apps/ollama-demo --no-deploy
fly ips allocate-v6 --private
fly deploy
```

Then you can set the `OLLAMA_HOSTNAME` environment variable to the hostname of the instance you just created (it will be something like `xe-ollama.flycast`), and then run the following commands:

```
export OLLAMA_HOST=http://xe-ollama.flycast
ollama run llama3 "Why is the sky blue? Explain in a single sentence."
```

And then the model will reply with something like this:

> The sky appears blue because of a phenomenon called Rayleigh scattering, where shorter wavelengths of light (like blue and violet) are scattered more than longer wavelengths (like red and orange) by tiny molecules of gases like nitrogen and oxygen in the Earth's atmosphere.

And there you go! You're in your private network and can access all your apps and Machines like they were right next to you.
