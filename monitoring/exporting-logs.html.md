---
title: Export logs
layout: docs
objective: Aggregate your logs to a service of your choice.
nav: firecracker
redirect_from:
  - /docs/going-to-production/monitoring/exporting-logs/
  - /docs/metrics-and-logs/exporting-logs/
---

The Fly Log Shipper app enables you to aggregate your app's logs to a service of your choice.

Your app's output to `stdout` become logs in Fly.io. Live log tail and log search are good enough for most things. But if you need to export your logs to an external service, such as Datadog or AWS S3, then you can use the Log Shipper.

## The Fly Log Shipper

Here's the easiest way to ship your logs to a location of your choosing.

The [Fly Log Shipper app](https://github.com/superfly/fly-log-shipper+external) hooks into Fly.io's internal log stream. You can run this in your Fly.io organization like any other app.

The Fly Log Shipper runs [Vector](https://vector.dev/+external), which grabs the logs and sends them to a location of your choosing (via a Vector [sink](https://vector.dev/docs/reference/configuration/sinks/+external)).

You can select one or more items from the list of supported [Providers (sinks)](https://github.com/superfly/fly-log-shipper#provider-configuration+external) and configure the Fly Log Shipper to run those sinks.

Each provider just needs some environment variables (or secrets) set for them to work.

## Using the Fly Log Shipper

Here's an example. To ship logs to [Logtail](https://betterstack.com/logtail+external), you would do the following:

```bash
# Make a directory for your log shipper app
mkdir logshippper
cd logshippper

# Create the app but don't deploy just yet
fly launch --no-deploy --image ghcr.io/superfly/fly-log-shipper:latest

# Set some secrets. The secret / env var you set
# determines which "sinks" are configured
ORG=personal
fly secrets set ORG=$ORG
fly secrets set ACCESS_TOKEN=$(fly tokens create readonly $ORG)
fly secrets set LOGTAIL_TOKEN=<token provided by logtail source>
```

You can configure as many providers as you'd like by adding more secrets. The secrets needed are determined by [which provider(s)](https://github.com/superfly/fly-log-shipper#provider-configuration+external) you want to use.

Before launching your application, you should edit the generated `fly.toml` file and delete the entire `[[services]]` section. Replace it with this:

```toml
[[services]]
  http_checks = []
  internal_port = 8686
```

Then you can deploy it:

```cmd
fly deploy
```

## Shipping specific logs

By default, the log shipper gets logs from every app running within your organization (organization is set by the `ORG` secret/environment variable).

To narrow that down, you can set a [`SUBJECT`](https://github.com/superfly/fly-log-shipper#subject+external) environment variable in your instance of the Fly Log Shipper. That can be set as a secret, or as an environment variable in your `fly.toml` file.

Subjects are in the format `logs.<app_name>.<region>.<instance_id>`. You can set the Log Shipper to narrow down to a specific instance, a specific region, and/or a specific application.

There are [2 wildcards](https://docs.nats.io/nats-concepts/subjects#wildcards+external) you can use:

* `*` wildcards go between strings and can be used multiple times
* `>` wildcards go at the end of a string and can be used once

For example, to only ship logs for an application named `sandwich`, you would set the `SUBJECT` environment variable like so (in your Log Shipper `fly.toml` file):

```toml
[env]
  SUBJECT = "logs.sandwich.>"
```

This uses wildcard `>` to say to grab all logs from application `sandwich` no matter what region or instance they came from.

Another example:

```toml
[env]
  SUBJECT = "logs.*.dfw.>"
```

This `SUBJECT` says to grab logs from all instances of any applications hosted in the `dfw` region.

## Configuring Vector

Based on your provider (or preferences), it may be necessary to customize the [Vector configuration](https://vector.dev/docs/reference/configuration/+external). This is done with a `vector.toml` configuration file and, thanks to [Machine files](/docs/reference/configuration/#the-files-section), it's as simple as copying the [source](https://github.com/superfly/fly-log-shipper/blob/3b780b3a3c68fdbbbb55430d7d9ff1eb377fdbf0/vector-configs/vector.toml+external) `vector.toml` to a local directory, modifying it according to your requirements, then saving it and redeploying:

```sh
fly deploy --file-local="/etc/vector/vector.toml=/path/to/local/vector.toml"
```

That's it! The baked in config file is overwritten and Vector will use your modified config.

## Internals

Fly.io ships logs through a [NATS](https://nats.io+external) stream. This is available to all of your apps via `nats://[fdaa::3]:4223`, which is where the Log Shipper grabs the logs.

The Vector configuration to grab those logs within the Log Shipper is in the [vector.toml file](https://github.com/superfly/fly-log-shipper/blob/main/vector-configs/vector.toml+external).

You can contribute to (or, you know, fork) this repository to add providers (sinks) of your own!

## Avoid duplicate log messages in high availability apps

If you want to run more than one Machine for high availability, the [NATS](https://docs.nats.io/) endpoint supports [subscription queues](https://docs.nats.io/nats-concepts/core-nats/queue) to ensure messages are only sent to one subscriber of the named queue. The `QUEUE` secret can be set to configure an arbitrary queue name in your Log Shipper `fly.toml` file if you want to run multiple log processes for HA and avoid duplicate messages being shipped. For example:

```toml
[env]
  QUEUE = "org-logs"
```
