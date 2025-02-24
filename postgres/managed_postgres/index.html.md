---
title: "Managed Postgres"
objective: Learn about our managed Postgres service and how to use it with your applications
layout: framework_docs
order: 2
---

Fly.io offers a fully managed Postgres service, superseding our previous unmanaged Postgres offering. Managed Postgres is currently in Tech Preview. Contact support to get early access.

This guide explains our managed Postgres offering and how to use it with your applications.

## What is Managed Postgres?

Managed Postgres is our database-as-a-service offering where we handle:

- Automatic backups and point-in-time recovery
- High availability and failover
- Security patches and version upgrades
- Performance monitoring and optimization
- Scaling resources (CPU, RAM, storage)
- 24/7 support and incident response

## Creating a Managed Postgres Instance

To create a new managed Postgres instance, visit your Fly dashboard and click the "Create Database" button in the Managed Postgres section.

During creation, you'll be prompted to choose:
- Instance name
- Region
- Hardware resources (CPU, RAM, storage)

## Connecting to Your Managed Postgres Database

To connect your Fly.io application to your managed Postgres instance:

1. After creation, the "Connection" tab will display your connection string
2. Set it as a secret in your Fly.io application:
   ```bash
   fly secrets set DATABASE_URL="postgres://username:password@host:port/database"
   ```
3. Your application can now use the `DATABASE_URL` environment variable to connect
