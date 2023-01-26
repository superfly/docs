---
title: Launch a New App on Fly.io
objective: 
layout: framework_docs
order: 10
---

To create a brand new app on Fly.io, run `fly launch` from the root directory of your project. 

This command initializes a new App under your Organization and tries to configure it for deployment. 

We'll get to a demonstration here, but if you're in a hurry to try your first launch, we also have a condensed [Hands-on](/docs/hands-on/).

## Projects with Language and Framework Scanners

`fly launch` scans your project's source code, and for many programming languages and frameworks it can go from source to deployed app in a single step.

Have a look at our [Language & Framework Guides](/docs/languages-and-frameworks/) for instructions tailored to your project.

## Other Projects

`fly launch` will help you set up apps that aren't supported by scanners, too. You'll have to give flyctl more information to configure and build the project, before it can be deployed. 

Since Fly.io Apps run in VMs cooked up from Docker images, a big part of this is figuring out how to get or build this Docker image. See [Builders](/docs/reference/builders) for the ways that this can happen.

## App Configuration

Fly.io uses a TOML file to express user-defined configuration for Fly Apps. `fly launch` downloads a copy of this file, `fly.toml`, before deploying any VMs on a new app. If a launch scanner has detected that it matches your project's language or framework, it tweaks the configuration to suit. If no scanner matched your project, you get a `fly.toml` containing "sensible defaults" for a web app listening for HTTP or HTTPS connections.


If you need to make changes to `fly.toml`, respond `N` when `fly launch` offers to `deploy now`, and edit `fly.toml`. Then you can deploy using `fly deploy`.

## Resources for Apps

A basic web app will need a public IP address so that it can be reached. You may also want to prepare other resources before deploying your app, such as app secrets or a persistent storage volume.

`fly launch` will offer to take you through provisioning a Fly Postgres database cluster or Redis (by Upstash). You can say `Y` to these at launch time, or come back to them later.

For our best-supported frameworks, `fly launch` will do some or all of the above using the API.

Standard HTTP apps (listening for HTTP on standard ports) are automatically given a dedicated IPv6 Anycast IP address and a shared IPv4 Anycast address on deployment. See [Public Networking](/docs/reference/services/).

You can stop `fly launch` before the deploy step if there's anything you want to set up first, and then deploy with `fly deploy`.

## Example

Let's launch an app using an existing Docker image, by way of demonstration: [plain nginx](https://hub.docker.com/_/nginx). 

The change you're most likely to need to make in `fly.toml` is to set the `internal_port` value from the default `8080` to whatever port number your app process is listening on. There are a number of options you can use with the `fly launch` command. Find them with `fly launch --help` or [in `flyctl` documentation](/docs/flyctl/launch/).

By default, nginx listens on port 80, but the default configuration for a new Fly App assumes the main app process will listen on port 8080. We could `launch`, stop before deploying, edit `fly.toml`, and then run `fly deploy`, but we can pre-empt that issue by passing the `--internal-port` flag with our `fly launch` command, like so:

```cmd
fly launch --image nginx --internal-port 80
...
Created app dry-pond-1475 in organization tvd-testorg
Admin URL: https://fly.io/apps/dry-pond-1475
Hostname: dry-pond-1475.fly.dev
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
? Would you like to deploy now? Yes
? Will you use statics for this app (see https://fly.io/docs/reference/configuration/#the-statics-sections)? No
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Provisioning ips for dry-pond-1475
  Dedicated ipv6: 2a09:8280:1::ce9b
  Shared ipv4: 66.241.124.2
  Add a dedicated ipv4 with: fly ips allocate-v4
No machines in dry-pond-1475 app, launching one new machine
  Machine 21781973f03e89 update finished: success
  Finished deploying
```
To try out Apps v2 use an app that does not require statics. Apps v2 doesn’t support statics, yet. We’ll announce when that changes.



Once `fly launch` finishes, use `fly open` to open the app’s homepage in a browser. The “Welcome to nginx!” page will show if everything worked.


* mention release commands, secrets, checks config references