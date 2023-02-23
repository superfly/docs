---
title: "Fly.io: A New Public Cloud"
layout: docs
sitemap: false
nav: firecracker
---

<figure>
  <img src="/static/images/docs-intro.jpg" srcset="/static/images/docs-intro@2x.jpg 2x" alt="">
</figure>

We're doing something ambitious at Fly.io: a new public cloud, built on bare-metal servers we run in data centers around the world, designed to make it easy to deploy distributed and real-time apps close to your users, wherever they are.


<div class="callout">
Our *raison d'&ecirc;tre* is to deliver your applications to your users globally, with the highest possible availability and the lowest possible latency, with a great developer UX.
</div>

We want you to run your full stack close to users, whether it’s a simple web service or your database-backed opus with multiple supporting services. Check out our [persistent storage volumes](/docs/reference/volumes/) and [ready-to-run Postgres](/docs/reference/postgres/). Your organization's Fly.io apps can [talk to each other privately](/docs/reference/private-networking/) through our fast internal [WireGuard](https://www.wireguard.com/) network.

## Docker without Docker, with or without Docker

We upgrade [containers](/blog/docker-without-docker/) to full-fledged [Firecracker](https://firecracker-microvm.github.io/) microVMs. You *can* use a Dockerfile and our remote builders to build an image with your app and its environment. You can also point to a pre-built Docker image.

[In many cases](https://fly.io/docs/languages-and-frameworks/), you won't have to touch Docker; `fly launch` can scan your source code and configure your project for deployment on Fly.io, and our builders will build your app's Docker image when you deploy.


## flyctl: your CLI command center

`flyctl` is our command-line tool to facilitate app configuration, building, deployment and management. [It's the command center for your Fly.io apps.](/docs/flyctl/)

Creating and deploying an app on Fly.io is simple. You don't even have to type `flyctl` in full! 

Run `fly launch` to initialize an app. (Maybe) customize the generated [config file](https://fly.io/docs/reference/configuration/) that generates (perhaps to hook up some [metrics](/docs/reference/metrics/)). Run `fly deploy` to build and deploy.

That's the short version. And you do have to write your app, in the language of your choice, first. Although to try it out, you can use one of ours. [Here's one in Go.](/docs/getting-started/golang/)

`flyctl` can then help you manage your app's [deployment regions](/docs/reference/regions/), [scaling](/docs/reference/scaling/), and [secrets](/docs/reference/secrets/).

If you want to experience `flyctl` for yourself, you can go hands-on for free and [launch a VM on Fly](/docs/hands-on/start/).

If you just want to read about all the talents of `flyctl`, here's another link to its [documentation](/docs/flyctl/).
