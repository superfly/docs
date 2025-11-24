---
title: Cluster configuration options
layout: docs
nav: mpg
date: 2025-08-18
---


<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>


## Connection Pooling

All Managed Postgres clusters come with PGBouncer for connection pooling, which helps manage database connections efficiently. You can configure how PGBouncer assigns connections to clients by changing the pool mode. 

### Pool Mode Options

There are two pool modes available:

- **Session**: Connections are assigned to clients for the entire session. This is the default mode and provides the most compatibility with PostgreSQL features, including transactions, prepared statements, and advisory locks.
- **Transaction**: Connections are assigned per transaction. This mode allows for higher connection reuse and better performance under high load, but has some limitations with certain PostgreSQL features.

### When to Use Each Mode

**Use Session mode when**:
- Your application uses prepared statements
- You need advisory locks or other session-specific features
- You're unsure which mode to choose (Session is the safer default)
- Your application has long-running transactions

**Use Transaction mode when**:
- You have a high-throughput application with many short transactions
- You want to maximize connection reuse
- Your application primarily uses simple queries without prepared statements
- You need to support more concurrent connections with the same hardware
- If you're using Elixir's Ecto library, you must use Transaction pool mode when connecting through the pooler, as Ecto's connection pooling behavior is incompatible with PGBouncer's Session mode.

### Changing Pool Mode from the Dashboard

To change the pool mode for your cluster:

1. Navigate to your MPG cluster's "Connect" tab in the dashboard
2. Click "View Pooler Settings" to expand the configuration options
3. Select your desired pool mode.
4. Click "Update Pool Mode"
5. Confirm the change in the modal dialog

**Note**: Changing the pool mode will restart the connection pooler nodes, which may cause brief connection interruptions. Your database itself will remain running.

## Changing your MPG Plan

Your Managed Postgres Plan determines the amount of resources your cluster has. All plans include a primary and replica, pg bouncers, and backups. You can change your cluster's plan at any time and the machines in the cluster will be updated to their new resources. 

In order to change your plan: 

1. Navigate to your MPG cluster's "Settings" tab in the dashboard
2. Select your desired plan from the list
3. Click the "Update Configuration" button 
4. Your plan will be updated and all configuration changes will be applied to your database nodes. 

<div class="warning icon">
During the configuration update, your database nodes will restart. You may see a brief period of downtime during the upgrade and switchover. Please make sure to plan accordingly.
</div>

## Users and Roles

Your Managed Postgres Cluster is created with one admin user named `fly-user`. You can create additional database users and set their roles from your dashboard. 

Currently MPG supports the following roles for users:

### Schema Admin

The Schema Admin role is the closest to a Superuser role. It provides full read & write access to your cluster, as well as the ability to modify the structure of your database. 

This is the default role granted to the `fly-user` user when your cluster is created.

**What Schema Admin users can do:**
- Read and write to all databases, tables, and schemas
- Create, alter, and drop tables, views, functions, and other database objects
- Create new schemas and manage database structure
- Connect to any database in the cluster
- Create temporary tables for session-specific operations


**What Schema Admin users cannot do:**
- Create new databases. This can be done from your Dashboard
- Other actions requiring superuser permissions, other than those named above.


### Writer

The Writer role provides full read and write access to data while restricting the ability to modify the database structure. 

**What Writer users can do:**
- Read from and write to all existing tables and schemas
- Insert, update, and delete records across all databases
- Connect to any database in the cluster

**What Writer users cannot do:**
- Create or modify table structures
- Create new schemas or databases
- Create functions, procedures, or other schema objects
- Create temporary tables
- Alter database permissions or roles

### Reader

The Reader role provides read-only access to all data in the cluster. This role works well for connecting to reporting or analytics.

**What Reader users can do:**
-  View all data across databases, tables, and schemas
-  Connect to any database in the cluster
-  Run SELECT queries

**What Reader users cannot do:**
- Insert, update, or delete any data
- Create any database objects or modify schemas
- Create temporary tables
- Modify database structure or permissions


### Creating additional users

To create additional users:
1. Navigate to your MPG cluster's "Users" tab in the dashboard
2. Enter a name for your new user
3. Click "Create User" and wait for the user to be created.

Note: If your cluster was created before July 2025, you'll need to opt in to the new Role system before you can add new users. This can be done on the Users tab of your dashboard. 

### Authenticating with a custom user

Once the user has been created, you can generate a connection string for them from the "Connect" tab of your dashboard. Select the user you'd like to authenticate as, and the connection string will be updated with their details. 


## Databases
Your Managed Postgres cluster is created with the default `fly-db` database. You can create additional databases from the dashboard--these databases can be accessed by existing users in your cluster, based on their role.

#### Creating additional Databases
To create additional databases:
1. Navigate to your MPG cluster's "Databases" tab in the dashboard
2. Enter a name for your new database in the input field under the "Databases" section.
3. Click "Create database" and wait for the database to be created.