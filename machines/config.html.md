---
title: Machine config properties
objective: The properties in the machine.config object
layout: docs
nav: machines
---

You have direct control over the `machine.config` of your Machines using the Machines API. 

The `fly machine run` and `fly machine update` commands also give access to some configuration properties of individual Machines.

For apps managed with `fly deploy`, the `fly.toml` configuration file and the `fly deploy` command determine the configurations of Machines in an app.

## `image`
`string` - Required  
The container registry path to the image that defines this Machine (for example, ”registry-1.docker.io/library/ubuntu:latest”).

## `auto_destroy`
`bool` (default: false)  
If true, the Machine destroys itself once it's complete.

## `checks`
An optional object that defines one or more named checks. The key for each check is the check name. The value for each check supports:

### `type`
`string`  
`tcp` or `http`.

### `port`
`int`  
The TCP port to connect to, likely should be the same as `internal_port`.

### `interval`
`int`  
The interval, in nanoseconds, between connectivity checks.

### `timeout`
`int`  
The maximum time, in nanoseconds, a connection can take before being reported as failing its health check.

### `grace_period`
`int`  
How long to wait, in nanoseconds, before we start running health checks.

### `method`
`string`  
For `http` checks, the HTTP method to use to when making the request.

### `path`
`string`  
For `http` checks, the path to send the request to.

### `protocol`
`string`  
For `http` checks, whether to use `http` or `https`.

### `tls_server_name`
`string`  
If the protocol is `https`, the hostname to use for TLS certificate validation.

### `tls_skip_verify`
`bool` (default: false)  
For `http` checks with https protocol, whether or not to verify the TLS certificate.

### `headers`
`{string: [string, string]}`  
For `http` checks, an array of objects with string field `name` and array of strings field `values`.


An example of two checks:

```json
        "checks": {
            "tcp-alive": {
                "type": "tcp",
                "port": 8080,
                "interval": "15s",
                "timeout": "10s"
            },
            "http-get": {
                "type": "http",
                "port": 8080,
                "protocol": "http"
                "method": "GET",
                "path": "/",
                "interval": "15s",
                "timeout": "10s"
            }
        }
```

## `dns`
An object that contains:

### `skip_registration`
`bool`  
If true, do not register the Machine's 6PN IP with the internal DNS system.

## `env`
`{string:string}`  
An object filled with key/value pairs to be set as environment variables.

## `files`
An optional array of objects defining files to be written within a Machine, one of `raw_value` or `secret_name` must be provided.

### `guest_path`
`string`  
The path in the Machine where the file will be written. Must be an absolute path.

### `raw_value`
`string`  
Contains the base64 encoded string of the file contents.

### `secret_name`
`string`  
The name of the secret containing the base64 encoded file contents.


An example of two files:

```json
        "files": [
            {
                "guest_path": "/path/to/hello.txt",
                "raw_value": "aGVsbG8gd29ybGQK"
            },
            {
                "guest_path": "/path/to/secret.txt",
                "secret_name": "SUPER_SECRET"
            }
        ]
```

## `guest`
Configure the resources allocated for this Machine. An object with the following options:

