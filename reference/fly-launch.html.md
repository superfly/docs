---
title: Fly Launch overview
layout: docs
nav: firecracker
toc: false
redirect_from:
  - /docs/getting-started/launch-app/
---

Fly Launch is a bundle of features that take a lot of the work out of deploying and managing your Fly App. Two commands that you'll use often are [`fly launch`](/docs/flyctl/launch/) and [`fly deploy`](/docs/launch/deploy/). 

The usual way to create a new Fly App is to write your project and then run `fly launch`. The `fly launch` command automates as much as possible between writing the code and deploying on Fly.io, setting you up with a running app with good defaults.

The `fly launch` command performs several tasks, depending on the project:

* initializes a new app in your Fly.io organization
* detects known project types
* configures the app with good defaults
* builds the Docker image used to create app Machines
* provisions resources like Postgres clusters, Redis databases, and IP addresses
* deploys the app for the first time

The language-specific scanners built into `fly launch` perform different tasks as needed. The following sections describe what generally happens between writing your source code and it going live on Fly.io through Fly Launch.

## New Fly App creation

When `fly launch` creates a new Fly App, the app gets a name, an organization, a preferred deployment region, and a default configuration that's good for simple apps that should be publicly available on the web.

## Build configuration

An app deployed on Fly.io has to be packaged into a Docker image so we can turn it into a Machine.

