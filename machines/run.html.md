---
title: Run a new Machine
objective: Run a new Fly Machine with flyctl
layout: docs
nav: machines
order: 5
---

The [`fly machine run` command](/docs/flyctl/machine-run/) is a tool to configure, build, and run a new Machine in a single guided interaction.

Use `fly machine run` to include Machines built from more than one single Docker image in a Fly App, or to run a one-off or temporary Machine.

Fly Launch features like `fly deploy`, `fly status`, and `fly scale` don't apply to Machines created with `fly machine run`, unless you [add metadata to indicate otherwise](/docs/machines/run#add-metadata-to-the-machine).

Here's what `fly machine run` does for you:
* Checks with the platform for the org and app you've specified, if any, and if needed, guides you through naming a new app
* Creates a Fly App, if applicable
* Gets, or builds, a Docker image to make the Machine from
* Creates the Machine with some default config, plus config you pass to it with flags
* Starts the Machine
* Waits for the Machine to start before declaring success (or failure)

To create a Machine, but not start it, use [`fly machine create`](/docs/flyctl/machine-create/).

To make changes to a Machine once it's created or run, use [`fly machine update`](/docs/flyctl/machine-update/).

To create and run a new Machine with the same configuration as an existing Machine, use [`fly machine clone`](/docs/flyctl/machine-clone/).

<div class="note icon">
**Note:** Creating a new Machine is not the fastest way to scale an app's capacity; for quick changes in the number of running Machines, prefer [`fly machine start`](/docs/flyctl/machine-start/) and [`fly machine stop`](/docs/flyctl/machine-stop/).
</div>


## Usage

Here's the usage of `fly machine run`:

```cmd
fly machine run <image> [command] [flags]
```
 
Here, `<image>` can point to a prebuilt image, or to the current directory (`.`) to build from a Dockerfile.

Many, but not all, Machine configuration options are available to the `fly machine run` command through flags. Flags are listed in the flyctl help and on the [`fly machine run` documentation page](/docs/flyctl/machine-run/).

## Administration: set the Machine's app and org

The default behavior of `fly machine run` is to create a new Fly App for the new Machine to belong to, unless it's given the name of an existing app in one of two ways:

1. Like many other flyctl commands, `fly machine run` looks for a `fly.toml` app config file in the working directory, and if it finds one with an app name inside, it adds the new Machine to that app. It disregards the rest of the configuration in the file.
2. If you pass it an app name with `--app <app-name>`, flyctl prefers that name over any name it gets from a `fly.toml`.

If the app name doesn't belong to an existing app in one of your orgs, flyctl asks if you want to create it. 

Even if you're not using `fly deploy` to configure and run any of your app's Machines, it may be worth creating a `fly.toml` file with just an app name in it, to save using the `--app` option repeatedly. For example:

```toml
# a fly.toml just to provide an app name to commands 
# run from the same directory

app = my-app-name
```
 
Use `--org <org-name>` to specify which organization a newly created app should belong to. The `--org` flag is ignored when creating the new Machine in an existing app.


## Get or build the Docker image

All Fly Machines are made from Docker images. When you `fly launch` an app, this may be invisible; a Fly Launch scanner may generate one for you based on your source code.

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

You can have the Fly Platform init override the ENTRYPOINT and CMD (if any) of the Machine's Docker image at startup.

### Custom CMD

Override CMD by including the command to run at the end of the `fly machine run` invocation. This example simply spins up a Debian Linux Machine with a `sleep` task to keep it awake; you can shell into it or whatever:

```cmd
fly machine run debian sleep inf
```

### Custom ENTRYPOINT

