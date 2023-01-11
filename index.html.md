---
title: The Fly Global Application Platform
layout: docs
sitemap: false
nav: firecracker
---

<figure>
  <img src="/static/images/docs-intro.jpg" srcset="/static/images/docs-intro@2x.jpg 2x" alt="">
</figure>

Fly.io is a global application distribution platform. We run your code in [Firecracker](https://firecracker-microvm.github.io/) microVMs around the world.


<div class="callout">
Our *raison d'&ecirc;tre* is to deliver your applications to your users globally, with the highest possible availability and the lowest possible latency, with a great developer UX.
</div>

We want you to run your full stack close to users, whether it’s a simple web service or your database-backed opus with multiple supporting services. Check out our [persistent storage volumes](/docs/reference/volumes/) and [ready-to-run Postgres](/docs/reference/postgres/). Your organization's Fly.io apps can [talk to each other privately](/docs/reference/private-networking/) through our fast internal [WireGuard](https://www.wireguard.com/) network.

## Docker without Docker, with or without Docker

One thing to know: Docker images ([OCI container images](/blog/docker-without-docker/)) are how we give Firecracker your app to make into a microVM. That means you *can* use Docker to build the container image with your app and its environment. You can also point to a pre-built image.

In many cases, you won't have to touch Docker; we can scan your source code and detect which [pre-existing buildpack](https://fly.io/docs/reference/builders/#buildpacks) matches the configuration you need, and our remote builder will build your app container image on deploy.

<div class="callout">
If you have an app running on [Heroku](https://www.heroku.com/), you may be interested in our quick-and-easy [**Turboku web launcher**](https://fly.io/launch/heroku) to deploy it on Fly.io too. [**Read more here**](https://fly.io/blog/new-turboku/).
</div>

More on [builders](/docs/reference/builders).

## Happiness on the CLI

`flyctl` is our command-line tool to facilitate app configuration, building, deployment and management. [It's the command center for your Fly.io apps.](/docs/flyctl/)

Creating and deploying an app on Fly.io is simple. You don't even have to type `flyctl` in full! 

Run `fly launch` to initialize an app. (Maybe) customize the generated [config file](https://fly.io/docs/reference/configuration/) that generates (perhaps to hook up some [metrics](/docs/reference/metrics/)). Run `fly deploy` to build and deploy.

That's the short version. And you do have to write your app, in the language of your choice, first. Although to try it out, you can use one of ours. [Here's one in Go.](/docs/getting-started/golang/)

`flyctl` can then help you manage your app's [deployment regions](/docs/reference/regions/), [scaling](/docs/reference/scaling/), and [secrets](/docs/reference/secrets/).

If you want to experience `flyctl` for yourself, you can go hands-on for free and [launch a container on Fly](/docs/hands-on/start/).

If you just want to read about all the talents of `flyctl`, here's another link to its [documentation](/docs/flyctl/).
