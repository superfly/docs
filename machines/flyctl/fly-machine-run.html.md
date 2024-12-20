---
title: Run a new Machine
objective: Run a new Fly Machine with flyctl
layout: docs
nav: machines
redirect_from: /docs/machines/run/
---

<figure>
  <img src="/static/images/moto-jump.png" alt="Illustration by Annie Ruygt of a phoenix jumping with a motor bike" class="max-w-lg">
</figure>

The [`fly machine run`](/docs/flyctl/machine-run/) command is a tool to configure, build, and start a new Machine in one line.

Many, but not all, [Machine configuration](/docs/machines/api-machines-resource/#machine-config-object-properties) options are available to the `fly machine run` command through flags. The available flags are listed in the flyctl help and on the [`fly machine run` reference page](/docs/flyctl/machine-run/).

Use `fly machine run` when you want use more than one Docker image in an app, or to run a one-off or temporary Machine.

<div class="note">
To create a Machine, but not start it, use [`fly machine create`](/docs/flyctl/machine-create/).

To make changes to a Machine once it's created or run, use [`fly machine update`](/docs/flyctl/machine-update/).

To create and run a new Machine with the same configuration as an existing Machine, use [`fly machine clone`](/docs/flyctl/machine-clone/).

To add a new Machine to an app managed by `fly deploy`, see [the scaling doc for Fly Launch apps](/docs/apps/scale-count/). By default, `fly machine run` creates Machines that are ignored by Fly Launch features like `fly deploy`, `fly status`, and `fly scale`.
</div>

## What it does

Here's what `fly machine run` does for you:
* Checks with the platform for the org and app you've specified, if any, and if needed, guides you through naming a new app.
* Creates a Fly App, if applicable.
* Gets, or builds, a Docker image to make the Machine from, and pushes it to the Fly.io registry if applicable.
* Creates the Machine with some default config, plus config you pass to it with flags.
* Starts the Machine.
* By default, waits for the Machine to start, and for any configured health checks to pass, before declaring success (or failure).

## Usage

Here's the usage of `fly machine run`:

```cmd
fly machine run <image> [command] [flags]
```

Here, `<image>` can point to a prebuilt image, or to the current directory (`.`) to build from a Dockerfile.


## Administration: set the Machine's app and org

The default behavior of `fly machine run` is to create a new Fly App for the new Machine to belong to, unless it's given the name of an existing app in one of two ways:

1. Like many flyctl commands, `fly machine run` will pull an app name from a `fly.toml` file if one is present in the working directory. It disregards the rest of the configuration in the file.
2. If you pass it an app name with `--app <app-name>`, flyctl prefers that name over any name it gets from a `fly.toml`.

If the app name doesn't belong to an existing app in one of your orgs, flyctl asks if you want to create it.

 It may be worth creating a `fly.toml` file with just the app name in it, to save using the `--app` option repeatedly. For example:

```toml
# a fly.toml just to provide an app name to commands
# run from the same directory

app = my-app-name
```

Use `--org <org-name>` to specify which organization a newly created app should belong to. The `--org` flag is ignored when creating the new Machine in an existing app.

## Name the Machine

Machines have a human-friendly `name` [property](/docs/machines/api-machines-resource/#machine-properties), like `ancient-glitter-2128`, that shows up alongside the `id` in the output of the `fly machine list` command and in the web dashboard.

You can give the Machine a custom name with the `--name` flag:

```cmd
fly machine run . --name my-special-Machine
```

## Choose a geographical region

Tell the Fly.io platform which [region](/docs/reference/regions/) to create the Machine in with the `--region` flag; if for some reason it can't start a new Machine in that region, you'll get an error. If the `--region` flag is omitted, the platform chooses the region that's fastest to reach from your location.

This sets the `region` [property](/docs/machines/api-machines-resource/#machine-properties) of the Machine.

## Get or build the Docker image

All Fly Machines are made from Docker images.

Once the Machine is created, you can see this image reflected in its [`image_ref`](/docs/machines/api-machines-resource/#machine-properties) and [`config.image`](/docs/machines/api-machines-resource/#machine-config-object-properties) properties.

With `fly machine run`, there are two options: point to a prebuilt image, or point to a Dockerfile, which flyctl will use to build an image.

### Build from a Dockerfile

To build the image from a Dockerfile named `Dockerfile`, indicate the current working directory using the `<image>` argument.

```cmd
fly machine run .
```

Use the `--dockerfile` option to specify a Dockerfile with a different name. For example:

```cmd
fly machine run . --dockerfile Dockerfile-dev
```

Any source files the Dockerfile uses should be present in the working directory. Once built, the image is pushed to the Fly.io Docker registry where your organization's remote builders can access it.

### Use an existing image

For example:

```cmd
fly machine run ghcr.io/livebook-dev/livebook:0.11.4
```

## Get a shell on a temporary Machine

The following command creates a temporary Machine using the Dockerfile in the working directory, and logs you into an interactive shell on it:

```cmd
fly machine run . --shell
```

If you don't specify an app, a temporary app is created for the Machine. When you log out of the shell, the Machine, and if applicable, the temporary app, is deleted.

The default shell is Bash. The `--command` flag allows you to specify a different shell if Bash isn't present in the Machine's Docker image. Log in as a non-`root` user using the `--user` flag.

If you just want a shell on a temporary Ubuntu Machine that's in your org's private network, omit the `<image>` argument:

```cmd
fly machine run --shell
```

## Run with a custom ENTRYPOINT or CMD

You can have the Fly.io `init` override the ENTRYPOINT and CMD (if any) of the Machine's Docker image.

### Custom CMD

Override CMD by including the command to run at the end of the `fly machine run` invocation. This sets the [`config.init.cmd`](/docs/machines/api-machines-resource/#machine-config-object-properties) property on the Machine.

This example simply spins up a Debian Linux Machine with a `sleep` task to keep it awake; you can shell into it or whatever:

```cmd
fly machine run debian sleep inf
```

### Custom ENTRYPOINT

Override ENTRYPOINT with the `--entrypoint` option. This sets the [`config.init.entrypoint`](/docs/machines/api-machines-resource/#machine-config-object-properties) property on the Machine.

In this example we use the [`--file-local` option](/docs/machines/flyctl/fly-machine-run#copy-a-local-file-into-the-machine-file-system) to send an entrypoint script to the Machine and `--entrypoint` to run the script before continuing to the custom CMD `sleep inf`:

```cmd
fly machine run debian --file-local /entrypoint.sh=./entrypoint.sh \
                       --entrypoint "/entrypoint.sh" \
                       sleep inf
```

Here's a trivial `entrypoint.sh` you can use to test the above example:

```bash
#! /bin/bash

echo "Hello from my Fly Machine"

exec "$@"
```

The line "Hello from my Fly Machine" should appear in the app's logs.

## Set Machine resources

Include one or more of the following options to use non-default specifications for the Machine to be run:

```
--vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
--vm-cpus int                 Number of vCPUs
--vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb)
--vm-memory string            Memory (in megabytes) to attribute to the VM
--vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
```

These flags set [`config.guest`](/docs/machines/api-machines-resource/#machine-config-object-properties) properties.

## Set environment variables

Specify environment variables to be available on the Machine with the `--env` flag, using NAME=VALUE pairs.

This flag sets the [`config.env`](/docs/machines/api-machines-resource/#machine-config-object-properties) property on the Machine.

Example:

```cmd
fly machine run . --env MY_VAR=MY_VALUE \
                  --env MY_OTHER_VAR="my spacey value" \
                  --app my-app-name
```

Use quotes around the value if it has spaces in it.

For sensitive environment variables, [set secrets on the app](https://fly.io/docs/flyctl/secrets/) instead.

## Define a Fly Proxy network service

The `--port` option defines a network service to allow the Fly Proxy to reach a local service on the Machine. This option gives you access to basic service configuration; the [Machines API](/docs/machines/api-machines-resource/) and [Fly Launch](/docs/launch/) both offer more control over the Machine's [`config.services`](/docs/machines/api-machines-resource/#machine-config-object-properties) properties.

Map any external ports, where the proxy accepts requests directed at the app, to the internal port where the service is listening on IPv4. For each port combination, specify the protocol and [connection handler(s)](/docs/networking/services/#connection-handlers), using this format:

```plain
port[:machinePort][/protocol[:handler[:handler...]]]
```

For example, if your Machine runs a server on port 80, and the Fly Proxy should handle HTTP connections on port 80 and HTTPS connections on port 443, the port configuration would look like this:

```cmd
fly machine run . --port 80/tcp:http \
                  --port 443:80/tcp:http:tls \
                  --app my-app-name
```

<div class="important icon">
**Important:** If Machines within the same Fly App host different services, use different external ports so that they don't receive requests meant for another Machine.
</div>


## Set Fly Proxy autostop/autostart

The `--autostart` and `--autostop` flags only work on Machines with Fly Proxy services configured. Learn more about [how Fly Proxy autostop/autostart works](/docs/reference/fly-proxy-autostop-autostart/) and [how to configure it](/docs/launch/autostop-autostart/).

In a Machine service's configuration, `autostop` and `autostart` settings are optional.

If the `--autostop` flag is absent in a `fly machine run` command, the Machine's [`config.services.autostop`](/docs/machines/api-machines-resource/#machine-config-object-properties) value doesn't get set, and the Fly Proxy does not shut the Machine down, even when there is no traffic to it.

If the `--autostart` flag is absent in a `fly machine run` command, the Machine's [`config.services.autostart`](/docs/machines/api-machines-resource/#machine-config-object-properties) value doesn't get set, and the Fly Proxy does not start it in response to requests.

The `--autostart` and `--autostop` flags set the value of `autostart` or `autostop` to `true` by default; you can explicitly set the value to `false`. For example, the following runs a new Machine that may be stopped by the Fly Proxy, but will never be restarted by it:

```cmd
fly machine run nginx --port 80:80/tcp:http \
                --port 443:80/tcp:http:tls \
                --autostop \
                --autostart=false
```

If you define more than one service on the Machine, and also use one or both of these flags, the setting applies to all the services.

## Stop or restart the machine on process exit

Set the Machine's [restart policy](/docs/machines/guides-examples/machine-restart-policy/) using the `--restart` option. Options are `no`, `always`, and `on-fail`, which correspond to `no`, `always`, and `on-failure` values for the Machine [`config.restart.policy`](/docs/machines/api-machines-resource/#machine-config-object-properties) property.


The default restart policy for a Machine created using `fly machine run` is `always`, unless you use the [`--rm` option](#destroy-the-machine-when-it-exits), in which case the default is `no`.

## Destroy the Machine when it exits

By default, when a Machine is `stopped`, its file system is reset using its config and Docker image, and it sits ready to be `started` again. Use the `--rm` flag to cause the Machine to instead be destroyed when it stops.

The default [restart policy](#set-a-restart-policy-on-process-exit) for a Machine created with `fly machine run --rm` is `no`, to ensure that flyd doesn't ignore the exit code and restart the Machine.

## Mount a Fly Volume

A Fly Volume is a slice of an NVMe drive attached to the hardware that runs the Machine. Create a volume before creating the Machine.

```cmd
fly volume create --size 10 data_volume --region arn
```

Create the new Machine in the same region, using the volume name: `--volume <vol_name>:<mount_point>`.

```cmd
fly machine run . --volume data_volume:data --region arn
```

Or by id: `--volume <vol_id>:<mount_point>`.

```cmd
fly machine run . --volume vol_d42652p88kdw9l7r:data --region arn
```

A Machine can only mount one volume, and each volume can only be mounted on one Machine. To release a volume that is attached to a Machine, destroy the Machine.

The `--volume` flag on the `fly machine run` command sets a subset of the properties of the Machine's [`config.mounts`](/docs/machines/api-machines-resource/#machine-config-object-properties) object.

## Add metadata to the Machine

The Fly.io platform uses specific metadata, stored in a Machine's config, for its own purposes, such as assigning Machines to process groups. You can add custom metadata as well.

The following starts a Machine that the `fly deploy` command will try to manage as part of the `app` process group, replacing its image and config with what, if anything, you have set up in the working directory for that app.

```
fly machine run . --metadata fly_platform_version=v2 \
                  --metadata fly_process_group=app \
                  --metadata my_metadata=mineallmine
```

You can see the [metadata in the Machine config](/docs/machines/api-machines-resource/#machine-config-object-properties):

```cmd
fly machine status -d -a my-app-name
```
```out
...
  "metadata": {
    "fly_platform_version": "v2",
    "fly_process_group": "app",
    "mymeta": "mineallmine"
  },
...
```

## Place data into files on the Machine

The [`files` property](/docs/machines/api-machines-resource/#machine-config-object-properties) of a Machine's configuration can be used to place data or secrets into files on the Machine file system.

<div class="important icon">
**Important:** This won't work for large files. There's a limit to how much data can be stored in an app secret or a Machine's configuration.
</div>

### Copy a local file into the Machine file system

Use the `--file-local` flag to copy a local file onto the Machine at your specified path:

```
fly machine run . --file-local /path/inside/machine=local/path
```

flyctl Base64-encodes the file contents and stores the result in the `files.raw_value` property of the Machine's config; `/path/inside/machine` is stored in `files.guest_path`. When the Machine is created, the data is decoded and written to the file.


### Pass data in on the command line

Place data into a file at your specified path, via an argument of the `--file-literal` flag:

```cmd
fly machine run . --file-literal /path/inside/machine="Some text I want in a file"
```

In a shell session on the Machine:

```cmd
root@2865553aedd268:/# cat /path/inside/machine
Some text I want in a file
```

If your data isn't a simple string like in the above example, you can Base64-encode it first, and have your app code decode the contents of the file into the original format:

```cmd
fly machine run . --file-literal /b64file=SGVsbG8hIEknbSBGcmFua2llIHRoZSBiYWxsb29uIQo=
```

In a shell session on the Machine:

```cmd
root@1857779a44d108:/# cat b64file | base64 --decode
Hello! I'm Frankie the balloon!
```

flyctl Base64-encodes the data and stores the result in the `files.raw_value` property of the Machine's config; `/path/inside/machine` is stored in `files.guest_path`. When the Machine is created, the data is decoded and written to the file.


### Make a secret available in a file

[Fly Secrets](/docs/apps/secrets/) are stored in an encrypted vault, and by default they are available as environment variables on each of the app's Machines.

You can make a secret available in a file, rather than an environment variable.

Encode the data in Base64 format and put it into an app secret with `fly secrets set` or `fly secrets import`. Use the `--stage` flag to prevent flyctl from initiating a deployment once the secret is registered.

<div class="important icon">**Important:** The secret must be Base64-encoded. If you try this with a secret that is not Base64-encoded, Machine creation fails.</div>


Example with a simple secret:

```cmd
fly secrets set \
  MY_BASE64_SECRET=SGVsbG8hIEknbSBGcmFua2llIHRoZSBiYWxsb29uIQo= \
  --stage
```

Use the `--file-secret` flag when creating the Machine with `fly machine run`. In this example I'm putting the contents of the secret called `MY_BASE64_SECRET` into a file `/secret-file` on my new Machine:

```cmd
fly machine run . \
  --file-secret /secret-file=MY_BASE64_SECRET
```

The secret is available in the specified file, and not in an environment variable, on that Machine. It's decoded from Base64 into plain text.

```
root@1857770b4e10e8:/# cat secret-file
Hello! I'm Frankie the balloon!
```

It can be useful to store multiple key-value pairs in a single secret. The following command Base64-encodes the contents of the text file `local-secrets` and registers the Base64-encoded string as the value of the secret `MY_SECRETS` on the app:

```cmd
fly secrets set MY_SECRETS="$(base64 < local-secrets)" --stage
```

Run a new Machine with the `MY_SECRETS` secret available in a file (`/secret-file`):

```cmd
fly machine run ubuntu sleep inf --file-secret /secret-file=MY_SECRETS
```

Check it in a shell session:

```cmd
root@d891116b465018:/# cat secret-file
USER="my_name"
PASSWORD="1a2s3d4f"
MACARON="macaroon in French"
```

If a particular process or user on the Machine should not have access to the secret, you can use an entrypoint script to change permissions on the secret file.

<div class="warning icon">
**Warning:** This is not a way to hide secret values from members of an app's organization who have deployment privileges. Access via `fly ssh` commands is root access. All secrets that are set on an app are available, as either env vars or a file, in any Machine that gets updated after the secret is set.
</div>

In the case of secrets, the data itself is not stored in the Machine config; instead, the name of the secret is stored in the `files.secret_name` config property and when the Machine is created, that secret is retrieved from the vault and its decoded value is written to the file.

## Create a standby Machine

For the sake of resilience, you can create a stopped [standby](/docs/reference/app-availability/#standby-machines-for-process-groups-without-services) for Machines that don't have Fly Proxy services and therefore can't be supplemented by Fly Proxy "autostart" in case of a host failure.

```cmd
fly machine run . --standby-for 287444ec026748,148ed726c54768
```

Standby Machines normally remain stopped unless the watched Machines are affected by a host failure. To allow a standby Machine to be started, you can clear its standby configuration [with `fly machine update`](/docs/machines/flyctl/fly-machine-update/#make-a-standby-machine-a-normal-machine).


The `--standby-for` flag sets the [`config.standbys`](/docs/machines/api-machines-resource/#machine-config-object-properties) Machine property.

## Start a Machine on a schedule

Use the `--schedule` flag to set the Machine's [`config.schedule`](/docs/machines/api-machines-resource/#machine-config-object-properties) property, which starts the Machine on a fuzzy `hourly`, `daily`, `weekly`, or `monthly` cycle. This is useful for running Machines that do a finite job, then exit. The Machine is started the first time when you run `fly machine run`, and again once per (approximate) hour, day, week, or month. Scheduled machines cannot be started via flyctl or Machines API commands, they will only run according to the schedule.

<div class="important icon">
**Important:** If the host on which a stopped Machine resides doesn't have the resources to start it when its scheduled time comes, you'll get an error back. It's up to you to build the appropriate level of redundancy into your apps.
</div>
