---
title: Autoscaling
layout: docs
sitemap: false
nav: firecracker
---

Autoscaling is used to increase the number of Fly Machines based on demand. There are two forms of autoscaling supported:

1. Pre-allocated Machine autoscaling
2. Metrics-based autoscaling

## Pre-allocated Machine autoscaling

This relies on the Fly Proxy feature, [auto start and stop machines](https://fly.io/docs/apps/autostart-stop/). The proxy starts and stops
existing Machines based on demand, machines are never created or deleted. The responsibility is on you to create as many machines as needed.
For a comprehensive overview of how it works, see the [documentation](https://fly.io/docs/apps/autostart-stop/).

## Metrics-based autoscaling

Autoscales your application based on metrics such as CPU and memory. This uses [Fly Autoscaler](https://github.com/superfly/fly-autoscaler)
which you deploy as an app into your organisation. It polls metrics from a Prometheus instance and computes the number of machines needed
based on those metrics. The autoscaler will create and delete machines as configured. To learn how to deploy and configure it, see
the [documentation](https://github.com/superfly/fly-autoscaler). 

