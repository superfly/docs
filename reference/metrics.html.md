---
title: Metrics on Fly
layout: docs
sitemap: false
nav: firecracker
---

[Prometheus](https://prometheus.io) is a popular open source monitoring solution used to store metrics and query them efficiently. **Prometheus on Fly** is a managed, hosted, solution: we host the infrastructure, we reserve resources for your organization's apps to use it.

## Sending custom metrics to Prometheus

Apps can expose a metrics endpoint we'll periodically poll (a few times per minute).

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

## Querying

Querying works like any Prometheus server. The only gotcha is you'll need to authenticate and you may only query series scoped to your organization.

### Prerequisite

**Find your Organization slug**

```cmd
flyctl orgs list
```

will show you all your organization memberships with their names and slugs.

**Get an access token**

```cmd
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
	--data-urlencode 'query=sum(rate(fly_edge_http_responses_count{app="$APP"}[5m])) by (status)' \
	-H "Authorization: Bearer $TOKEN"
```

## Built-in metrics

Fly also provides a few built-in metrics for your apps.

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

## Instance series

These are pulled and exposed from your app VMs.

### Instance memory

Units are in *bytes*.

```
fly_instance_memory_mem_total
fly_instance_memory_mem_free
fly_instance_memory_mem_available
fly_instance_memory_buffers
fly_instance_memory_cached
fly_instance_memory_swap_cached
fly_instance_memory_active
fly_instance_memory_inactive
fly_instance_memory_swap_total
fly_instance_memory_swap_free
fly_instance_memory_dirty
fly_instance_memory_writeback
fly_instance_memory_slab
fly_instance_memory_shmem
fly_instance_memory_vmalloc_total
fly_instance_memory_vmalloc_used
fly_instance_memory_vmalloc_chunk
```
### Instance Load and CPU

```
fly_instance_cpu - available variables: cpu_id (numeric index), mode (user, nice, system, idle, iowait, irq, softirq, steal, guest,guest_nice)
fly_instance_load_average - available variables: minutes (1, 5, or 15)
```
### Instance Disks

These values should be available for both the ephemeral VM root disk and any mounted volumes.
Disk labels will be `vda` and `vdb`, respectively.

```
fly_instance_disk_reads_completed (count)
fly_instance_disk_reads_merged (count)
fly_instance_disk_sectors_read (count)
fly_instance_disk_time_reading (time spent reading milliseconds)
fly_instance_disk_writes_completed (count)
fly_instance_disk_writes_merged (count)
fly_instance_disk_sectors_written (count)
fly_instance_disk_time_writing (time spent writing in milliseconds)
fly_instance_disk_io_in_progress (count of i/o operations currently in progress)
fly_instance_disk_time_io (time spent performing i/o in milliseconds)
fly_instance_disk_time_io_weighted (weighted time spent performing i/o in milliseconds)
```

### Instance Networking

Values are counts taken directly from [/proc/net/dev](https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/tree/net/core/net-procfs.c#n75).

```
fly_instance_net_recv_bytes
fly_instance_net_recv_packets
fly_instance_net_recv_errs
fly_instance_net_recv_drop
fly_instance_net_recv_fifo
fly_instance_net_recv_frame
fly_instance_net_recv_compressed
fly_instance_net_recv_multicast
fly_instance_net_sent_bytes
fly_instance_net_sent_packets
fly_instance_net_sent_errs
fly_instance_net_sent_drop
fly_instance_net_sent_fifo
fly_instance_net_sent_colls
fly_instance_net_sent_carrier
fly_instance_net_sent_compressed
```

### Instance File Descriptors

Information about allocated, and maximum allowed allocated file descriptors.

```
fly_instance_filefd_allocated
fly_instance_filefd_maximum
```

## Volumes

If you're using volumes, for any of our organization's apps, you'll be able to query these series:

```
fly_volume_size_bytes
fly_volume_used_pct
```

## PostgresSQL

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

## Pre-built Grafana Dashboard

We published a basic [Grafana Dashboard](https://grafana.com/grafana/dashboards/14741) to help our users get started with our built-in metrics.

To install:

1. Add a Prometheus data source for your Fly organization (instructions outlined in the "Grafana" section of the present document)
2. Copy the dashboard ID: `14741`
3. [Follow the instruction from the Grafana documentation](https://grafana.com/docs/grafana/latest/dashboards/export-import/#import-dashboard)

If you'd like to contribute changes to the dashboard, we have created a [repository](https://github.com/superfly/dashboards) for it.

## Standard Labels

All series pulled into our Prometheus cluster will include the following labels:

- `region`: short 3 letter airport code for the region
- `host`: 4 characters host ID
- `app`: the app exposing these metrics
- `instance`: your app instance ID

If your app exposes metric labels with the same names, they will be overwritten.
