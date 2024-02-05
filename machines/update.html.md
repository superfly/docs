---
title: Update a Machine
objective: Update the configuration or Docker image of a Fly Machine with flyctl
layout: docs
nav: machines
order: 6
---

The [`fly machine update` command](/docs/flyctl/machine-update/) is a tool to update an individual, existing Fly Machine.

Here's what `fly machine update` does for you:
* Checks the working directory for a `fly.toml` file to get an app name from. If it finds one there, or if you provide an app name with the `--app` flag, it will only let you select a Machine belonging to that app.





* Creates a Fly App, if applicable
* Gets, or builds, a Docker image to make the Machine from
* Creates the Machine with some default config, plus config you pass to it with flags
* Starts the Machine
* Waits for the Machine to start before declaring success (or failure)



## Usage

Here's the usage of `fly machine update`:

```cmd
fly machine update [machine_id] [flags]
```

You can get the `machine_id` with [`fly machine list`](/docs/flyctl/machine-list/). You can omit the `machine_id` if an app name is available from a `fly.toml` file in the working directory, or the `--app` flag passed with the `fly machine update` command.
 
Many, but not all, Machine configuration options are available to the `fly machine update` command through flags. Flags are listed in the flyctl help and on the [`fly machine update` documentation page](/docs/flyctl/machine-update/).

### Build from a Dockerfile

Use the `--dockerfile` option to build the image for the Machine from a Dockerfile. For example:

```cmd
fly machine update --dockerfile Dockerfile
```

Any source files the Dockerfile uses should be present in the working directory. Once built, the image is pushed to the Fly.io Docker registry where your organization's remote builders can access it.

### Use an existing image

Usse the `--image` flag to specify an existing container image. For example:

```cmd
fly machine update --image ghcr.io/livebook-dev/livebook:0.11.4     
```
## Don't start the Machine

      --skip-start                  Updates machine without starting it.

## Set the timeout to wait for the machine to become healthy before ...
      --wait-timeout int            Seconds to wait for individual machines to transition states and become
                                    healthy. (default 300) (default 300)

## Accept all confirmations
  -y, --yes                         Accept all confirmations


## Use a custom ENTRYPOINT or CMD

You can have the Fly Platform init override the ENTRYPOINT and CMD (if any) of the Machine's Docker image at startup.

### Custom CMD

Override CMD with the `--command` flag. This example simply spins up a Debian Linux Machine with a `sleep` task to keep it awake; you can shell into it or whatever:

```cmd
??fly machine update --command debian sleep inf
```

### Custom ENTRYPOINT

