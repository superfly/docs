---
title: Fly Launch
layout: docs
sitemap: false
nav: firecracker
toc: false
redirect_from:
  - /docs/getting-started/launch-app/
---

Fly Launch is our Platform-as-a-Service product that takes some of the work out of deploying and managing your Fly App. Two commands that you'll use often are [`fly launch`](/docs/flyctl/launch/) and [`fly deploy`](/docs/apps/deploy/). The usual way to create a new Fly App is to write your project and then run `fly launch`. The `fly launch` command automates as much as possible between writing the code and deploying on the Fly Platform, setting you up with a running app with good defaults.

The `fly launch` command can perform several tasks, depending on the project:

* initialization of a new App under your Fly.io organization
* detection of known project types
* app configuration
* building of the Docker image we use to launch app VMs
* provisioning of resources like Postgres clusters, Redis databases, and IP addresses
* the first deployment


The language-specific scanners built into flyctl via `fly launch` perform different tasks as needed, but in broad strokes, here are the things that generally happen between writing your source code and it going live on Fly.io, whether this happens through Fly Launch or through a more manual process you might begin with `fly apps create`.

## New Fly App Creation

When `fly launch` or `fly apps create` creates a new Fly App, the app gets a name, an organization, a preferred deployment region, and a default configuration that's good for simple apps that should be publicly available on the web. At this early stage there's nothing to deploy; you can create an app before you even decide what language to write it in.

## Build configuration

An app deployed on Fly.io has to be packaged into a Docker image so we can turn it into a Firecracker VM.

