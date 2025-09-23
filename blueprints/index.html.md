---
title: Blueprints
layout: docs
toc: true
nav: firecracker
---

<figure>
  <img src="/static/images/docs-blueprints.webp" alt="Frankie the hot air balloon operating a renaissance-era flying machine with flying machine plans and notes in the background">
</figure>


A new&mdash;and growing!&mdash;library of "blueprints" showing how to run, design, build, and deploy different kinds of apps on Fly.io. This isn't just a showcase for stuff we've built, but a collection of patterns and examples that you can can apply in your own projects.

## Architecture Patterns

Guides for the structure your app on Fly.io. Layouts, tradeoffs, moving parts.

- [Getting Started with N-Tier Architecture](/docs/blueprints/getting-started-with-n-tier-architecture/)
- [Shared Nothing Architecture](/docs/blueprints/shared-nothing-architecture/)
- [Session Affinity (a.k.a. Sticky Sessions)](/docs/blueprints/session-affinity/)
- [Multi-region databases and fly-replay](/docs/blueprints/multi-region-databases-and-fly-replay/)
- [Resilient apps use multiple Machines](/docs/blueprints/resilient-apps-use-multiple-machines/)
- [Deploying Remote MCP Servers](/docs/blueprints/deploying-remote-mcp-servers/)


## Deployment & Developer Workflow

Stuff you set up once and adjust when you ship code. Includes previews, base images, staging, and Docker wrangling.

- [Seamless Deployments on Fly.io](/docs/blueprints/seamless-deployments/)
- [Rollback Guide](/docs/blueprints/rollback-guide/)
- [Git Branch Preview Environments on Github](/docs/blueprints/git-branch-preview-environments/)
- [Staging and production isolation](/docs/blueprints/staging-and-production-isolation/)
- [Per-User Dev Environments with Fly Machines](/docs/blueprints/per-user-dev-environments/)
- [Using base images for faster deployments](/docs/blueprints/using-base-images/)
- [Managing Docker Images with Fly.io's Private Registry](/docs/blueprints/managing-docker-images/)


## Networking & Connectivity

Connecting things. Public apps, private services, bridging deployments, SSH, and WireGuard.

- [Run private apps with Flycast](/docs/blueprints/run-private-apps-with-flycast/)
- [Jack into your private network with WireGuard](/docs/blueprints/jack-into-your-private-network-with-wireguard/)
- [Bridge your other deployments to Fly.io](/docs/blueprints/bridge-your-other-deployments-to-fly-io/)
- [Connecting to User Machines](/docs/blueprints/connecting-to-user-machines/)
- [Run an SSH server](/docs/blueprints/run-an-ssh-server/)

## Scaling, Performance & Observability

Make it fast. Make it reliable. Monitor what's happening.

- [Autoscale Machines](/docs/blueprints/autoscale-machines/)
- [Using Fly Volume forks for faster startup times](/docs/blueprints/using-fly-volume-forks-for-faster-startup-times/)
- [Setting Hard and Soft Concurrency Limits](/docs/blueprints/setting-hard-and-soft-concurrency-limits-on-fly-io/)
- [Autostart and autostop private apps](/docs/blueprints/autostart-and-autostop-private-apps/)
- [Observability for User Apps](/docs/blueprints/observability-for-user-apps/)
- [Going to Production with Healthcare Apps](/docs/blueprints/going-to-production-with-healthcare-apps/)


## Background Jobs & Automation

How to run periodic tasks, long-running jobs, infrastructure automation, and the things that run when you’re asleep.

- [Task scheduling guide with Cron Manager and friends](/docs/blueprints/task-scheduling-guide-with-cron-manager-and-friends/)
- [Deferring long-running tasks to a distributed work queue](/docs/blueprints/deferring-long-running-tasks-to-a-distributed-work-queue/)
- [Crontab with Supercronic](/docs/blueprints/crontab-with-supercronic/)
- [Building Infrastructure Automation without Terraform](/docs/blueprints/building-infrastructure-automation-without-terraform/)



