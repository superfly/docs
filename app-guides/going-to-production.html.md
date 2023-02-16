---
title: Going to Production
layout: docs
sitemap: false
nav: firecracker
categories:
  - production
  - guide
date: 2023-02-14
---

You have a serious project or service and you're looking for guidance on how to
setup a good production environment on Fly.io.

There are many facets of an application and what is considered production-ready
can vary from one framework to another. This serves as an outline and guide to
additional resources.

## First Things First

Any application intended for production use should do the following things first.

1. Setup a [High Availability DB server](/docs/postgres/advanced-guides/high-availability-and-global-replication/) - Prevents interruption of service when machines or VMs are restarted.
2. Run [2+ app servers](/docs/reference/scaling/) - Prevents interruption of service when machines or VMs are restarted.
3. Sign up for a [Plan](/plans) to get email support

With the foundation pieces in place, there are additional things to consider.

## Dev, Staging & Production

- Mark has docs in progress for this section.

## Production Databases

For a production [Postgres database](/docs/postgres/) database, a [High Availability server](/docs/postgres/advanced-guides/high-availability-and-global-replication/) should be used. That means it runs multiple instances of the database server. This is important because when one server is rebooted, your app doesn't lose database access for a period of time. Otherwise, at some point, your database will have an outage.

**Additional Resources:**

- Backup and Restore database
  - TODO: merge the [Rails DB backup/restore](https://fly.io/docs/rails/the-basics/backup-and-restoring-data/) with [PG Backup/restore doc](https://fly.io/docs/postgres/managing/backup-and-restore/)
- https://github.com/fly-apps/postgres-migrator
- IMPORTANT: Ensure running multiple instances for HA (High Availability). Running with a single database server will have service interruptions at some point.
- https://fly.io/docs/postgres/advanced-guides/high-availability-and-global-replication/


## Exporting Logs

- Create Fideloper's NATs log article in docs and link to it from here.