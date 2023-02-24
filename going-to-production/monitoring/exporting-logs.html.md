---
title: Exporting Logs
layout: framework_docs
objective: Aggregate your logs to a service of your choice.
order: 1
status: beta
---

Your applications' output to `stdout` become logs in Fly.io. The logs for all VM instances within any given app can be viewed within an app's Monitoring page. However, these logs are intermingled and do not persist very long.

If you need or want your logs to be aggregated to one spot, more organized, or to persist longer than we keep them, you can!

## The Fly Log Shipper

Here's the easiest way to ship your logs to a location of your choosing.

We provide [an application](https://github.com/superfly/fly-log-shipper) that hooks into Fly.io's internal log stream. We've named it Fly Log Shipper. You run this in your Fly.io organization like any other application!

This runs [Vector](https://vector.dev/), which grabs the logs and sends them to a location of your choosing (via a Vector [sink](https://vector.dev/docs/reference/configuration/sinks/)).

You can select one or more items from the list of supported [Providers (sinks)](https://github.com/superfly/fly-log-shipper#provider-configuration) and configure the application to run those sinks.

Each provider just needs some environment variables (or secrets) set for them to work.

## Using the Fly Log Shipper

Here's an example. To ship logs to [Logtail](https://betterstack.com/logtail), you would do the following:

```bash
# Make a directory for your log shipper app
mkdir logshippper
cd logshippper

# Create the app but don't deploy just yet
fly launch --no-deploy --image ghcr.io/superfly/fly-log-shipper:latest

# Set some secrets. The secret / env var you set
# determines which "sinks" are configured
fly secrets set ORG=personal
fly secrets set ACCESS_TOKEN=$(fly auth token)
fly secrets set LOGTAIL_TOKEN=<token provided by logtail source>
```

You can configure as many providers as you'd like by adding more secrets. The secrets needed are determined by [which provider(s)](https://github.com/superfly/fly-log-shipper#provider-configuration) you want to use.

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

## Shipping Specific Logs

By default, the log shipper gets logs from *every* application running within your organization (which organization is set by the `ORG` secret/environment variable).

To narrow that down, you can set a [`SUBJECT`](https://github.com/superfly/fly-log-shipper#subject) environment variable in your instance of the Fly Log Shipper. That can be set as a secret, or as an environment variable in your `fly.toml` file.

Subjects are in the format `logs.<app_name>.<region>.<instance_id>`. You can set the Log Shipper to narrow down to a specific instance, a specific region, and/or a specific application.

There are [2 wildcards](https://docs.nats.io/nats-concepts/subjects#wildcards) you can use:

* `*` wildcards go between strings and can be used multiple times
* `>` wildcards go at the end of a string and can be used once

For example, to only ship logs for an application named `sandwhich`, you would set the `SUBJECT` environment variable like so (in your Log Shipper `fly.toml` file):

```toml
[env]
  SUBJECT = "logs.sandwich.>"
```

This uses wildcard `>` to say to grab all logs from application `sandwhich` no matter what region or instance they came from.

Another example:

```toml
[env]
  SUBJECT = "logs.*.dfw.>"
```

This `SUBJECT` says to grab logs from all instances of any applications hosted in the `dfw` region.

## Internals

Fly.io ships logs through a [NATS](nats.io) stream. This is available to all of your applications via `nats://[fdaa::3]:4223`, which is where the Log Shipper grabs the logs.

The Vector configuration to grab those logs within the Log Shipper is [seen here](https://github.com/superfly/fly-log-shipper/blob/main/vector-configs/vector.toml).

You can contribute to (or, you know, fork) this repository to add providers (sinks) of your own!