### `cpu_kind`
`string`  
The type of CPU reservation to make (”shared”, ”performance", and so on).

### `gpu_kind`
`string`  
The type of GPU reservation to make.

### `host_dedication_id`
The ID of the host dedication (group of dedicated hosts) on which to create this Machine. (beta)

### `cpus`
`int` (default: `1`)  
The number of CPU cores this Machine should occupy when it runs.

### `kernel_args`
Optional array of strings. Arguments passed to the kernel.

### `memory_mb`
`int` (default: `256`)  
Memory in megabytes as multiples of 256.

## `init`
Arguments for `init`, which is Fly.io's footprint inside your Machine, and controls how your own code gets run.

### `exec`
`[string, string]`  
The command line for the program to run once the Machine boots up. This overrides any other startup command line, either in our API or in your Docker container definition.

### `entrypoint`
`[string, string]`  
A command line to override the ENTRYPOINT of your Docker container; another way to define the program that is going to start up when your Machine boots up.

### `cmd`
`[string, string]`  
A command line to override the CMD of your Docker container; still another way to define the program that is going to start up when your Machine boots up.

### `tty`
`bool` (default: false)  
Allocate a TTY for the process we start up.

### `swap_size_mb`
`int`  
Swap space to reserve for the Fly Machine in, you guessed it, megabytes.

## `metadata`
`{string:string}`  
An object filled with key/value pairs for the Machine metadata. We use metadata internally for routing, process groups, and clusters.

## `metrics`
An optional object defining a metrics endpoint that [Prometheus on Fly.io](https://fly.io/docs/reference/metrics/#prometheus-on-fly-io) will scrape.

### `port`
`int`  
Required. The port that Prometheus will connect to.

### `path`
`string`  
Required. The path that Prometheus will scrape (e.g. `/metrics`).

## `mounts`
An array of objects that reference previously created [persistent volumes](https://fly.io/docs/reference/volumes/). Currently, you may only mount one volume per Machine.

### `name`
`string`  
Required. The name of the Volume to attach.

### `path`
`string`  
Required. Absolute path on the Machine where the volume should be mounted. For example,  `/data`.

### `extend_threshold_percent`
`int`  
The threshold of storage used on a volume, by percentage, that triggers extending the volume’s size by the value of `add_size_gb`.

### `add_size_gb`
`int`  
The increment, in GB, by which to extend the volume after reaching the auto_extend_size_threshold. Required with `extend_threshold_percent`.

### `size_gb_limit`
`int`  
The total amount, in GB, to extend a volume. Optional with `extend_threshold_percent`.

### `volume`
`int`  
The volume ID, visible in `fly volumes list`, i.e. `vol_2n0l3vl60qpv635d`.

## `processes`
An optional array of objects defining multiple processes to run within a Machine. The Machine will stop if any process exits without error.

### `entrypoint`
An array of strings. The process that will run.

### `cmd`
An array of strings. The arguments passed to the entrypoint.

### `env`
An object filled with key/value pairs to be set as environment variables.

### `exec`
An array of strings. The command to run for Machines in this process group on startup.

### `user`
`string`  
An optional user that the process runs under.

## `restart`
Defines whether and how flyd restarts a Machine after its main process exits. Learn more about [Machine restart policies](/docs/machines/guides-examples/machine-restart-policy/). This object has the following options:

### `policy`
`string`  
Required. One of "no", "on-failure", or "always".

### `max_retries`
`int`  
The maximum number of retries when the policy is "on-failure".

## `schedule`
`string` (nil)  
Optionally one of `hourly`, `daily`, `weekly`, `monthly`. Runs Machine at the given interval. Interval starts at time of Machine creation.

## `services`
Contains an array of objects that define a single network service. Check the [Machines networking section](#networking) for more information.

### `protocol`
`string`  
Required. `tcp` or `udp`. [Learn more about running raw TCP/UDP services](https://fly.io/docs/networking/udp-and-tcp/).

### `internal_port`
`int`  
Required. Port the Machine listens on.

### `concurrency`
Control Fly Proxy’s load balancing for this service.

#### `type`
`string`  
`connections` (TCP) or `requests` (HTTP). Determines which kind of event we count for load balancing.

#### `soft_limit`
`int` (nil)  
Ideal service concurrency. We will attempt to spread load to keep services at or below this limit. We’ll deprioritize a Machine to give other Machines a chance to absorb traffic.

#### `hard_limit`
`int` (nil)  
Maximum allowed concurrency. The limit of events at which we’ll stop routing to a Machine altogether, and, if configured to do so, potentially start up existing Machines to handle the load.

### `ports`
MachinePort - An array of objects defining the service's ports and associated handlers.

#### `port`
`int` (nil)  
The internet-exposed port to receive traffic on; if you want HTTP traffic routed to 8080/tcp on your Machine, this would be 80.

#### `start_port`, `end_port`
`int` (nil)  
Like `port`, but allocate a range of ports to route internally, for applications that want to occupy whole port ranges.

#### `handlers`
Array of protocol [handlers](https://fly.io/docs/networking/services/#connection-handlers) for this port. How should the Fly Proxy handle and terminate this connection. Options include `http`, `tcp`, `tls`.

#### `force_https`
`bool` (false)  
If true, force HTTP to HTTPS redirects.

#### `http_options`
Fiddly HTTP options (if you don’t know you need them, you don’t), including:
- `compress`: bool (false) to enable HTTP compression
- `response`: ({"headers": {string:string}} (nil)) for HTTP headers to set on responses.


#### `tls_options`
Fiddly TLS options (if you don’t know you need to mess with these, you don’t need to), including:
- `alpn`: [string, string] ([]) : ALPN protocols to present TLS clients (for instance, [“h2”, “http/1.1”]).
- `versions`: [string, string] ([]) : TLS versions to allow (for instance, [“TLSv1.2”, “TLSv1.3”]).


#### `proxy_proto_options`
Configure the version of the PROXY protocol that your app accepts. Version 1 is the default.
- `version`: A string to indicate that the TCP connection uses PROXY protocol version 2. The default when not set is version 1.

### `auto_start`
`bool` (false)  
If true, Fly Proxy starts Machines when requests for this service arrive.

### `auto_stop`
`bool` (false)  
If true, Fly Proxy stops Machines when this service goes idle.

### `min_machines_running`
`int` (nil)  
When `auto_start` is true, the minimum number of Machines to keep running at all times in the primary region.

## `size`
A [named size](/docs/about/pricing/#machines) for the VM, e.g. `performance-2x` or `shared-cpu-2x`. Note: `guest` and `size` are mutually exclusive.

## `standbys`
Standbys enable a Machine to be a standby for another. In the event of a hardware failure, the standby Machine will be started. Only for Machines without `services`. Array of strings representing the Machine IDs of Machines watch (act as standby for).

## `statics`
Optionally serve static files.

### `guest_path`
`string` 
Required. The path inside the Machines where the files to serve are located.

### `url_prefix`
`string` 
Required. The URL prefix under which to serve the static files.

## `stop_config`
`MachineStopConfig` (nil) - Configure graceful shutdown of the Machine.

### `signal`
`string` (nil) - the name of the signal to send to the entrypoint process on the Machine to initiate shutdown.

### `timeout`
`int` (nil) - how long in nanoseconds to wait, after signaling the entrypoint process, before hard-shutdown of the Machine.