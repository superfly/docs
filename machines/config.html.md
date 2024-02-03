---
title: Fly Machine configuration
objective: Configuration properties of Fly Machines
layout: docs
nav: machines
order: 2
---
## Fly Machine configuration

Properties of the `config` object for Machine configuration. Learn about all the [Machine properties](#machine-properties).

### image
Type: string  
Required. The container registry path to the image that defines this Machine (for example, ”registry-1.docker.io/library/ubuntu:latest”).

### auto_destroy
Type: bool  
Default: false  
If true, the Machine destroys itself once it's complete.

### checks
An optional object that defines one or more named checks. The key for each check is the check name. The value for each check supports:

#### type
Type: string  
Default: nil  
`tcp` or `http`.

#### port
Type: int  
Default: nil  
The TCP port to connect to, likely should be the same as `internal_port`.

#### interval
Type: int  
Default: nil  
The interval, in nanoseconds, between connectivity checks.

#### timeout
Type: int  
Default: nil  
The maximum time, in nanoseconds, a connection can take before being reported as failing its health check.

#### grace_period
Type: int  
Default: nil  
How long to wait, in nanoseconds, before we start running health checks.

#### method
Type: string  
Default: nil  
For `http` checks, the HTTP method to use to when making the request.

#### path
Type: string  
Default: nil  
For `http` checks, the path to send the request to.

#### protocol
Type: string  
Default: nil  
For `http` checks, whether to use `http` or `https`.

#### tls_server_name
Type: string  
Default: nil  
If the protocol is `https`, the hostname to use for TLS certificate validation.

#### tls_skip_verify
Type: bool  
Default: false  
For `http` checks with https protocol, whether or not to verify the TLS certificate.

#### headers
Type: {string: [string, string]}  
Default: {}  
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

### dns
- `skip_registration`: If true, do not register the Machine's 6PN IP with the internal DNS system.

### env
Type: {string:string}  
Default: {}  
An object filled with key/value pairs to be set as environment variables.

### files
An optional array of objects defining files to be written within a Machine, one of `raw_value` or `secret_name` must be provided.

#### guest_path
Type: string  
The path in the Machine where the file will be written. Must be an absolute path.

#### raw_value
Type: string  
Contains the base64 encoded string of the file contents.

#### secret_name
Type: string  
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

### cmd
Type: [string]  
An array of strings. The arguments passed to the entrypoint.

### env
Type: {string:string}  
An object filled with key/value pairs to be set as environment variables.

### exec
Type: [string]  
An array of strings. The command to run for Machines in this process group on startup.

### user
Type: string  
Default: nil  
An optional user that the process runs under.

### restart
Defines whether and how flyd restarts a Machine after its main process exits. Learn more about [Machine restart policies](/docs/machines/guides-examples/machine-restart-policy/). This object has the following options:

#### policy
Type: string  
Required. One of "no", "on-failure", or "always".

#### max_retries
Type: int  
Default: nil  
The maximum number of retries when the policy is "on-failure".

### schedule
Type: string  
Default: nil  
Optionally one of `hourly`, `daily`, `weekly`, `monthly`. Runs Machine at the given interval. Interval starts at time of Machine creation.

### services
Contains an array of objects that define a single network service. Check the [Machines networking section](#networking) for more information.

#### protocol
Type: string  
Required. `tcp` or `udp`. [Learn more about running raw TCP/UDP services](https://fly.io/docs/networking/udp-and-tcp/).

#### internal_port
Type: int  
Required. Port the Machine listens on.

#### concurrency
Control Fly Proxy’s load balancing for this service.

##### type
Type: string  
`connections` (TCP) or `requests` (HTTP). Default is `connections`. Determines which kind of event we count for load balancing.

##### soft_limit
Type: int  
Default: nil  
Ideal service concurrency. We will attempt to spread load to keep services at or below this limit. We’ll deprioritize a Machine to give other Machines a chance to absorb traffic.

##### hard_limit
Type: int  
Default: nil  
Maximum allowed concurrency. The limit of events at which we’ll