This image can be pre-built, or it can be built during the deploy process, based on a Dockerfile. a Buildpack, [or a Nixpack](https://community.fly.io/t/build-images-with-nixpacks/6169).

This information can be specified in the `build section of fly.toml`. `fly launch` will fill this in automatically if it can. It can be overridden at deployment time using flags with `fly deploy`.

Reference: [Builders and Fly.io](/docs/reference/builders/)

## Fly Launch configuration

On creation, an app is given a default configuration that will work for most basic web apps.

You can view an app's configuration at any time using `fly config show -a my-app`, or download it into a local `fly.toml` using `fly config save -a my-app`.  

Manual configuration changes can be done by editing an app's `fly.toml` and running `fly deploy`.

Flyctl language-specific scanners make changes to app configuration as part of their work.

Reference: [App Configuration (fly.toml)](/docs/reference/configuration/)

## Platform resource provisioning

Before deployment, you might want to create and configure a [storage volume](/docs/apps/volume-storage/) or [Postgres database](/docs/reference/postgres/), or [set app secrets](/docs/reference/secrets/).

Some flyctl scanners will do some or all of this using the API.

## Deployment

Once the app is created and any platform resources it needs are set up, it can be deployed.

Every time an app is deployed, its configuration is updated in the app database, either from the outcome of `fly launch` or from a configuration file (`fly.toml`). An image is built, if needed, and deposited in the Fly.io registry. Public IP addresses are provisioned if the app listens on public ports and doesn't already have them. Finally, some hardware is allocated and at least one Firecracker VM is booted up.

`fly launch` will do the initial deployment for you if you want it to, as long as the build configuration has been set.

Use [`fly deploy`](/docs/flyctl/deploy/) to manually deploy an existing app. You can use `fly deploy` options to change certain elements of the app's configuration; e.g. adding an environment variable. The local `fly.toml` file, if any, won't be altered by this, but you can overwrite it with the currently-deployed configuration using `fly config save`, if you want to keep the changes for a future deployment.

Initial CPU and RAM specs default to the smallest available. Some projects will need beefier resources to run, in which case you'll need to do some [scaling](/docs/reference/scaling/) after your app is created.

## Launch outcomes

If all goes well, one of several things will happen when you run `fly launch` in a project's working directory:

1. If the `--image` flag was used, the app will be configured to use a preexisting Docker image on deployment and no further configuration will be done.
1. If the `--dockerfile` flag was used, the app will be configured to use the specified Dockerfile to build the image and no further configuration will be done.
2. Otherwise, flyctl scans the local working directory.
   1. If it detects a project of a kind it has a full-service launcher for, it will automatically configure and (if you want) deploy the app.
   2. If flyctl doesn't have a launcher that can configure the whole app, but does find a Dockerfile, it will offer to deploy it using that Dockerfile for the build.
3. If none of the above happens, flyctl will register a new app with a name and organization, and download you a default `fly.toml` to work with. Deployment can't happen without further configuration.

In all of these cases, `fly launch` downloads the final app config into a `fly.toml` in the working directory. Flyctl will look for a `fly.toml` from which to set the app's configuration on each new deployment.

Once an app is launched, you can make changes to it and provision further resources through `fly.toml` and flyctl commands.

## More things the scanners do

The language- or framework- specific scanners incorporated into `fly launch` may also do fancy things like the following:

- download files (e.g. Dockerfile, config files) into your working directory. Existing local files will be overwritten only with confirmation.
- run commands in your local development environment in order to prepare the project for deployment
- add commands to the Dockerfile
- set a release command
- set build arguments
- print messages with further information or instructions for the user

## What happens if I say yes to importing an existing config?

The config specified in that `fly.toml` is used instead of the default config. But the scanners continue and may overwrite these imported settings.

## Tweaking Fly Launch

You can tweak `fly launch` to better suit your project. The example that follows illustrates how this can work. 

For more information about ways to customize your launch, refer to [Custom launch](/docs/apps/launch/#custom-launch) and check out all the [options](/docs/flyctl/launch/) available for use with `fly launch`.

### An example of a custom launch

Here's me launching my Flask app that I've written and tested using the local dev server:

```cmd
fly launch 
```
```out            
Creating app in /Users/chris/FlyTests/hello-gunicorn-flask
Scanning source code
Detected a Python app
Using the following build configuration:
        Builder: paketobuildpacks/builder:base
? Choose an app name (leave blank to generate one): 
```

If I carry on with this buildpack-based build, this story does not end with a working Flask app. Dockerfile-based deployments are much simpler and faster anyway, so I decide to use a Dockerfile. (I hit ctrl-C to stop the launch.)

Conveniently, there's also already a [Dockerfile that works with this app](https://github.com/fly-apps/hello-gunicorn-flask/blob/main/Dockerfile).

With a Dockerfile in my working directory, if I run `fly launch` again, the Dockerfile launcher takes over before the generic Python buildpack one has a chance to.

```cmd
fly launch
```
```out
An existing fly.toml file was found for app testrun
? Would you like to copy its configuration to the new app? No
```
I have a `fly.toml` in my working directory from cloning [the `fly-apps/hello-gunicorn-flask` repo](https://github.com/fly-apps/hello-gunicorn-flask) to my local machine, but I want to use whatever config `fly launch` gives me, so I answer `No` to that question.

```
Creating app in /Users/chris/FlyTests/hello-gunicorn-flask
Scanning source code
Detected a Dockerfile app
```
There's the Dockerfile scanner taking over. Now some general app configuration:

```
? Choose an app name (leave blank to generate one): testrun
? Select Organization: Chris (personal)
Some regions require a paid plan (fra, maa).
See https://fly.io/plans to set up a plan.

? Choose a region for deployment: Toronto, Canada (yyz)
```

This is the region where flyctl will start Machines for this app if not otherwise specified. The first deployment will put its Machine(s) in that region.

```
Created app 'testrun' in organization 'personal'
Admin URL: https://fly.io/apps/testrun
Hostname: testrun.fly.dev
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
```

`fly launch` offers to provision [Fly Postgres](/docs/postgres/) and [Redis by Upstash](/docs/reference/redis/) databases. I don't need them for my very simple web app.

```
Wrote config file fly.toml
? Would you like to deploy now? Yes
==> Building image
Remote builder fly-builder-crimson-dew-6190 ready
...
```

It's downloaded the new app's configuration into `fly.toml` and offered to deploy straight away. I accept. By default, the Docker build happens on one of Fly.io's remote builder Machines.

Aside: In the case of my Dockerfile app, I ended up with the default `fly.toml`, configured with an HTTP service suitable for a basic web app, but with one small tweak. My Dockerfile contains the line:

```Dockerfile
EXPOSE 4999
```

My Flask app listens on port 4999, not the more common (and default for `fly.toml`) port 8080.

Fly.io doesn't care about EXPOSE statements in Dockerfiles directly, because we don't actually run containers, and services via our proxy are configured in `fly.toml`, not in the Dockerfile. But as a convenience, the Dockerfile `fly launch` scanner catches EXPOSE if it's there, and fills in `internal_port` on the [public HTTP `[[services]]` section](/docs/reference/configuration/#the-services-sections) accordingly.

Coming back to the deployment, skipping some of the build output:

```
...
--> Pushing image done
image: registry.fly.io/testrun:deployment-01GWAPGQWQ5N1HY5651D5DX5B0
image size: 141 MB
Provisioning ips for testrun
  Dedicated ipv6: 2a09:8280:1::5b:297
  Shared ipv4: 66.241.125.144
  Add a dedicated ipv4 with: fly ips allocate-v4

```

Because I had an HTTP service configured, and no [public IP addresses](/docs/reference/services/), these were [provisioned on deployment](/docs/apps/deploy/#ip-addresses).

```
Process groups have changed. This will:
 * create 1 "app" machine
No machines in group 'app', launching one new machine
  Machine 17811122f5d089 [app] update finished: success
  Finished deploying
```

The first deployment has finished!

I haven't explicitly configured [process groups](/docs/apps/processes/), so my app gets a single Machine assigned to the default `app` process. With `fly status` I can see that this machine is running in `yyz` (Toronto), where I told `fly launch` I wanted my app to be deployed. 

```cmd
fly status
```
```out
App
  Name     = testrun                                        
  Owner    = personal                                   
  Hostname = testrun.fly.dev                                
  Image    = testrun:deployment-01GWAPGQWQ5N1HY5651D5DX5B0  
  Platform = machines                                   

Machines
ID              PROCESS VERSION REGION  STATE   HEALTH CHECKS   LAST UPDATED         
17811122f5d089  app     1       yyz     started                 2023-03-24T20:56:45Z
```

I can [scale out](/docs/apps/scale-count/) by adding Machines in other regions if I want to get close to users in more corners of the world.

To check that my new web app is actually working, I run

```cmd
fly apps open
```

to visit my app in the browser!
