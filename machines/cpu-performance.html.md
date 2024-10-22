---
title: CPU Performance
layout: docs
nav: machines
---

We offer two kinds of virtual CPUs for Machines: `shared` and `performance`. Both run on the same physical hardware, have the same clock speed, etc... The difference is how much time they are allowed to spend running your applications.


CPU Type      | Period<sup>1</sup> | Baseline Quota<sup>1</sup> | Max Quota Balance<sup>1</sup>
--------      | ------ | -------------- | -----------------
`shared`      | 80ms   | 5ms (1/16 or 6.25%)   | 500s
`performance` | 80ms   | 80ms (100%) | -

We enforce limits using the [Linux `cpu.cfs_quota_us` cgroup](https://www.kernel.org/doc/Documentation/scheduler/sched-bwc.rst). For each 80ms period of time, we instruct the Linux scheduler to run `shared` vCPUs for no more than 5ms. If your application is working hard and reaches its quota, its vCPUs will be suspended for the remainder of the 80ms period.

Quotas are shared between a Machine's vCPUs. For example, a `shared-cpu-2x` Machine is allowed to run for 10ms per 80ms period, regardless of which vCPU is using that time.

<sup>1</sup> We might change these specific numbers if we feel like it.

## Bursting

APIs and human-facing web applications are sensitive to latency and a 75ms pause in program execution is often unacceptable. These same types of applications often work hard in small bursts and remain idle much of the time. To avoid unfairly suspending the execution of vCPUs in these applications, we allow a balance of unused vCPU time to be accrued. The application is then allowed to spend its balance in bursts. When bursting, the vCPU is allowed to run at up to 100%. When the balance is depleted, the vCPU is limited to running at its baseline quota.

## Monitoring

The easiest way to see your CPU utilization, baseline quota, and throttling is on your app's [Managed Grafana](/docs/monitoring/metrics/#managed-grafana) `Fly Instance` dashboard.

![chart showing CPU utilization, steal, baseline, and throttling](/docs/images/cpu-quota.webp)

Here, we can see a Machine that was running well bellow it's baseline quota. It had accumulated a 50s/vCPU runtime balance. Then, during a burst of activity, CPU utilization exceeded the baseline quota, causing the balance to drain. When the balance reached 0, the Machine was briefly throttled. When CPU utilization went down, throttling was disabled and the balance accumulated again.

A related and somewhat misleading metric is CPU steal. You can see this under the `mode=steal` label in the `fly_instance_cpu` metric. Steal is the amount of time your vCPUs are wanting to run, but our scheduler isn't allowing them to. This can happen due to throttling when your Machine exceeds its quota, but it can also be a sign that other Machines on the same host are competing for resources. We publish a separate `fly_instance_cpu_throttle` that only includes time your vCPUs were throttled for exceeding quota.