Override ENTRYPOINT using `--entrypoint`. In this example we use the [`--file-local` option](/docs/machines/run#copy-a-local-file-into-the-machine-file-system) to send an entrypoint script to the Machine and the `--entrypoint` option to run the script:

```cmd
fly machine run debian --file-local /entrypoint.sh=./entrypoint.sh \
                       --entrypoint "/entrypoint.sh" \
                       sleep inf
```

Here's a trivial `entrypoint.sh` you can use with the above example:

```bash
#! /bin/bash

echo "Hello from my Fly Machine"

exec "$@"
```

## Choose the region

Tell the Fly Platform which [region](/docs/reference/regions/) to create the Machine in with the `--region` flag; if for some reason it can't start a new Machine in that region, you'll get an error. If the `--region` flag is omitted, the platform chooses the nearest region to you.


## Set Machine resources

Include one or more of the following options to use non-default specifications for the Machine to be run:

```
--vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
--vm-cpus int                 Number of vCPUs
--vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb)
--vm-memory string            Memory (in megabytes) to attribute to the VM
--vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
```

GPUs are only available on orgs for which they've been explicitly enabled.

## Set environment variables

Specify environment variables to be available on the Machine with the `--env` flag, using NAME=VALUE pairs.

Example:

```cmd
fly machine run . --env MY_VAR=MY_VALUE \
                  --env MY_OTHER_VAR="my spacey value" \
                  --app my-app-name
```

Use quotes around the value if it has spaces in it.

For sensitive environmment variables, [set secrets on the app](https://fly.io/docs/flyctl/secrets/) instead.

## Define a network service

Define a service when the Machine should be reachable by the Fly Proxy, either via an [Anycast](https://fly.io/docs/networking/services/#ip-addresses) or [Flycast](/docs/networking/private-networking/#flycast-private-load-balancing) IP address or through [`fly-replay` dynamic routing](/docs/networking/dynamic-request-routing/).


To make an internal service on the Machine reachable via the Fly Proxy, use the `--port` option. Map any "external" ports, where the Fly Proxy accepts requests directed at the app, to the internal port where the service is listening on IPv4, and for each port, specify the protocol and [connection handler(s)](/docs/networking/services/#connection-handlers), using this format: `port[:machinePort][/protocol[:handler[:handler...]]]`.

For example, if your Machine runs a server on port 80, and the Fly Proxy should handle HTTP connections on port 80 and HTTPS connections on port 443, the port configuration would look like this: 

```cmd
fly machine run . --port 80/tcp:http \
                  --port 443:80/tcp:http:tls \
                  --app my-app-name      
```

<div class="important icon">
**Important:** Even with a service defined, a Machine is not publicly accessible unless it has an Anycast IP address.
</div>

<div class="important icon">
**Important:** If Machines within the same Fly App host different services, use different external ports so that they don't receive requests meant for another Machine.
</div>


## Set autostart and autostop

[Read more about Fly Proxy autostart and autostop](/docs/apps/autostart-stop/#how-it-works).

In a Machine service's configuration, `autostop` and `autostart` settings are optional. 

When the `autostop` setting is absent, the Fly Proxy never shuts down the Machine, even if there is no traffic to it.

When the `autostart` setting is absent, if the Machine is stopped the proxy may start it according to its load-balancing rules. 


The `--autostart` and `--autostop` flags set the value of `autostart` or `autostop` to `true` by default; to set the value to `false`, set the value explicitly. For example, the following runs a new Machine that may be stopped by the Fly Proxy, but will never be restarted by it.

```cmd
fly machine run nginx --port 80:80/tcp:http \
                --port 443:80/tcp:http:tls \
                --autostop \
                --autostart=false
```

If you define more than one service on the Machine, and also use one or both of these flags, it applies to both the services in the Machine config.

## Set a restart policy on process exit

A Machine's [restart policy](/docs/machines/guides-examples/machine-restart-policy/]) defines whether and how flyd restarts a Machine after its main process exits, before allowing it to reach the `stopped` state. You may want a Machine to try to restart after a crash, for example.

This policy does not apply when a Machine is stopped from outside, such as when you use the [fly machine stop](/docs/flyctl/machine-stop) command.

Set it using the `--restart` option. Options are `no`, `always`, and `on-fail`. 

The default restart policy for a Machine created using `fly machine run` is `always`, unless you use the [`--rm` option](#automatically-destroy-the-machine-when-it-exits), in which case the default is `no`.

## Automatically destroy the Machine when it exits

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


## Add metadata to the Machine

The Fly Platform uses specific metadata, stored in a Machine's config, for its own purposes, such as assigning Machines to process groups. You can add custom metadata as well.

The following starts a Machine that the `fly deploy` command will try to manage as part of the `app` process group, replacing its image and config with what, if anything, you have set up in the working directory for that app. 

```
fly machine run . --metadata fly_platform_version=v2 \
                  --metadata fly_process_group=app \
                  --metadata my_metadata=mineallmine
```

You can see the metadata in the Machine config: 

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


## Name the Machine

The Fly Platform gives human-friendly names, like `ancient-glitter-2128`, that show up alongside their `id` in the output of commands like `fly machine list`.

You may want to give the Machine a custom name, so you can easily recognize it. Use the `--name` flag:

```cmd
fly machine run . --name my-special-Machine
```

## Place data into files on the Machine

Configuration can be used to place a limited quantity of data into files on a Machine's file system. The `fly machine run` command has three ways to make use of this. 

<div class="important icon">
**Important:** This won't work for large files, as there's a limit to how much data can be stored in an app secret or a Machine's configuration.
</div>

### Copy a local file into the Machine file system

If it's not convenient to build a file into the Machine's Docker image, use the `--file-local` flag to store the contents of a local file in its configuration instead. 

```
--file-local /path/inside/machine=local/path
```

The file's contents are stored as a Base64-encoded string as part of the Machine configuraton, and decoded to the original text on the Machine. There's a limit to how large a file you can create in this way.

### Make a secret into a file instead of an env var

[Fly Secrets](/docs/reference/secrets/) are stored in an encrypted vault, and become environment variables on each Machine started on the app.

You can configure a Machine to store secret values in the form of a file, rather than an environment variable. Encode the data in Base64 format and put it into an app secret with `fly secrets set`. Use the `--stage` flag to prevent flyctl from initiating a deployment once the secret is registered.

```cmd
fly secrets set \
  MY_BASE64_SECRET=SGVsbG8hIEknbSBGcmFua2llIHRoZSBiYWxsb29uIQo= \
  --stage
```

Use the `--file-secret` flag on `fly machine run`. In this example I'm putting the contents of the secret called `MY_BASE64_SECRET` into a file `/secret-file` on my new Machine:

```cmd
fly machine run . \
  --file-secret /secret-file=MY_BASE64_SECRET 
```

The secret will be available in the specified file, and not in an environment variable, on that Machine. It's decoded from Base64 into plain text.

```
root@1857770b4e10e8:/# cat secret-file
Hello! I'm Frankie the balloon!
```

If a process or user on the Machine should not have access to the secret, you can use an entrypoint script to change permissions on the secret file.

<div class="important icon">
**Important:** This is not a way to hide secret values from members of an app's organization who have deployment privileges. Access via `fly ssh` commands is root access. In addition, all secrets that are set on an app are available as env vars in any Machine that gets updated after the secret is set, except for Machines configured with `--file-secret` to put the secret into a file instead.
</div>

### Make a file out of a Base64-encoded string

You can place data directly into the Machine through its config as a Base64-encoded string:

```cmd
fly machine run . --file-literal /b64file=SGVsbG8hIEknbSBGcmFua2llIHRoZSBiYWxsb29uIQo=
```

The Base64 encoding is preserved in a file created using the `--file-literal` flag.

```
root@1857779a44d108:/# cat b64file | base64 --decode
Hello! I'm Frankie the balloon!
```

## Create a standby Machine

For the sake of resilience, you can create a stopped [standby](/docs/reference/app-availability/#standby-machines-for-process-groups-without-services) for Machines that don't have Fly Proxy services and therefore can't be supplemented by Fly Proxy "autostart" in case of a host failure.

```
fly machine run . --standby-for 287444ec026748,148ed726c54768
```

## Start a Machine on a schedule

Use the `--schedule` flag to start the Machine on a fuzzy `hourly`, `daily`, `weekly`, or `monthly` cycle. This is useful for running Machines that do a finite job, then exit. The Machine is started the first time when you run `fly machine run`, and again once, each (approximate) hour, day, week, or month.

<div class="important icon">
**Important:** If the host on which a stopped Machine resides doesn't have the resources to start it when its scheduled time comes, you'll get an error back. It's up to you to build the appropriate level of redundancy into your apps.
</div>
