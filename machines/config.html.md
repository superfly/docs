---
title: Fly Machine configuration
objective: Configuration properties of Fly Machines
layout: docs
nav: machines
order: 2
---

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| image | string | - | Required. The container registry path to the image that defines this Machine (for example, ”registry-1.docker.io/library/ubuntu:latest”). |
| auto_destroy | bool | false | If true, the Machine destroys itself once it's complete. |
| <ul><li>item1</li><li>item2</li></ul>| See the list | from the first column| |
| checks | object | - | <p>An optional object that defines one or more named checks.</p><br/><ul>
  <li><code>type</code>: string (nil) - <code>tcp</code> or <code>http</code>.</li>
  <li><code>port</code>: int (nil) - The TCP port to connect to, likely should be the same as <code>internal_port</code>.</li>
  <li><code>interval</code>: int (nil) - The interval, in nanoseconds, between connectivity checks</li>
  <li><code>timeout</code>: int (nil) - The maximum time, in nanoseconds, a connection can take before being reported as failing its health check.</li>
  <li><code>grace_period</code>: int (nil) - How long to wait, in nanoseconds, before we start running health checks.</li>
  <li><code>method</code>: string (nil) - For <code>http</code> checks, the HTTP method to use to when making the request.</li>
  <li><code>path</code>: string (nil) - For <code>http</code> checks, the path to send the request to.</li>
  <li><code>protocol</code>: string (nil) - For <code>http</code> checks, whether to use <code>http</code> or <code>https</code></li>
  <li><code>tls_server_name</code>: string (nil) - If the protocol is <code>https</code>, the hostname to use for TLS certificate validation</li>
  <li><code>tls_skip_verify</code>: bool (false) - For <code>http</code> checks with https protocol, whether or not to verify the TLS certificate</li>
  <li><code>headers</code>: {string: [string, string]} ({}) - For <code>http</code> checks, an array of objects with string field <code>name</code> and array of strings field <code>values</code>.</li>
</ul> |
| dns | object | - | Contains `skip_registration` field. If true, do not register the Machine's 6PN IP with the internal DNS system. |
| env | {string:string} | {} | An object filled with key/value pairs to be set as environment variables. |
| files | array | - | An optional array of objects defining files to be written within a Machine, one of `raw_value` or `secret_name` must be provided. |
| guest | object | - | Configure the resources allocated for this Machine. |
| init | object | - | Arguments for `init`, which is Fly.io's footprint inside your Machine, and controls how your own code gets run. |
| metadata | {string:string} | {} | An object filled with key/value pairs for the Machine metadata. |
| metrics | object | - | An optional object defining a metrics endpoint that Prometheus on Fly.io will scrape. |
| mounts | array | - | An array of objects that reference previously created persistent volumes. |
| processes | array | - | An optional array of objects defining multiple processes to run within a Machine. |
| restart | object | - | Defines whether and how flyd restarts a Machine after its main process exits. |
| schedule | string | nil | Optionally one of `hourly`, `daily`, `weekly`, `monthly`. Runs Machine at the given interval. |
| services | array | - | Contains an array of objects that define a single network service. |
| size | string | - | A named size for the VM, e.g. `performance-2x` or `shared-cpu-2x`. |
| standbys | array | - | Standbys enable a Machine to be a standby for another. |
| statics | object | - | Optionally serve static files. |
| stop_config | object | nil | Configure graceful shutdown of the Machine. |

