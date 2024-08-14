---
title: Autoscaling
layout: docs
nav: firecracker
---

Autoscaling adjusts the number of running or created Fly Machines dynamically. We support two forms of autoscaling:

- Autostop/autostart Machines
- Metrics-based autoscaling

## Autostop/autostart Machines

Fly Proxy autostop/autostart starts and stops Machines based on load; Machines are never created or deleted. You create a "pool" of Machines in one or more regions and Fly Proxy starts and stops them as needed.

For details about how it works, see [Fly Proxy autostop/autostart](/docs/launch/autostop-autostart/). To configure autostop/autostart for your app, see [Autostop/autostart Machines](/docs/launch/autostop-autostart/).


## Metrics-based autoscaling

The metrics-based autoscaler scales your application based on any metric. You deploy the autoscaler as an app in your organization. It polls collected metrics and computes the number of machines needed based on the metric you define. The autoscaler can create and delete machines or stop and start existing Machines. 

To learn how to deploy and configure the autoscaler, see [Autoscale based on metrics](/docs/launch/autoscale-by-metric/).