Override ENTRYPOINT using `--entrypoint`. In this example we use the [`--file-local` option](/docs/machines/run#copy-a-local-file-into-the-machine-file-system) to send an entrypoint script to the Machine and the `--entrypoint` option to run the script:

```cmd
fly machine update debian --file-local /entrypoint.sh=./entrypoint.sh \
                       --entrypoint "/entrypoint.sh" \
                       sleep inf
```

Here's a trivial `entrypoint.sh` you can use with the above example:

```bash
#! /bin/bash

echo "Hello from my Fly Machine"

exec "$@"
```

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
fly machine update --env MY_VAR=MY_VALUE \
                  --env MY_OTHER_VAR="my spacey value" \
                  --app my-app-name
```

Use quotes around the value if it has spaces in it.

For sensitive environmment variables, [set secrets on the app](https://fly.io/docs/flyctl/secrets/) instead.

## Configure a network service

The `--port` flag on `fly machine update` allows you to configure a Fly Proxy service for the Machine. Not all the service config options are available through `fly machine update`.

Map any "external" ports, where the Fly Proxy accepts requests directed at the app, to the internal port where the service is listening on IPv4, and for each port, specify the protocol and [connection handler(s)](/docs/networking/services/#connection-handlers), using this format: `port[:machinePort][/protocol[:handler[:handler...]]]`.

For example, if your Machine runs a server on port 80, and the Fly Proxy should handle HTTP connections on port 80 and HTTPS connections on port 443, the port configuration would look like this: 

```cmd
fly machine update --port 80/tcp:http \
                  --port 443:80/tcp:http:tls 
```

<div class="important icon">
**Important:** Even with a service defined, a Machine must have an Anycast IP address to be publicly accessible.
</div>

## Configure starting and stopping by the Fly Proxy

[Read more about Fly Proxy autostart and autostop](/docs/apps/autostart-stop/#how-it-works).

Test what's default when you run the Machine, and what's default when you start via API. Put some of this into the Machine config doc instead.

In a Machine service's configuration, `autostop` and `autostart` settings are optional. 

When the `autostop` setting is absent, the Fly Proxy never shuts down the Machine, even if there is no traffic to it.

When the `autostart` setting is absent, if the Machine is stopped the proxy may start it according to its load-balancing rules. 

The `--autostart` and `--autostop` flags set the value of `machine.auto_start` or `machine.auto_stop` to `true` by unless you provide the value `false`. For example, the following configures a Machine to be stopped by the Fly Proxy, but not to be restarted by it.

```cmd
fly machine update  --autostop \
                    --autostart=false
```

If you define more than one service on the Machine, and also use one or both of these flags, it applies to both the services in the Machine config. For more control over configuration of an individual Machine, use the API.

## Set a restart policy on process exit

A Machine's [restart policy](/docs/machines/guides-examples/machine-restart-policy/]) defines whether and how flyd restarts a Machine after its main process exits, before allowing it to reach the `stopped` state. You may want a Machine to try to restart after a crash, for example.

This policy does not apply when a Machine is stopped from outside, such as when you use the [fly machine stop](/docs/flyctl/machine-stop) command.

Set it using the `--restart` option. Options are `no`, `always`, and `on-fail`. 

The default restart policy for a Machine created using `fly machine update` is `always`, unless you use the [`--rm` option](#automatically-destroy-the-machine-when-it-exits), in which case the default is `no`.

## Automatically destroy the Machine when it exits

By default, when a Machine is `stopped`, its file system is reset using its config and Docker image, and it sits ready to be `started` again. Use the `--rm` flag to cause the Machine to instead be destroyed when it stops.

The default [restart policy](#set-a-restart-policy-on-process-exit) for a Machine created with `fly machine update --rm` is `no`, to ensure that flyd doesn't ignore the exit code and restart the Machine.

## Add metadata to the Machine

The Fly Platform uses specific metadata, stored in a Machine's config, for its own purposes, such as assigning Machines to process groups. You can add custom metadata as well.

The following starts a Machine that the `fly deploy` command will try to manage as part of the `app` process group, replacing its image and config with what, if anything, you have set up in the working directory for that app. 

```
fly machine update --metadata fly_platform_version=v2 \
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
## Change the mount point of an attached volume
  You can't detach a volume or attach a new one but you can change the mount point of an attached one.
      --mount-point string          New volume mount point

## Place data into files on the Machine

Configuration can be used to place a limited quantity of data into files on a Machine's file system. The `fly machine update` command has three ways to make use of this. 

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

Use the `--file-secret` flag on `fly machine update`. In this example I'm putting the contents of the secret called `MY_BASE64_SECRET` into a file `/secret-file` on my new Machine:

```cmd
fly machine update --file-secret /secret-file=MY_BASE64_SECRET 
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
fly machine update --file-literal /b64file=SGVsbG8hIEknbSBGcmFua2llIHRoZSBiYWxsb29uIQo=
```

The Base64 encoding is preserved in a file created using the `--file-literal` flag.

```
root@1857779a44d108:/# cat b64file | base64 --decode
Hello! I'm Frankie the balloon!
```

## Make the Machine a stopped standby

For the sake of resilience, you can create a stopped [standby](/docs/reference/app-availability/#standby-machines-for-process-groups-without-services) for Machines that don't have Fly Proxy services and therefore can't be supplemented by Fly Proxy "autostart" in case of a host failure.

```
fly machine update --standby-for 287444ec026748,148ed726c54768
```

## Start the Machine on a schedule

Use the `--schedule` flag to configure the Machine to start on a fuzzy `hourly`, `daily`, `weekly`, or `monthly` cycle. This is useful for running Machines that do a finite job, then exit. The Machine is started the first time when you run `fly machine update`, and again once, each (approximate) hour, day, week, or month.

<div class="important icon">
**Important:** If the host on which a stopped Machine resides doesn't have the resources to start it when its scheduled time comes, you'll get an error back. It's up to you to build the appropriate level of redundancy into your apps.
</div>
