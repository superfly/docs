---
title: Production Databases
layout: framework_docs
objective: Information on setting up and managing a production database.
order: 1
status: beta
---

For a production [Postgres database](/docs/postgres/), a [High Availability server](/docs/postgres/advanced-guides/high-availability-and-global-replication/) should be used. That means it runs multiple instances of the database server. This is important because when one server is rebooted, your app doesn't lose database access for a period of time. Otherwise, at some point, your database will have an outage.

**Additional Resources:**

- [Database Backup and Restore](/docs/postgres/managing/backup-and-restore/)
- [Postgres DB Migrator](https://github.com/fly-apps/postgres-migrator) - Fly app that works to streamline Postgres migrations.
