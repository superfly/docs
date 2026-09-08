---
title: "Managed Postgres API"
layout: docs
nav: mpg
toc: false
---

The Managed Postgres API is part of the [Fly Machines API](/docs/machines/api/), Fly.io's REST API for provisioning and managing resources. Use it to create and manage Managed Postgres clusters, databases, users, backups, and app attachments programmatically, without going through flyctl or the dashboard.

If you're not already familiar with the Machines API, start with [Working with the Machines API](/docs/machines/api/working-with-machines-api/) to get authenticated and set up.

## Endpoints

Cluster management:

- `GET /v1/postgres` - List Managed Postgres clusters for an organization.
- `POST /v1/postgres` - Create a Managed Postgres cluster.
- `GET /v1/postgres/{postgres_cluster_id}` - Get details of a specific cluster.
- `DELETE /v1/postgres/{postgres_cluster_id}` - Delete a cluster.

Attachments:

- `POST /v1/postgres/{postgres_cluster_id}/attachments` - Attach a cluster to a Fly App.
- `DELETE /v1/postgres/{postgres_cluster_id}/attachments/{app_name}` - Detach a cluster from a Fly App.

Backups:

- `GET /v1/postgres/{postgres_cluster_id}/backups` - List backups for a cluster.
- `POST /v1/postgres/{postgres_cluster_id}/backups` - Create a backup.

Databases:

- `GET /v1/postgres/{postgres_cluster_id}/databases` - List databases within a cluster.
- `POST /v1/postgres/{postgres_cluster_id}/databases` - Create a database.
- `DELETE /v1/postgres/{postgres_cluster_id}/databases/{database_name}` - Delete a database.

Extensions:

- `GET /v1/postgres/{postgres_cluster_id}/databases/{database_name}/extensions` - List extensions available within a database.
- `POST /v1/postgres/{postgres_cluster_id}/databases/{database_name}/extensions` - Enable an extension.
- `DELETE /v1/postgres/{postgres_cluster_id}/databases/{database_name}/extensions/{extension_name}` - Disable an extension.

Fork and restore:

- `POST /v1/postgres/{postgres_cluster_id}/fork` - Fork a ready cluster into a new cluster.
- `POST /v1/postgres/{postgres_cluster_id}/restore` - Restore a backup, or a point-in-time, into a new cluster.

Users:

- `GET /v1/postgres/{postgres_cluster_id}/users` - List Postgres users within a cluster.
- `POST /v1/postgres/{postgres_cluster_id}/users` - Create a Postgres user.
- `PATCH /v1/postgres/{postgres_cluster_id}/users/{username}` - Update a user's role.
- `DELETE /v1/postgres/{postgres_cluster_id}/users/{username}` - Delete a user.
- `GET /v1/postgres/{postgres_cluster_id}/users/{username}/credentials` - Get connection credentials for a user.
- `POST /v1/postgres/{postgres_cluster_id}/users/{username}/rotate_password` - Rotate a user's password.

## OpenAPI spec

See the full [OpenAPI 3.0 specification](https://docs.machines.dev/+external) for request and response schemas.
