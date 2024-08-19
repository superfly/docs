---
title: Autoscale Machines
layout: docs
nav: firecracker
redirect_from: /docs/blueprints/autoscale-machines-like-a-boss/
---

You have an app with services that's configured to [automatically start
and stop Machines based on traffic demand]((/docs/launch/autostop-autostart/)). But the traffic to your app changes
significantly during the day and you don't want to keep a lot of stopped
Machines during the period of low traffic.

This blueprint will guide you through the process of configuring the
[`fly-autoscaler` app](/docs/launch/autoscale-by-metric/) in conjunction with 
[Fly Proxy autostop/autostart](/docs/launch/autostop-autostart/) to 
always keep a fixed number of Machines ready to be quickly started 
by Fly Proxy.

## Configure autostop/autostart

First, if you haven't already done so, configure the app to allow Fly Proxy to automatically start and
stop or suspend Machines based on traffic demand. The autostop/autostart settings apply
per service, so you set them within the `[[services]]` or `[http_service]`
sections of `fly.toml`:

```toml
...
[[services]]
  ...
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
...
```

With these settings Fly Proxy will start an additional Machine if all the
running Machines are above their concurrency `soft_limit` and stop running
Machines when the traffic decreases. You can set Machines to `"suspend"` rather than
`"stop"`, for even faster start-up, but with some [limitations on the type of Machine](https://community.fly.io/t/new-feature-in-preview-suspend-resume-for-machines/20672#current-limitations-and-caveats-8).

In the next section you'll configure
and deploy `fly-autoscaler` to ensure that the app always has a spare stopped
Machine for Fly Proxy to start.

## Configuring and deploying fly-autoscaler

`fly-autoscaler` is a metrics-based autoscaler that scales an app’s Machines
based on any metric. You can configure it to ensure that there is always
additional Machine available for Fly Proxy to start if the traffic increases.

First, create a new Fly.io app that will run the autoscaler.

```
$ fly apps create my-autoscaler
```

Create a deploy token so that the autoscaler app has permissions to scale your
target app up and down:

```
$ fly tokens create deploy -a my-target-app
$ fly secrets set -o my-autoscaler --stage FAS_API_TOKEN="FlyV1 ..."
```

Create a read-only token so that the autoscaler app has access to a Prometheus instance:

```
$ fly tokens create readonly -o my-org
$ fly secrets set -o my-autoscaler --stage FAS_PROMETHEUS_TOKEN="FlyV1 ..."
```

Configure your autoscaler `fly.toml` like this:

```toml
app = "my-autoscaler"

[build]
image = "flyio/fly-autoscaler:0.3.1"

[env]
FAS_PROMETHEUS_ADDRESS = "https://api.fly.io/prometheus/my-org"
FAS_PROMETHEUS_METRIC_NAME = "running_machines"
FAS_PROMETHEUS_QUERY = "count(fly_instance_up{app='$APP_NAME'})"

FAS_APP_NAME = "my-target-app"
FAS_CREATED_MACHINE_COUNT = "min(running_machines + 1, 10)"
FAS_INITIAL_MACHINE_STATE = "stopped"

[metrics]
port = 9090
path = "/metrics"
```

With this configuration, the autoscaler will create a new stopped Machine as
soon as all available Machines are running (but never more than 10), and will destroy extra stopped
Machines if more than one Machine is stopped.

Make sure you are using autoscaler version 0.3.1 or newer for
`FAS_INITIAL_MACHINE_STATE` configuration option to work.

And finally, deploy the autoscaler, using the `--ha` option to deploy only one Machine:

```
$ fly deploy --ha=false
```

## Read more

- [Autoscale based on metrics](/docs/launch/autoscale-by-metric/)

- [Autostop/autostart Machines](/docs/launch/autostop-autostart/)

- [Autostop/autostart private apps](/docs/blueprints/autostart-internal-apps/)
