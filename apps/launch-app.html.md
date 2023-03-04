---
title: Launch a New App on Fly.io
objective: 
layout: docs
nav: firecracker
order: 10
---

To create a brand new app on Fly.io, run `fly launch` from the root directory of your project. This command initializes a new App under your Organization and tries to configure it for deployment. 

We'll get to a demonstration, but if you're in a hurry to try your first launch, we also have a condensed [Hands-on](/docs/hands-on/). If you're anxious to deploy your own project, have a look at our [short guides for specific languages and frameworks](/docs/languages-and-frameworks/) and read more here later!

## Launch Scanners

`fly launch` scans your project's source code, and for many programming languages and frameworks it can go from source to deployed app in a single step.

Have a look at our [Language & Framework Guides](/docs/languages-and-frameworks/) for instructions tailored to your project.

`fly launch` will help you set up your app, even if its scanners don't detect a project it can deploy automatically. You'll have to give flyctl more information to configure and build the project, before it can be deployed. 

The building blocks for Fly.io Apps are Fly Machines. Machines are Linux VMs cooked up from Docker images, so a big part of this is figuring out how to get or build this Docker image. See [Builders](/docs/reference/builders) for the ways that this can happen.

## App Configuration

Fly.io uses a TOML file to express user-defined configuration for Fly Apps. `fly launch` downloads a copy of this file, `fly.toml`, before deploying any Machines on a new app. 

If a launch scanner has detected that it matches your project's language or framework, it tweaks the configuration to suit. If no scanner matched your project, you get a `fly.toml` containing "sensible defaults" for a web app listening for HTTP and HTTPS connections. This includes setting up HTTP services to get Fly Proxy to route requests to your app, and establishing TCP health checks that Fly.io uses to determine if a deployment has succeeded.

If and when you need more control, `fly.toml` lets you set environment variables, deployment strategy, release commands, internet-exposed services, disk mounts, custom metrics, health checks, and process-group Machines to be configured on the next deployment. More in [App Configuration](/docs/reference/configuration/).

If you need to make configuration changes, respond `N` when `fly launch` offers to `deploy now`, and edit `fly.toml`. Then you can deploy using `fly deploy`.

## Resources for Apps

A basic web app will need a public IP address so that it can be reached. You may also want to prepare other resources before deploying your app, such as app secrets or a persistent storage volume.

For our best-supported frameworks, `fly launch` will do some or all of the above using the API.

Standard HTTP apps (listening on standard ports) are automatically given a dedicated IPv6 Anycast IP address and a shared IPv4 Anycast address on deployment. See [Public Networking](/docs/reference/services/).

`fly launch` will ask if you want to provision a Fly Postgres database cluster and a Redis store (in partnership with Upstash). If you're not sure, you can say `N` to these, and set them up later if needed.

You can say no to `deploy now?` if there's anything you want to set up first, and then deploy with `fly deploy`.

## Example

As a demonstration, let's launch an app using an existing Docker image: [plain nginx](https://hub.docker.com/_/nginx). 

By default, nginx listens on port 80, but the default configuration for a new Fly App assumes that the main app process will listen on port 8080. Setting the `internal_port` value to another port number is a common configuration task.

We could `launch`, stop before deploying, edit `fly.toml`, and then run `fly deploy`, but if we're thinking ahead, we can pre-empt that issue by passing the `--internal-port` flag with our `fly launch` command, like so:


```cmd
fly launch --image nginx --internal-port 80
```

There are a number of other options for the `fly launch` command. Find them with `fly launch --help` or [in `flyctl` documentation](/docs/flyctl/launch/).

```out
Creating app in /Users/chris/FlyTests
Using image nginx
? Choose an app name (leave blank to generate one): testrun
? Select Organization: Your Name (personal)
? Choose a region for deployment: Montreal, Canada (yul)
Created app testrun in organization personal
Admin URL: https://fly.io/apps/testrun
Hostname: testrun.fly.dev
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
? Would you like to deploy now? Yes
? Will you use statics for this app (see /docs/reference/configuration/#the-statics-sections)? No
```

As of the time of writing, the [`fly.toml` `[[statics]]` block](/docs/reference/configuration/#the-statics-sections) is not supported for V2 Apps, and if you reply `Y` to this last question, your app will be deployed, but it will be of the legacy type, orchestrated by Nomad.

```
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Provisioning ips for testrun
  Dedicated ipv6: 2a09:8280:1::3:d339
  Shared ipv4: 66.241.125.159
  Add a dedicated ipv4 with: fly ips allocate-v4
No machines in testrun app, launching one new machine
  Machine e78492eced6d83 update finished: success
  Finished deploying
```

Once `fly launch` finishes, use `fly open` to open the app’s homepage in a browser. The “Welcome to nginx!” page will show if everything worked.

If it didn't, you'll want to head for [Get Information About an App](/docs/apps/app-info/) and [Troubleshooting Your Deployment](/docs/getting-started/troubleshooting/) to get to the bottom of it.