This image can be pre-built, or it can be built during the deploy process, based on a Dockerfile (recommended), a Buildpack, [or a Nixpack](https://community.fly.io/t/build-images-with-nixpacks/6169).

Build information is in the `build` section of `fly.toml`. `fly launch` will fill this in automatically if it can. You can override build information at deployment time using flags with `fly deploy`.

Reference: [Builders and Fly.io](/docs/reference/builders/)

## Fly App configuration

On creation, an app gets a default configuration that will work for most basic web apps.

You can view an app's configuration by opening the `fly.toml` file in your project's source directory, or in JSON format by running `fly config show`. Postgres apps don't have a local `fly.toml` file, but you can download and save it locally with `fly config save -a my-app-name`.

You can make configuration changes by editing an app's `fly.toml` and then running `fly deploy`.

The flyctl language-specific scanners make changes to app configuration as part of their work.

Reference: [App configuration (fly.toml)](/docs/reference/configuration/)

## Platform resource provisioning

Before deployment, you might want to create and configure a [Fly Volume](/docs/volumes/) or [Postgres database](/docs/reference/postgres/), or [set app secrets](/docs/apps/secrets/).

Some flyctl scanners will do some or all of this using the API.

## Deployment

The `fly launch` command might deploy your new app for the first time if you accept the defaults or after you tweak the app's settings. You can stop `fly launch` from deploying the new app right away with `fly launch --no-deploy`.

Whenever you want to update your app, you'll run [`fly deploy`](/docs/flyctl/deploy/). `fly deploy` creates a new release of the app with the updated configuration, and builds and deposits the image in the Fly.io registry, if needed. Public IP addresses are provisioned if the app listens on public ports and doesn't already have them. Finally, some hardware is allocated and at least one Machine is booted up.

You can use `fly deploy` options to change certain elements of the app's configuration, such as adding an environment variable. The local `fly.toml` file, if any, won't be altered by this, but you can overwrite it with the currently-deployed configuration using `fly config save`, if you want to keep the changes for a future deployment.

Initial CPU and RAM specs default to the smallest available. Some projects will need beefier resources to run. You can set a default Machine size and memory in the [`vm` section](/docs/reference/configuration/#the-vm-section) of the `fly.toml` file. You can also [scale](/docs/apps/scale-machine/) the app's Machines using flyctl.

## Launch outcomes

If all goes well, one of several things will happen when you run `fly launch` in a project's working directory. In every case, you'll have the option to tweak the app's defaults before deployment:

1. If the `--image` flag was used, the app will be configured to use a preexisting Docker image.
1. If the `--dockerfile` flag was used, the app will be configured to use the specified Dockerfile to build the image.
1. Otherwise, flyctl scans the local working directory.
   1. If it detects a project of a kind it has a full-service launcher for, it will automatically configure the app.
   1. If flyctl doesn't have a launcher that can configure the whole app, but does find a Dockerfile, it will offer to deploy it using that Dockerfile for the build.
1. If none of the above happens, flyctl will register a new app with a name and organization, and download you a default `fly.toml` to work with. Deployment can't happen without further configuration.

In all of these cases, `fly launch` downloads the final app config into a `fly.toml` in the working directory. `fly deploy` will look for a `fly.toml` from which to set the app's configuration on each new deployment.

Once you create an app, you can make changes to it and provision further resources through `fly.toml` and flyctl commands.

## More things the scanners do

The language- or framework- specific scanners incorporated into `fly launch` may also do fancy things like the following:

- Download files (such as Dockerfile, config files) into your working directory. Existing local files will be overwritten only with confirmation.
- Run commands in your local development environment to prepare the project for deployment.
- Add commands to the Dockerfile.
- Set a release command.
- Set build arguments.
- Print messages with further information or instructions for the user.

## What happens if I say yes to importing an existing config?

Fly Launch uses the config specified in that `fly.toml` instead of the default config. But the scanners continue and may overwrite these imported settings.

## Customizing Fly Launch

You can customize `fly launch` to better suit your project. The example that follows illustrates how this can work.

For more information about ways to customize your launch, refer to [Custom launch](/docs/launch/create/#custom-launch) and check out all the [options](/docs/flyctl/launch/) available for use with `fly launch`.

### An example of a custom launch

Here's me launching my Flask app that I've written and tested using the local dev server:

```cmd
fly launch
```
```out
Scanning source code
Detected a Python app
Using the following build configuration:
	Builder: paketobuildpacks/builder:base
Creating app in /Users/chris/FlyTests/hello-gunicorn-flask
We're about to launch your Python app on Fly.io. Here's what you're getting:

Organization: MyOrg                  (fly launch defaults to the personal org)
Name:         hello-gunicorn-flask   (derived from your directory name)
Region:       Secaucus, NJ (US)      (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM (most apps need about 1GB of RAM)
Postgres:     <none>                 (not requested)
Redis:        <none>                 (not requested)

? Do you want to tweak these settings before proceeding? (y/N)
```

I decide I'd rather use a Dockerfile-based deployment than a buildpack, for faster deployments and more control. I hit ctrl-C to stop the launch.

Conveniently, there's also already a [Dockerfile that works with this app](https://github.com/fly-apps/hello-gunicorn-flask/blob/main/Dockerfile).

With a Dockerfile in my working directory, if I run `fly launch` again, the Dockerfile launcher takes over before the generic Python buildpack one has a chance to.

```cmd
fly launch
```
```out
An existing fly.toml file was found for app hello-gunicorn-flask
? Would you like to copy its configuration to the new app? No
```
I have a `fly.toml` in my working directory from cloning [the `fly-apps/hello-gunicorn-flask` repo](https://github.com/fly-apps/hello-gunicorn-flask) to my local machine, but I want to use whatever config `fly launch` gives me, so I answer `No` to that question.

```
Scanning source code
Detected a Dockerfile app
Creating app in /Users/chris/FlyTests/hello-gunicorn-flask
We're about to launch your app on Fly.io. Here's what you're getting:

Organization: MyOrg                  (fly launch defaults to the personal org)
Name:         hello-gunicorn-flask   (derived from your directory name)
Region:       Secaucus, NJ (US)      (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM (most apps need about 1GB of RAM)
Postgres:     <none>                 (not requested)
Redis:        <none>                 (not requested)

? Do you want to tweak these settings before proceeding? (y/N)
```
There's the Dockerfile scanner taking over. I'll enter `y` to have a look at the other settings the scanner picked up from my source code. The Fly Launch web page opens and I can change some basic settings like my app name or region if I want to:

* The region is where Fly Launch will create the app's Machines on first deployment; this region is the `primary_region` in the `fly.toml` file. The primary region is where flyctl will add Machines for new process groups as well. I'll keep the Secaucus, NJ (ewr) region to start.

* Next, I check the port for services; this port is the `internal_port` in the [`[[http_service]]` section](/docs/reference/configuration/#the-services-sections) of the `fly.toml` file. My Flask app listens on port 4999, not the more common port 8080 (the `fly.toml` default), so my Dockerfile contains the line:

    ```Dockerfile
    EXPOSE 4999
    ```

    Fly.io doesn't care about EXPOSE statements in Dockerfiles directly, because we don't actually run containers, and services via our proxy are configured in `fly.toml`, not in the Dockerfile. But the Dockerfile `fly launch` scanner catches EXPOSE if it's there, and fills in accordingly. I confirm that the port is set to 4999 via the Fly Launch the web page.
    
* Everything else looks good, so I click **Confirm Settings**.

Returning to the terminal, I can see the app getting created and the image getting built in the output (edited for brevity):

```
Waiting for launch data... Done
Created app 'hello-gunicorn-flask' in organization 'personal'
Admin URL: https://fly.io/apps/hello-gunicorn-flask
Hostname: hello-gunicorn-flask.fly.dev
Wrote config file fly.toml
Validating /Users/chris/FlyTests/hello-gunicorn-flask/fly.toml

Platform: machines
✓ Configuration is valid
==> Building image
Remote builder fly-builder-long-glitter-7257 ready
==> Building image with Docker

...

--> Pushing image done
image: registry.fly.io/hello-gunicorn-flask:deployment-01HGEDDH0R7T762T90B45GZRWP
image size: 141 MB

Watch your deployment at https://fly.io/apps/hello-gunicorn-flask/monitoring

Provisioning ips for hello-gunicorn-flask
  Dedicated ipv6: 2a09:5789:1::4e:b68c
  Shared ipv4: 66.333.124.86
  Add a dedicated ipv4 with: fly ips allocate-v4
```

Because I had an HTTP service configured, and no [public IP addresses](/docs/networking/services/), Fly Launch [provisioned the IPs on deployment](/docs/launch/deploy/#ip-addresses).

```
This deployment will:
 * create 2 "app" machines

No machines in group app, launching a new machine
Creating a second machine to increase service availability
Finished launching new machines
-------
NOTE: The machines for [app] have services with 'auto_stop_machines = true' that will be stopped when idling

-------

Visit your newly deployed app at https://hello-gunicorn-flask.fly.dev/
```

The first deployment has finished!

I haven't explicitly configured [process groups](/docs/apps/processes/), so my app gets two Machines assigned to the default `app` process. With `fly status`, I can see the Machines:

```cmd
fly status
```
```out
App
  Name     = hello-gunicorn-flask
  Owner    = personal
  Hostname = hello-gunicorn-flask.fly.dev
  Image    = hello-gunicorn-flask:deployment-01HGEDDH0R7T762T90B45GZRWP
  Platform = machines

Machines
PROCESS	ID            	VERSION	REGION	STATE  	ROLE	CHECKS	LAST UPDATED
app    	918543b477de83	1      	ewr   	stopped	    	      	2023-11-29T21:17:19Z
app    	e28697ce6d3986	1      	ewr   	stopped	    	      	2023-11-29T20:55:33Z
```

<div class="note icon">
**Note:** Both Machines are in a stopped state, because they were idle for a few minutes and we enable the [autostop/autostart feature](/docs/launch/autostop-autostart/) by default.
</div>

I can [scale out](/docs/apps/scale-count/) by adding Machines in other regions if I want to get close to users in more corners of the world.

To check that my new web app is actually working, I visit the URL provided in the output in my browser (in my case that's `hello-gunicorn-flask.fly.dev`).
