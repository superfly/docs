---
title: Metrics on Fly
layout: docs
sitemap: false
nav: firecracker
---

[Prometheus](https://prometheus.io) is a popular open source monitoring solution used to store metrics and query them efficiently.

**Prometheus on Fly** is a managed, hosted, solution: we host the infrastructure, we reserve resources for your organization's apps to use it.

## Sending custom metrics to Prometheus

Apps can expose a metrics endpoint we'll periodically (a few times per minute).

### Configuration

Add this to your application's `fly.toml`

```toml
app = "your-app-name"

[metrics]
port = 9091 # default for most prometheus clients
path = "/metrics" # default for most prometheus clients
```

### Instrumentation

Instrument your app and expose your metrics on `0.0.0.0`.

There are many supported [client libraries](https://prometheus.io/docs/instrumenting/clientlibs/) as well as 3rd party libraries able to return Prometheus-formatted metrics.

## Sending custom metrics to Prometheus

Apps can expose a metrics endpoint we'll periodically (a few times per minute).

### Configuration

Add this to your application's `fly.toml`

```toml
app = "your-app-name"

[experimental]
metrics_port = 9091 # default for most prometheus clients
metrics_path = "/metrics" # default for most prometheus clients
```

### Instrumentation

Instrument your app and expose your metrics on `0.0.0.0`.

There are many supported [client libraries](https://prometheus.io/docs/instrumenting/clientlibs/) as well as 3rd party libraries able to return Prometheus-formatted metrics.

## Querying

Querying works like any Prometheus server. The only gotcha is you'll need to authenticate and you may only query series scoped to your organization.

### Prerequisite

**Find your Organization slug**

```
flyctl orgs list
```

 will show you all your organization memberships with their names and slugs.

**Get an access token**

```
flyctl auth token
```

### Grafana

You can either use your own Grafana or [host one on Fly](https://github.com/fly-apps/grafana).

Either way, you set it up thusly:

1. Settings -> Data Sources -> Add data source -> Prometheus
2. Fill the form with the following:
  - Name: "Prometheus <My Organization>"
  - URL: `https://api.fly.io/prometheus/<org-slug>/`
3. Add a Custom HTTP Header:
  - Header: `Authorization`
  - Value: `Bearer <token>`

You're all set.

### Manually

```shell
curl https://api.fly.io/prometheus/$ORG_SLUG/api/v1/query_range?step=30 \
	--data-urlencode 'sum(rate(fly_edge_http_responses_count{app="$APP"}[5m])) by (status)' \
	-H "Authorization: Bearer $TOKEN"
```

## Automatic metrics

Fly also provides a few automatic metrics for your apps.

### Proxy series

For any app using our TCP-based handlers (HTTP, TLS or straight TCP), you'll have access to the following series:

```
fly_edge_http_responses_count
fly_edge_http_response_time_seconds
fly_edge_tcp_connects_count
fly_edge_tcp_disconnects_count
fly_app_concurrency
fly_app_http_responses_count
fly_app_http_response_time_seconds
fly_app_connect_time_seconds
fly_app_tcp_connects_count
fly_app_tcp_disconnects_count
fly_edge_data_out
fly_edge_data_in
```

### Instance series

These are pulled and exposed from inside your app instances:

```
fly_instance_memory_buffers
fly_instance_memory_cached
fly_instance_memory_mem_free
fly_instance_memory_mem_available
fly_instance_memory_mem_total
fly_instance_memory_swap_cached
fly_instance_memory_vmalloc_used
fly_instance_memory_active
fly_instance_memory_inactive
fly_instance_cpu
fly_instance_load_average
fly_instance_net_sent_bytes
fly_instance_disk_time_io
```

### Volumes

If you're using volumes, for any of our organization's apps, you'll be able to query these series:

```
fly_volume_size_bytes
fly_volume_used_pct
```

### PostgresSQL

If you have a [PostgreSQL](https://fly.io/docs/reference/postgres/) database hosted on Fly, you'll automatically get the following series:

```
pg_stat_activity_count
pg_stat_activity_max_tx_duration
pg_stat_archiver_archived_count
pg_stat_archiver_failed_count
pg_stat_bgwriter_buffers_alloc
pg_stat_bgwriter_buffers_backend_fsync
pg_stat_bgwriter_buffers_backend
pg_stat_bgwriter_buffers_checkpoint
pg_stat_bgwriter_buffers_clean
pg_stat_bgwriter_checkpoint_sync_time
pg_stat_bgwriter_checkpoint_write_time
pg_stat_bgwriter_checkpoints_req
pg_stat_bgwriter_checkpoints_timed
pg_stat_bgwriter_maxwritten_clean
pg_stat_bgwriter_stats_reset
pg_stat_database_blk_read_time
pg_stat_database_blk_write_time
pg_stat_database_blks_hit
pg_stat_database_blks_read
pg_stat_database_conflicts_confl_bufferpin
pg_stat_database_conflicts_confl_deadlock
pg_stat_database_conflicts_confl_lock
pg_stat_database_conflicts_confl_snapshot
pg_stat_database_conflicts_confl_tablespace
pg_stat_database_conflicts
pg_stat_database_deadlocks
pg_stat_database_numbackends
pg_stat_database_stats_reset
pg_stat_database_tup_deleted
pg_stat_database_tup_fetched
pg_stat_database_tup_inserted
pg_stat_database_tup_returned
pg_stat_database_tup_updated
pg_stat_database_xact_commit
pg_stat_database_xact_rollback
pg_stat_replication_pg_current_wal_lsn_bytes
pg_stat_replication_pg_wal_lsn_diff
pg_stat_replication_reply_time
pg_replication_lag
pg_database_size_bytes
```

## Standard Labels

All series pulled into our Prometheus cluster will include the following labels:

- `region`: short 3 letter airport code for the region
- `host`: 4 characters host ID
- `app`: the app exposing these metrics
- `instance`: your app instance ID

If your app exposes metric labels with the same names, they will be overwritten.

