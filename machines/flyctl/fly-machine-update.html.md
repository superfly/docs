---
title: Update a Machine
objective: Update the configuration or Docker image of a Fly Machine with flyctl
layout: docs
nav: machines
---

The [`fly machine update`](/docs/flyctl/machine-update/) command updates the configuration of an individual, existing Fly Machine.

Many, but not all, [Machine configuration](/docs/machines/api-machines-resource/#machine-config-object-properties) options are available to the `fly machine update` command through flags. The available flags are listed in the flyctl help and on the [`fly machine update` reference page](/docs/flyctl/machine-update/).

## What it does

Here's what `fly machine update` does for you:
* Optionally, builds a new image and pushes it to the Fly.io registry. 
* Compares the Machine's existing configuration and confirms the changes you've asked for by passing it flags.
* Composes a complete Machine configuration using the existing config plus your changes and passes this to the Machines update API endpoint.
* Recreates the Machine with the new config, and, by default, starts it.
* By default, waits for the Machine to start, and for any configured health checks to pass, before declaring success (or failure).

## Usage

Here's the usage of `fly machine update`:

```cmd
fly machine update [machine_id] [flags]
```

You can get the `machine_id` with [`fly machine list`](/docs/flyctl/machine-list/). You can omit the `machine_id` if an app name is available from a `fly.toml` file in the working directory, or if the `--app` flag is passed with the `fly machine update` command.

## Select a Machine to update

If you provide a `machine_id`, you don't have to provide an app name. If `fly machine update` finds an app name, either inside a `fly.toml` config file in the working directory or through the use of the `--app` flag, then you are presented with a selector in the CLI and can choose a Machine to act on.

### Build from a Dockerfile

Use the `--dockerfile` option to build the image for the Machine from a Dockerfile. For example:

```cmd
fly machine update --dockerfile Dockerfile
```

Any source files the Dockerfile uses should be present in the working directory. Once built, the image is pushed to the Fly.io Docker registry where your organization's remote builders can access it.

### Use an existing image

Use the `--image` flag to specify an existing container image. For example:

```cmd
fly machine update --image ghcr.io/livebook-dev/livebook:0.11.4     
```

## Set the timeout to wait for the Machine to successfully update

The `--wait-timeout` flag tells the `fly machine update` command how many seconds to wait for individual machines to transition states and for any health checks to pass. The default is 300.

## Use a custom ENTRYPOINT or CMD

You can have the Fly.io `init` override the ENTRYPOINT and CMD (if any) of the Machine's Docker image.

### Custom CMD

Set the [`config.init.cmd`](/docs/machines/api-machines-resource/#machine-config-object-properties) property with the `--command` flag. This example replaces CMD with a `sleep` task:

```cmd
fly machine update --command sleep inf
```

### Custom ENTRYPOINT

Set the [`config.init.entrypoint`](/docs/machines/api-machines-resource/#machine-config-object-properties) property with the `--entrypoint` option.

See [Run a new Machine](/docs/machines/flyctl/fly-machine-run/#custom-entrypoint) for an example of usage.

## Set Machine resources

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#set-machine-resources).

## Set environment variables

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#set-environment-variables).


## Define a Fly Proxy network service
As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#define-a-fly-proxy-network-service). 

## Set Fly Proxy auto start and auto stop
As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#set-fly-proxy-auto-start-and-auto-stop).

## Stop or restart the Machine on process exit

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#stop-or-restart-the-machine-on-process-exit). 

## Destroy the Machine when it exits

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#destroy-the-machine-when-it-exits).

## Add metadata to the Machine

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#add-metadata-to-the-machine).

## Change the mount point of an attached volume

You can't detach a volume from an existing Machine, nor attach a new one. You can change the mount point of an attached volume using the `--mount-point` flag.

This sets the Machine's [`config.mounts.path`](/docs/machines/api-machines-resource/#machine-config-object-properties) property.

## Place data into files on the Machine

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#place-data-into-files-on-the-machine).

## Make the Machine a stopped standby

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#create-a-standby-machine).

## Make a standby Machine a normal Machine

If a Machine is configured as a standby, it doesn't start unless one of its watched Machines experiences host failure. To clear a Machine's standby configuration and allow it to be started under other conditions, use the `--standby-for` flag with an empty string:

```cmd
fly machine update <machine-id> --standby-for ""
```

## Start the Machine on a schedule

As for [`fly machine run`](/docs/machines/flyctl/fly-machine-run/#start-a-machine-on-a-schedule).
