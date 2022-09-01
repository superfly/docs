---
title: Metrics on Fly
layout: docs
sitemap: false
nav: firecracker
---

The Fly platform includes a fully-managed metrics solution to help you easily monitor your Fly apps.
It includes the following components:

- [**Prometheus on Fly**](#prometheus-on-fly): Managed, Prometheus-compatible time series storage
- [**Dashboards**](#dashboards): Managed Grafana with detailed visualizations of all built-in metrics
- [**Built-in Metrics**](#built-in-metrics): Metrics automatically sent from every Fly app you deploy
- [**Custom Metrics**](#custom-metrics): Expose additional metrics from Fly apps for further customization

## Prometheus on Fly

[Prometheus](https://prometheus.io/) is a popular open source monitoring system used to store and query metrics efficiently,
with a stable [HTTP querying API](https://prometheus.io/docs/prometheus/latest/querying/api/) compatible with a range of systems.

**Prometheus on Fly** is a fully-managed service based on [VictoriaMetrics](https://victoriametrics.com/).
It [supports](https://docs.victoriametrics.com/#prometheus-querying-api-usage) most common Prometheus querying API endpoints:
- [`/api/v1/query`](https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries)
- [`/api/v1/query_range`](https://prometheus.io/docs/prometheus/latest/querying/api/#range-queries)
- [`/api/v1/series`](https://prometheus.io/docs/prometheus/latest/querying/api/#finding-series-by-label-matchers)
- [`/api/v1/labels`](https://prometheus.io/docs/prometheus/latest/querying/api/#getting-label-names)
- [`/api/v1/label/<label_name>/values`](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-label-values)
- [`/api/v1/status/tsdb`](https://prometheus.io/docs/prometheus/latest/querying/api/#tsdb-stats)
- [`/api/v1/targets`](https://prometheus.io/docs/prometheus/latest/querying/api/#targets)
- [`/federate`](https://prometheus.io/docs/prometheus/latest/federation/)

Note that [remote read](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_read) (`/api/v1/read`) [remote storage integration](https://prometheus.io/docs/prometheus/latest/storage/#remote-storage-integrations)
is [not supported](https://docs.victoriametrics.com/FAQ.html#why-doesnt-victoriametrics-support-the-prometheus-remote-read-api).

### MetricsQL

Prometheus queries are typically based on the [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/) query language.
Prometheus on Fly queries use VictoriaMetrics [MetricsQL](https://docs.victoriametrics.com/MetricsQL.html),
a backwards-compatible query language that fixes user experience issues and adds
useful features and functions on top of PromQL.

Key features:

- [Better `rate()` and `increase()`](https://medium.com/@romanhavronenko/victoriametrics-promql-compliance-d4318203f51e#cade)
functions that just work. No need for [`irate` workarounds](https://www.percona.com/blog/2020/02/28/better-prometheus-rate-function-with-victoriametrics/)
or appending Grafana's [magical `$__rate_interval`](https://grafana.com/blog/2020/09/28/new-in-grafana-7.2-__rate_interval-for-prometheus-rate-queries-that-just-work/) selector to every query.
In fact, you can even omit the square brackets entirely and MetricsQL will do the right thing.
- Many more [label manipulation functions](https://docs.victoriametrics.com/MetricsQL.html#label-manipulation-functions)
such as `drop_common_labels`, `label_set`, etc.
- [`topk_avg`](https://docs.victoriametrics.com/MetricsQL.html#topk_avg), which returns the top `k` time series averaged
across the entire series range (not just individual points), plus the sum of all remaining series in an "other" label.
Useful for giving a small, filtered view across a potentially large number of series.

### Querying

Queries can be sent to the following endpoint:
```
https://api.fly.io/prometheus/<org-slug>/
```

You'll need to authenticate with a Fly Access Token sent in the [standard](https://www.rfc-editor.org/rfc/rfc6750.html) Bearer Token format (e.g., an HTTP request header `Authorization: Bearer <TOKEN>`), and you may only query series scoped to your organizations.

#### Manually

**Find your Organization slug**

```cmd
flyctl orgs list
ORG_SLUG=[org-slug]
```

**Get an access token**

```cmd
TOKEN=$(flyctl auth token)
```

**Test it out!**

```shell
curl https://api.fly.io/prometheus/$ORG_SLUG/api/v1/query \
  --data-urlencode 'query=sum(increase(fly_edge_http_responses_count)) by (app, status)' \
  -H "Authorization: Bearer $TOKEN"
```

## Dashboards

For more advanced metrics monitoring, you can use dashboards to organize and visualize complex Prometheus
queries.

The Metrics tab on the [Fly.io Dashboard](https://fly.io/dashboard) provides an overview
of your Fly apps using the built-in metrics stored in Prometheus.

### Managed Grafana [Preview]

[Grafana](https://grafana.com/) is a popular open source data visualization web application, that allows you to
compose queries against data sources into dynamic, reusable dashboards.

We provide a managed Grafana instance at [fly-metrics.net](https://fly-metrics.net), preconfigured with your
Prometheus data source and detailed dashboards covering the full set of built-in metrics.

You can also use the Explore panel to run ad-hoc queries against the preconfigured Prometheus datasource,
or create/import additional dashboards for further customization or to visualize custom metrics.

Switch between your Fly.io Organizations by clicking the "Switch organization" link beneath
the user icon in the lower-left of the screen.

Note: Managed Grafana is still an early preview release.

### External or self-hosted Grafana

You can also configure your Prometheus endpoint with an existing Grafana installation, or [host one on Fly](https://github.com/fly-apps/grafana). Either way, you set it up thusly:

1. [Add](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/) a [Prometheus data source](https://grafana.com/docs/grafana/latest/datasources/prometheus/) (Settings -> Data Sources -> Add data source -> Prometheus)
2. Fill the form with the following:
- HTTP -> URL: `https://api.fly.io/prometheus/<org-slug>/`
- Custom HTTP Headers -> + Add Header:
   - Header: `Authorization`, Value: `Bearer <token>`

You're all set.

We publish our [Fly.io Dashboards](https://grafana.com/grafana/dashboards/14741) to Grafana.com for use with external Grafana instances.
To install, just [import the dashboard](https://grafana.com/docs/grafana/latest/dashboards/export-import/#import-dashboard) using the listed IDs.
If you'd like to contribute changes to the dashboards, we have created a [repository](https://github.com/superfly/dashboards) for them.

## Built-in metrics

Fly apps automatically publish a number of built-in metrics.

[Metric types](https://prometheus.io/docs/concepts/metric_types/) are all [Gauges](https://prometheus.io/docs/concepts/metric_types/#gauge)
unless otherwise marked.

Metrics with names ending in `_count` are all [Counters](https://prometheus.io/docs/concepts/metric_types/#counter).

[Histogram](https://prometheus.io/docs/concepts/metric_types/#histogram) metrics with a base name of `<name>` expose multiple series:
- `<name>_bucket{le}`
- `<name>_sum`
- `<name>_count`

### Standard Labels

All published series include the following labels:

- `app`: App name
- `region`: [Fly.io Region](https://fly.io/docs/reference/regions/#fly-io-regions)
- `host`: 4-character host ID (lowercase hexadecimal)
- `instance`: App instance ID (for all series except `fly_edge_` and `fly_volume_`)

If your app exposes custom metrics with the same labels, they will be overwritten.

### Proxy series

Any app using a TCP-based handler (HTTP, TLS or straight TCP) publishes `edge` and `app` proxy metrics:

Labels:
- `proxy_id`: "blue" or "green" (flips when the proxy is restarted/updated)

#### Edge - `fly_edge_`

```
fly_edge_http_responses_count{status}
fly_edge_http_response_time_seconds{status} (Histogram)
fly_edge_tcp_connects_count
fly_edge_tcp_disconnects_count
fly_edge_data_out (Counter, bytes)
fly_edge_data_in (Counter, bytes)
fly_edge_tls_handshake_errors{servername} (Counter)
fly_edge_tls_handshake_time_seconds{version} (Histogram)
```

#### App - `fly_app_`
```
fly_app_concurrency
fly_app_http_responses_count{status}
fly_app_http_response_time_seconds{status} (Histogram)
fly_app_connect_time_seconds (Histogram)
fly_app_tcp_connects_count
fly_app_tcp_disconnects_count
```

### Instance series - `fly_instance_`

Derived from the [`/proc` filesystem](https://www.kernel.org/doc/html/latest/filesystems/proc.html) of your app VMs.

`fly_instance_up = 1` shows the VM is reporting correctly.

#### Instance memory - `fly_instance_memory_`

Derived from [`/proc/meminfo`](https://www.kernel.org/doc/html/latest/filesystems/proc.html#meminfo). All units are in *bytes*.

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
#### Instance Load and CPU

- `load_average` is derived from [`/proc/loadavg`](https://www.kernel.org/doc/html/latest/filesystems/proc.html#id11) ([`getloadavg`](https://man7.org/linux/man-pages/man3/getloadavg.3.html)). It's a ["system load average"](https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html) measuring the number of processes in the system run queue, with samples representing averages over 1, 5, and 15 `minutes`.

- `cpu` is derived from [`/proc/stat`](https://www.kernel.org/doc/html/latest/filesystems/proc.html#miscellaneous-kernel-statistics-in-proc-stat),
and counts the amount of time each CPU (`cpu_id`) has spent performing different kinds of work (`mode`, which may be one of `user`, `nice`, `system`, `idle`, `iowait`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`).  
The time unit is 'clock ticks' of centiseconds (0.01 seconds).

```
fly_instance_load_average{minutes}
fly_instance_cpu{cpu_id, mode} (Counter, centiseconds)
```
#### Instance Disks - `fly_instance_disk_`

Counters derived from fields 1-11 of [`/proc/diskstats`](https://www.kernel.org/doc/html/latest/admin-guide/iostats.html). The unit for `time_` series is **milliseconds**, and the unit for `sectors_` is 512-byte sectors.

Labels:
- `device`: Published for the ephemeral VM root disk (`vdb`) and any mounted Volume (`vdc`).

```
fly_instance_disk_reads_completed
fly_instance_disk_reads_merged
fly_instance_disk_sectors_read
fly_instance_disk_time_reading
fly_instance_disk_writes_completed
fly_instance_disk_writes_merged
fly_instance_disk_sectors_written
fly_instance_disk_time_writing
fly_instance_disk_io_in_progress
fly_instance_disk_time_io
fly_instance_disk_time_io_weighted
```

#### Instance Networking - `fly_instance_net_`

Counters derived from [`/proc/net/dev`](https://www.kernel.org/doc/html/latest/networking/statistics.html#procfs).

Labels:
- `device`: interface name, either `eth0` or `dummy0` (ignore).

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

#### Instance File Descriptors - `fly_instance_filefd_`

Information about allocated, and maximum allowed allocated file descriptors derived from [`/proc/sys/fs/file-nr`](https://www.kernel.org/doc/html/latest/admin-guide/sysctl/fs.html#file-max-file-nr).

```
fly_instance_filefd_allocated
fly_instance_filefd_maximum
```

#### Instance Filesystem - `fly_instance_filesystem`

Filesystem metrics derived from [VFS File System Information](https://man7.org/linux/man-pages/man0/sys_statvfs.h.0p.html).

Labels:
- `mount`: mountpoint name(s), `/` and if using [Volumes](https://fly.io/docs/reference/volumes/), the destination name in fly.toml.

```
fly_instance_filesystem_blocks
fly_instance_filesystem_block_size
fly_instance_filesystem_blocks_free
fly_instance_filesystem_blocks_avail
```

### Volumes - `fly_volume_`

Labels:
- `id`: Volume ID

If you're using [Volumes](https://fly.io/docs/reference/volumes/) for any of your organization's apps, you'll be able to query these series,
derived from the `LSize` and `Data%` of the volume's [thin LV](https://man7.org/linux/man-pages/man7/lvmthin.7.html).

```
fly_volume_size_bytes
fly_volume_used_pct (0-100)
```

### PostgreSQL - `pg_`

If you have a [PostgreSQL](https://fly.io/docs/reference/postgres/) database hosted on Fly, you'll automatically get the following series,
published via [`postgres_exporter`](https://github.com/prometheus-community/postgres_exporter):

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

## Custom Metrics

For further customization beyond built-in metrics,
Fly apps can expose a metrics endpoint we'll automatically scrape every 15 seconds and
send the results to Prometheus.

### Configuration

Add a `[metrics]` section to your application's `fly.toml`:

```toml
app = "your-app-name"

[metrics]
port = 9091 # default for most prometheus clients
path = "/metrics" # default for most prometheus clients
```

### Instrumentation

Instrument your app and expose your metrics on `0.0.0.0`.

There are many supported [client libraries](https://prometheus.io/docs/instrumenting/clientlibs/) as well as 3rd party libraries able to return Prometheus-formatted metrics.
