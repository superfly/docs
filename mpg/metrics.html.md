---
title: Monitoring and Metrics
layout: docs
nav: firecracker
---

<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>

## Performance Monitoring

The Managed Postgres dashboard provides comprehensive performance monitoring and metrics for your PostgreSQL clusters. The **Metrics** tab gives you real-time visibility into your database's performance, helping you identify bottlenecks and optimize your applications.

### Accessing Metrics

To view metrics for your cluster:

1. Navigate to your MPG cluster in the Fly.io dashboard
2. Click the **Metrics** tab
3. Optionally filter by specific database using the database dropdown
4. Select your desired time range (15 minutes, 1 hour, 6 hours, 24 hours, or 2 days)

### Available Charts and Metrics

The metrics dashboard provides detailed insights through various charts and gauges organized into categories:

#### System Resource Metrics

| Metric | Description |
|--------|-------------|
| **Database CPU Utilization** | CPU usage percentage for each database instance, labeled with Primary (P) and Replica (R) badges. Shows individual instance IDs and averages over the selected time period |
| **Database Memory Utilization** | Memory usage for Primary and Replica database instances. Displays current usage and average consumption per instance |
| **Pooler CPU Utilization** | CPU usage percentage for PGBouncer connection pooler instances. Typically remains low under normal operations |
| **Pooler Memory Utilization** | Memory consumption in MB for connection pooler instances. Shows usage for each pooler with instance IDs |

#### Connection Metrics

| Metric | Description |
|--------|-------------|
| **Database Connections** | Shows active and idle database connections over time |
| **Pooler Connections** | Tracks active and waiting connections through PGBouncer
 |
#### Database Operations

| Metric | Description |
|--------|-------------|
| **Database Operations** | Row-level operations per second broken down by type (inserts, updates, deletes, and fetches). Shows throughput patterns and workload distribution across operation types |
| **Cache Hit Ratio** | Percentage of data requests served from memory versus disk. Higher percentages (95%+) indicate efficient memory usage. Lower values suggest queries are hitting disk frequently |
| **Deadlocks** | Count of database deadlocks detected when two or more transactions are waiting for each other to release locks. Shows frequency and timing of these mutual blocking situations |

#### Storage

| Metric | Description |
|--------|-------------|
| **Database Size** | Current storage usage across databases |

#### Replication Metrics

| Metric | Description |
|--------|-------------|
| **Replication Delay Bytes** | Amount of WAL (Write-Ahead Log) data in bytes that the replica is behind the primary. Measures the volume of changes waiting to be applied |
| **Replication Delay Seconds** | Time in seconds that the replica lags behind the primary database. Represents how long ago the replica's current state reflects the primary |
