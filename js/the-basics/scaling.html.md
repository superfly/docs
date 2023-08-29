---
title: Scaling
layout: framework_docs
objective: Scaling your application to meet demand
order: 5
---

Scaling an application is a complex subject with many variables, in this page we will focus on a number of factors that are largely universal: number of CPU cores, memory, and both the number and placement of virtual machines.

Not covered here is scaling of databases or scaling of volumes.

For information on costs, see [Fly App Pricing](https://fly.io/docs/about/pricing/).

## Memory

Some starting point recommendations:

 * 256MB is enough to run small applications with few users
 * 512MB is a better place to start if you are doing image processing or have a moderate number of users.
 * 1024MB is a minimum if you are running an application that uses puppeteer or otherwise makes use of chrome's rendering engine.

Once you have settled on a size, some links to get you started:
  * [`fly scale memory`](https://fly.io/docs/flyctl/scale-memory/)
  * [`swap_size_mb`](https://fly.io/docs/reference/configuration/#swap_size_mb-option)

These options are not mutually exclusive.  A good starting point may be 512MB of RAM and 1024MB of swap.

## CPU Cores

By default, JavaScript applications (whether they be Node.js, Deno, or Bun)
run on a single operating system thread and therefore won't benefit from
running with multiple cores.

Node.js has a [cluster](https://nodejs.org/api/cluster.html) module that can
be used to address this.  See [Run a Node.js HTTP Express.js Server on Multiple CPU Cores](https://coderrocketfuel.com/article/run-a-node-js-http-express-js-server-on-multiple-cpu-cores) for an example on how to use this module.

Once your application is coded to take advantage of multiple cores,
run `fly machines list` to see a list of your machines, and then
run [`fly machine update --vm-cpus`](https://fly.io/docs/flyctl/machine-update/) to update the number of CPUs a single machine.

## Virtual Machines

For most JS applications the key to scaling will be in creating more virtual
machines, each with enough memory and CPU cores to handle a unit of workload.
More information on that topic can be found on the
[Scale the Number of Machines](https://fly.io/docs/apps/scale-count/) page.


