---
title: Guides (Blueprints)
layout: docs
toc: true
nav: guides
---

A growing library of guides for running, designing, and deploying all kinds of apps on Fly.io. Whether you're just getting started or looking for new ideas, these are real-world patterns you can learn from and build on.

## Architecture Patterns

Guides for the structure your app on Fly.io. Layouts, tradeoffs, moving parts.

- [Resilient apps use multiple Machines](/docs/blueprints/resilient-apps-multiple-machines/)
- [Getting Started with N-Tier Architecture](/docs/blueprints/n-tier-architecture/)
- [Shared Nothing Architecture](/docs/blueprints/shared-nothing/)
- [Session Affinity (a.k.a. Sticky Sessions)](/docs/blueprints/sticky-sessions/)
- [Multi-region databases and fly-replay](/docs/blueprints/multi-region-fly-replay/)
- [Deploying Remote MCP Servers](/docs/blueprints/remote-mcp-servers/)


## Deployment & Developer Workflow

Stuff you set up once and adjust when you ship code. Includes previews, base images, staging, and Docker wrangling.

- [Working with Docker on Fly.io](/docs/blueprints/working-with-docker/) **NEW!**
- [Custom Deploy Workflows](/docs/blueprints/custom-deploy-workflows/)
- [Seamless Deployments on Fly.io](/docs/blueprints/seamless-deployments/)
- [Rollback Guide](/docs/blueprints/rollback-guide/)
- [Git Branch Preview Environments on Github](/docs/blueprints/review-apps-guide/)
- [Staging and production isolation](/docs/blueprints/staging-prod-isolation/)
- [Per-User Dev Environments with Fly Machines](/docs/blueprints/per-user-dev-environments/)
- [Using base images for faster deployments](/docs/blueprints/using-base-images-for-faster-deployments/)
- [Managing Docker Images with Fly.io's Private Registry](/docs/blueprints/using-the-fly-docker-registry/)


## Networking & Connectivity

Connecting things. Public apps, private services, bridging deployments, SSH, and WireGuard.

- [Run private apps with Flycast](/docs/blueprints/private-applications-flycast/)
- [Jack into your private network with WireGuard](/docs/blueprints/connect-private-network-wireguard/)
- [Bridge your other deployments to Fly.io](/docs/blueprints/bridge-deployments-wireguard/)
- [Connecting to User Machines](/docs/blueprints/connecting-to-user-machines/)
- [Run an SSH server](/docs/blueprints/opensshd/)

## Scaling, Performance & Observability

Make it fast. Make it reliable. Monitor what's happening.

- [Observability for User Apps](/docs/blueprints/observability-for-user-apps/)
- [Autoscale Machines](/docs/blueprints/autoscale-machines/)
- [Autostart and autostop private apps](/docs/blueprints/autostart-internal-apps/)
- [Setting Hard and Soft Concurrency Limits](/docs/blueprints/setting-concurrency-limits/)
- [Using Fly Volume forks for faster startup times](/docs/blueprints/volume-forking/)
- [Going to Production with Healthcare Apps](/docs/blueprints/going-to-production-with-healthcare-apps/)


## Background Jobs & Automation

How to run periodic tasks, long-running jobs, infrastructure automation, and the things that run when you’re asleep.

- [Building Infrastructure Automation without Terraform](/docs/blueprints/infra-automation-without-terraform/)
- [Deferring long-running tasks to a distributed work queue](/docs/blueprints/work-queues/)
- [Task scheduling guide with Cron Manager and friends](/docs/blueprints/task-scheduling/)
- [Crontab with Supercronic](/docs/blueprints/supercronic/)




