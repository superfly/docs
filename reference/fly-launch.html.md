---
title: Fly Launch
layout: docs
sitemap: false
nav: firecracker
toc: false
redirect-from:
   - /docs/getting-started/launch-app/
---

Usually, to create a new App on Fly.io, you'll write your source code and then run `fly launch`. [`fly launch`](/docs/flyctl/launch/) is an all-in-one tool that automates as much as possible between writing the code and deploying on Fly.io, setting you up with a running app with good defaults.

The language-specific launchers built into flyctl via `fly launch` perform different tasks as needed, but in broad strokes, here are the things that generally happen between writing your source code and it going live on Fly.io, whether this happens through `fly launch` or through a more manual process you might begin with `fly apps create`.

## New App Creation

When `fly launch` or `fly apps create` creates a new app, it gets a name, an organization, a preferred deployment region, and a default configuration that's good for simple apps that should be publicly available on the web. At this early stage there's nothing to deploy; you can create an app before you even decide what language to write it in.

## Build Configuration

An app deployed on Fly.io has to be packaged into a Docker image so we can turn it into a Firecracker VM.

This image can be pre-built, or it can be built during the deploy process, based on a Dockerfile. a Buildpack, [or a Nixpack](https://community.fly.io/t/build-images-with-nixpacks/6169).

This information can be specified in the `build section of fly.toml`. `fly launch` will fill this in automatically if it can. It can be overridden at deployment time using flags with `fly deploy`.

Reference: [Builders and Fly.io](/docs/reference/builders/)

## App Configuration

On creation, an app is given a default configuration that will work for most basic web apps.

You can view an app's configuration at any time using `fly config display -a my-app`, or download it into a local `fly.toml` using `fly config save -a my-app`.  

Manual configuration changes can be done by editing an app's `fly.toml` and running `fly deploy`.

Flyctl language-specific launchers make changes to app configuration as part of their work.

Reference: [App Configuration (fly.toml)](/docs/reference/configuration/)

## Platform Resource Provisioning

Before deployment, you may want create and configure a [storage volume](/docs/reference/volumes/) or [Postgres database](/docs/reference/postgres/), or [set app secrets](/docs/reference/secrets/).

Some flyctl launchers will do some or all of this using the API.

## Deployment

Once the app is created and any platform resources it needs are set up, it can be deployed.

Every time an app is deployed, its configuration is updated in the app database, either from the outcome of `fly launch` or from a configuration file (`fly.toml`). An image is built, if needed, and deposited in the Fly.io registry. Public IP addresses are provisioned if the app listens on public ports and doesn't already have them. Finally, some hardware is allocated and at least one Firecracker VM is booted up.

`fly launch` will do the initial deployment for you if you want it to, as long as the build configuration has been set.

Use [`fly deploy`](/docs/flyctl/deploy/) to manually deploy an existing app. You can use `fly deploy` options to change certain elements of the app's configuration; e.g. adding an environment variable. The local `fly.toml` file, if any, won't be altered by this, but you can overwrite it with the currently-deployed configuration using `fly config save`, if you want to keep the changes for a future deployment.

Initial CPU and RAM specs default to the smallest available. Some projects will need beefier resources to run, in which case you'll need to do some [scaling](/docs/reference/scaling/) after your app is created.

## Launch Outcomes

If all goes well, one of several things will happen when you run `fly launch` in a project's working directory:

1. An existing app will be redeployed. This happens if a `fly.toml` is found in the directory, containing an app name that belongs to an app that exists in the Fly.io app database but does not have a healthy instance running. In this case, deployment is attempted using the configuration present inside this `fly.toml`.
1. If the `--image` flag was used, the app will be configured to use a preexisting Docker image on deployment and no further configuration will be done.
1. If the `--dockerfile` flag was used, the app will be configured to use the specified Dockerfile to build the image and no further configuration will be done.
2. Otherwise, flyctl scans the local working directory.
   1. If it detects a project of a kind it has a full-service launcher for, it will automatically configure and (if you want) deploy the app.
   2. If flyctl doesn't have a launcher that can configure the whole app, but does find a Dockerfile, it will offer to deploy it using that Dockerfile for the build.
3. If none of the above happens, flyctl will register a new app with a name and organization, and download you a default `fly.toml` to work with. Deployment can't happen without further configuration.

In all of these cases, `fly launch` downloads the final app config into a `fly.toml` in the working directory. Flyctl will look for a `fly.toml` from which to set the app's configuration on each new deployment.

Once an app is launched, you can make changes to it and provision further resources through `fly.toml` and flyctl commands.

## More Things the Launchers Do

The language- or framework- specific launchers incorporated into `fly launch` may also do fancy things like the following:

- download files (e.g. Dockerfile, config files) into your working directory. Existing local files will be overwritten only with confirmation.
- run commands in your local development environment in order to prepare the project for deployment
- add commands to the Dockerfile
- set a release command
- set build arguments
- print messages with further information or instructions for the user

## What Happens if I Say Yes to Importing an Existing Config?

The config specified in that `fly.toml` is used instead of the default config. But the scanners continue and may overwrite these imported settings.

## Tweaking Launch Behavior

See all the [options](/docs/flyctl/launch/) available for use with `fly launch`.
