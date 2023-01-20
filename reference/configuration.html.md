---
title: App Configuration (fly.toml)
layout: docs
sitemap: false
nav: firecracker
---

The Fly platform uses `fly.toml` to configure applications for deployment. Configuration of builds, environment variables, internet-exposed services, disk mounts and release commands go here.

TOML is a [simple configuration file format](https://github.com/toml-lang/toml). Here's a [useful introduction](https://npf.io/2014/08/intro-to-toml/) on its syntax.

You don't need to create a `fly.toml` file by hand. Running [flyctl launch](/docs/flyctl/launch/) will create a `fly.toml` file for you. You can also generate one from an existing app by running [flyctl config save](/docs/flyctl/config-save/).

*VSCode users*: Install the [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) extension for automatic `fly.toml` validation and hints drawn from this documentation.

## The `app` name

The first key/value in any `fly.toml` file is the application name. This will also be used to create the host name that the application will use by default. For example:

```toml
app = "restless-fire-6276"
```

Whenever `flyctl` is run, it will look for a `fly.toml` file in the current directory and use the application name in that file. This behavior can be overridden by using the `-a` flag to set the application name, or on some commands (such as `deploy`) by using a `-c` flag to point to a different `fly.toml` file.

## Runtime options

Various options are available to control the life-cycle of a running application. These are optional and can be placed at the top level of the `fly.toml` file:

### `kill_signal` option

When shutting down a Fly app instance, by default, Fly sends a `SIGINT` signal to the running process. Typically this triggers a hard shutdown option on most applications. The `kill_signal` option allows you to change what signal is sent so that you can trigger a softer, less disruptive shutdown. Options are `SIGINT` (The default), `SIGTERM`, `SIGQUIT`, `SIGUSR1`, `SIGUSR2`, `SIGKILL`, or `SIGSTOP`. For example, to set the kill signal to SIGTERM, you would add:

```toml
kill_signal = "SIGTERM"
```

### `kill_timeout` option

When shutting down a Fly app instance, by default, after sending a signal, Fly gives an app instance five seconds to close down before being killed. Depending on the type of VM, this timeout can be adjusted. Shared VMs can extend it to 300 seconds (five minutes). Dedicated VMs can extend the timeout to 86400 seconds (twenty-four hours). To set the timeout to two minutes, you would add:

```toml
kill_timeout = 120
```

## The `build` section

The optional build section contains key/values concerned with how the application should be built. You can read more about builders in [Builders and Fly](/docs/reference/builders/)

### builder

```toml
[build]
  builder = "paketobuildpacks/builder:base"
  buildpacks = ["gcr.io/paketo-buildpacks/nodejs"]
```

The builder "builder" uses CNB Buildpacks and Builders to create the application image. These are third party toolkits which can use Heroku compatible build processes or other tools. The tooling is all managed by the buildpacks and buildpacks are assembled into CNB Builders - images complete with the buildpacks and OS to run the tool chains.

In our example above, the builder is being set to use [Paketo's all-purpose builder](https://paketo.io) with the NodeJS buildpack.

### Specify a Docker image

```toml
[build]
  image = "flyio/hellofly:latest"
```

The image builder is used when you want to immediately deploy an existing public image. When deployed, there will be no build process; the image will be prepared and uploaded to the Fly infrastructure as is. This option is useful if you already have a working Docker image you want to deploy on Fly or you want a well known Docker image from a repository to be run.

### Specify a Dockerfile

```toml
[build]
  dockerfile = "Dockerfile.test"
```

`dockerfile` accepts a relative path to a Dockerfile. By default, `flyctl` looks for `Dockerfile` in the application root.

This option will not change the Docker context path, which is set to the project root directory by default. If you want the `Dockerfile` to use its containing directory as the context root, use `fly deploy <directory>`.

### Specify a multistage Docker build target

```toml
[build]
  build-target = "test"
```

If your Dockerfile has [multiple stages](https://docs.docker.com/develop/develop-images/multistage-build/), you can specify one as the target for deployment. The target stage must have a `CMD` or `ENTRYPOINT` set.

### Specify Docker build arguments

You can pass [build-time arguments](https://docs.docker.com/engine/reference/commandline/build/#set-build-time-variables---build-arg) to both Dockerfile and Buildpack builds using the `[build.args]` sub-section:

```toml
[build.args]
  USER="plugh"
  MODE="production"
```

You can also pass build arguments to `flyctl deploy` using `--build-arg`. Command line args take priority over args with the same name in `fly.toml`.

Note that build arguments are *not available* in the runtime container. If you need build information at runtime - like a Git revision - store it in a file at build time, like:

```
RUN echo $GIT_REVISION > REVISION
```

Likewise, application environment variables and secrets are not available to builds.

## The `deploy` section

This section configures deployment-related settings such as the release command or deployment strategy.

### Run one-off commands before releasing a deployment

```toml
[deploy]
  release_command = "bundle exec rails db:migrate"
```

This command runs in a temporary VM - using the successfully built release - *before* that release is deployed. This is useful for running database migrations.

The temporary VM has full access to the network, environment variables and secrets, but *not* to persistent volumes.  Changes made to the filesystem on the temporary VM will not be retained or deployed.  If you need to modify persistent volumes or configure your application, consider making use of `CMD` or `ENTRYPOINT` in your Dockerfile.

A non-zero exit status from this command will stop the deployment. `fly deploy` will display logs from the command. Logs are available via `fly logs` as well.

To ensure the command runs in a specific region - say `dfw` - set `PRIMARY_REGION = 'dfw'` on in your application environment in `fly.toml` or with `fly deploy -e PRIMARY_REGION=dfw`. Setting `PRIMARY_REGION` is important if when running [database replicas in multiple regions](/docs/postgres/high-availability-and-global-replication).

The environment variable `RELEASE_COMMAND=1` is set for you within the temporary release VM. This might be useful if you need to customize your Dockerfile `ENTRYPOINT` to behave differently within a release VM.

### Picking a deployment strategy

```toml
[deploy]
  strategy = "bluegreen"
```

`strategy` controls the way a new release replaces the previous release. Different strategies offer trade-offs between downtime and reliability.

`strategy` may also be specified at deploy time with `flyctl deploy --strategy`.

The available strategies are:

**canary**: The default for apps without persistent volumes. `canary` will boot a single, new VM with the new release, verify its health, then proceed with a `rolling` restart strategy.

**rolling**: The default for apps with persistent volumes. One by one, each running VM is taken down and replaced by a new release VM. This is the default strategy for apps with volumes.

**bluegreen**: For every running VM, a new one is booted alongside it in the same region. Once all of the new VMs pass health checks, traffic gets migrated to new VMs. If your app is scaled to 2 or more VMs, this strategy can reduce deploy time by running tasks in parallel.

**immediate**: Replace all VMs with new releases immediately without waiting for health checks to pass. This is useful in emergency situations where you're confident about release health and can't wait for health checks.

Note: If `max-per-region` is set to 1, the default strategy is set to `rolling`. This happens because `canary` needs to temporarily run more than one VM to work correctly. The `bluegreen` strategy will behave similarly with `max-per-region` set to 1.

## The `env` variables section

```toml
[env]
  LOG_LEVEL = "debug"
  RAILS_ENV = "production"
  S3_BUCKET = "my-app-production"
```

This optional section allows setting non-sensitive information as environment variables in the application's [runtime environment](/docs/reference/runtime-environment/).

For sensitive information, such as credentials or passwords, use the [secrets CLI command](/docs/reference/secrets).

Env variable names are strictly case-sensitive and cannot begin with `FLY_` (as this could clash with the [runtime environment](/docs/reference/runtime-environment)). Env values can only be strings.

Secrets take precedence over env variables with the same name.

## The `statics` sections

When `statics` are set, requests under `url_prefix` that are present as files in `guest_path` will be delivered directly to clients, bypassing your web server. These assets are extracted from your Docker image and delivered directly from our proxy on worker hosts.

```toml
[[statics]]
  guest_path = "/app/public"
  url_prefix = "/public"
```
Each `[[statics]]` block maps a URL prefix to a path inside your container. You can have up to 10 mappings in an application.

The "guest path" --- the path inside your container where the files to serve are located --- can overlap with other static mappings; the URL prefix should not (so, two mappings to `/public/foo` and `/public/bar` are fine, but two mappings to `/public` are not).

### Caveats

This feature should not be compared directly with a CDN, for the following reasons.

This feature does not exempt you from having to run a web service in your VM.

Statics will not find `index.html` at the root. The full path must be requested.

You can't set `Cache-Control` or any other headers on assets. If you need those, you'll need to deliver them from your application and set the relevant headers.

Assets are not delivered, by default, from all edge Fly regions. Rather, assets are delivered from the regions the application is deployed in.

`statics` does not honor symlinks. So, if `/app/public` in your container is actually a symlink to something like `/app-39403/public`, you'll want to use the absolute original path in your statics configuration.

## The `services` sections

The `services` sections configure the mapping of ports on the application to ports and services on the Fly platform. These mappings determine how connections to the application will be handled on their journey from the Fly edge network to running Fly applications.

You can have:

* No `services` section: The application has no mappings to the external internet - typically apps like databases that talk over [6PN private networking](/docs/reference/private-networking/) to other apps.
* One `services` section: One internal port mapped to the one or more external ports on the internet.
* Multiple `services` sections: Mapping multiple internal ports to multiple external ports.

The `services` section itself is a table of tables in TOML, so the section is delimited with double square brackets, like this:

```toml
[[services]]
  internal_port = 8080
  protocol = "tcp"
```

* `internal_port` : The port this service (and application) will use to communicate with clients. The default is 8080. We recommend applications use the default.
* `protocol` : The protocol that this service will use to communicate. Typically `tcp` for most applications, but can also be `udp`.

### `services.concurrency`

The services concurrency sub-section configures how to measure load for an application to inform [load balancing](/docs/reference/load-balancing) and [scaling](/docs/reference/scaling).

This section is a simple list of key/values, so the section is denoted with single square brackets like so:

```toml
  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20
```

`type` specifies what metric is used to determine when to scale up and down, or when a given instance should receive more or less traffic (load balancing). The two supported values are `connections` and `requests`.

**connections**: Load balance and scale based on number of concurrent tcp connections. This is the default when unspecified. This is also the default when fly.toml is created with `fly launch`.

**requests**: Load balance and scale based on the number of http requests. This is recommended for web services, since multiple requests can be sent over a single tcp connection.

* `hard_limit` : When an application instance is at or over this number of concurrent connections or requests, the system will stop sending new traffic to that application instance. The system will bring up another instance if the auto scaling policy supports doing so.
* `soft_limit` : When an application instance is at or over this number of concurrent connections or requests, the system will deprioritize sending new traffic to that application instance and only send it to that application instance if all other instances are also at or above their soft_limit. The system will likely bring up another instance if the auto scaling policy for the application support doing so.

### `services.ports`

For each `services` section in your `fly.toml`, i.e. for each external port you want to accept connections on, you need a `services.ports` section. The section is denoted by double square brackets like this:

```toml
  [[services.ports]]
    handlers = ["http"]
    port = 80
    force_https = true  # optional
```

This example defines an HTTP handler on port 80.

* `handlers` : An array of strings, each string selecting a handler process to terminate the connection with at the edge. Here, the `http` handler will accept HTTP traffic and pass it on to the `internal_port` of the application, which we defined in the `services` section above.
  For the list of available handlers, and how they manage network traffic, see the [Public Network Services documentation](/docs/reference/services/).
* `port` : An integer representing the external port to listen on (ports 1-65535).
* `start_port` : For a port range, the first port to listen on.
* `end_port` : For a port range, the last port to listen on.
* `force_https`: A boolean which determines whether to enforce HTTP to HTTPS redirects.

You can have more than one `services.ports` section. The default configuration, for example, contains two. We've already seen one above. The second one defines an external port 443 for secure connections, using the `tls` handler.

```toml
  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

For UDP applications, make sure to bind the application to the same port as defined in the relevant `services.ports` section. For example, the configuration below will listen on port 5000 and the application will need to bind to `fly-global-services:5000` to receive traffic. Leave `handlers` unset for UDP services.

```toml
[[services]]
  internal_port = 5000
  protocol = "udp"
  [[services.ports]]
    port = 5000
```

Instead of using multiple port definitions, you can specify a range of ports. For example, the configuration below will listen on the ports `8080`, `8081`, `8082`, `8083`, `8084` and `8085`:

```toml
[[services.ports]]
  handlers = ["tls"]
  start_port = 8080
  end_port = 8085
```

#### `services.ports.tls_options`

Configure the TLS versions and ALPN protocols that Fly's edge will use to terminate TLS for your application with:

```toml
  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
    tls_options = { "alpn" = ["h2", "http/1.1"], "versions" = ["TLSv1.2", "TLSv1.3"], }
```

* `alpn` : Array of strings indicating how to handle ALPN negotiations with clients.
* `versions` : Array of strings indicating which TLS versions are allowed.

Fly can also terminate TLS only and pass through directly to your service. This works for a variety of applications that can benefit from offloading TLS termination and accept the unencrypted connection.

One use case is applications using HTTP/2, like gRPC. Fly's edge terminates TLS and sends h2c (HTTP/2 without TLS) directly to your application through our backhaul. The config below will negotiate HTTP/2 with clients, and then send h2c to the application:

```toml
  [[services.ports]]
    handlers = ["tls"]
    port = "443"
    tls_options = { "alpn" = ["h2"], }
```

### `services.tcp_checks`

When a service is running, the Fly platform checks up on it by connecting to a port. The `services.tcp_checks` section defines parameters for those checks. For example, the default tcp\_checks look like this:

```toml
  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

* `grace_period`: The time to wait after a VM starts before checking its health.
* `interval`: The time between connectivity checks.
* `restart_limit`: The number of consecutive TCP check failures to allow before attempting to restart the VM. The default is `0`, which disables restarts based on failed TCP health checks.
* `timeout`: The maximum time a connection can take before being reported as failing its healthcheck.

Times are in milliseconds unless units are specified.

### `services.http_checks`

Another way of checking a service is running is through HTTP checks as defined in the `services.http_checks` section. These checks are more thorough than tcp\_checks as they require not just a connection but a successful HTTP status in response (i.e, 2xx). Here is an example of a `services.http_checks` section:

```toml
  [[services.http_checks]]
    interval = 10000
    grace_period = "5s"
    method = "get"
    path = "/"
    protocol = "http"
    restart_limit = 0
    timeout = 2000
    tls_skip_verify = false
    [services.http_checks.headers]
```

Roughly translated, this section says every ten seconds, perform a HTTP GET on the root path (e.g. http://appname.fly.dev/) looking for it to return a HTTP 200 status within two seconds. The parameters of a `http_check` are listed below.

* `grace_period`: The time to wait after a VM starts before checking its health.
* `interval`: The time in milliseconds between connectivity checks.
* `method`: The HTTP method to be used for the check.
* `path`: The path of the URL to be requested.
* `protocol`: The protocol to be used (`http` or `https`)
* `restart_limit`: The number of consecutive HTTP check failures to allow before attempting to restart the VM. The default is `0`, which disables restarts based on failed HTTP health checks.
* `timeout`: The maximum time a connection can take before being reported as failing its healthcheck.
* `tls_skip_verify`: When `true` (and using HTTPS protocol) skip verifying the certificates sent by the server.
* `services.http_checks.headers`: This is a sub-section of `services.http_checks`. It uses the key/value pairs as a specification of header and header values that will get passed with the http_check call.

Times are in milliseconds unless units are specified.

**Note**: The `services.http_checks` section is optional and not generated in the default `fly.toml` file.

## The `mounts` section

This section supports the Volumes feature for persistent storage. The section has two settings; both are needed.

```toml
[mounts]
source="myapp_data"
destination="/data"
```

### `source`

The `source` is a volume name that this app should mount. Any volume with this name, in the same region as the app and that isn't already mounted, may be mounted. A volume of this name must exist in _some_ region for the application to deploy.

### `destination`

The `destination` is directory where the `source` volume should be mounted on the running app.

## The `checks` section

This section lets you define checks for apps outside of their `[[services]]` (or for apps without any services).

It's has a few differences with service checks:
- You need to provide a port
- You need to provide a name
- You need to specify the type of th check

```toml
[checks]
  [checks.name_of_your_http_check]
    grace_period = "30s"
    interval = "15s"
    method = "get"
    path = "/path/to/status"
    port = 5500
    timeout = "10s"
    type = "http"
  [checks.name_of_your_tcp_check]
    grace_period = "30s"
    interval = "15s"
    port = 1234
    timeout = "10s"
    type = "tcp"
```

Fields are very similar to `[[services.checks]]`:

* `port`: Internal port to connect to. Needs to be available on `0.0.0.0`.
* `type`: Either `tcp` or `http`.
* `grace_period`: The time to wait after a VM starts before checking its health.
* `interval`: The time in milliseconds between connectivity checks.
* `method`: The HTTP method to be used for the check.
* `path`: The path of the URL to be requested.
* `timeout`: The maximum time a connection can take before being reported as failing its healthcheck.

## The `processes` section

<div class="callout">The `processes` feature is in [preview](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316). Let us know in the <a href="https://community.fly.io" style="text-decoration: underline;">Fly community forum</a> if you run into issues when deploying.

Known issues:
* Running multiple processes in this way is not compatible with autoscaling.
* Unexpected behavior with regions may arise if you use a `[processes]` block and then delete it.
</div>

The `processes` section allows you to run multiple processes. This way you can define one application, but run it multiple times.

**Each application instance can be started with a different command**, allowing you to re-use your code base for different tasks (web server, queue worker, etc).

To run multiple processes, you'll need a `[processes]` block containing a map of a name and command to start the application.

```toml
[processes]
web = "bundle exec rails server -b [::] -p 8080"
worker = "bundle exec sidekiqswarm"
```

Furthermore, you can "match" a specific process (or processes) to a `services`, `mount`, or `statics` configuration. For example:

```toml
[[services]]
  processes = ["web"] # this service only applies to the web process
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []
```

After configuring the processes, you'll need to scale them up with per-process commands. For example:

```
$ fly scale count web=2 worker=2
```

### Per-process commands

Some `fly` commands accept a process name as an argument. The following examples shows which:

* Change VM counts: `fly scale count web=2 worker=1`
* Change VM size: `fly scale vm shared-cpu-1x --group worker`
* Change regions: `fly regions set iad --group worker`

For a bit more context on the `processes` feature, you can read our [community announcement](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316/).

## The `metrics` section

Fly apps can be configured to export custom metrics to the Fly.io hosted Prometheus service. Add this section to fly.toml.

```toml
[metrics]
port = 9091       # default for most prometheus clients
path = "/metrics" # default for most prometheus clients
```

Check out the [Metrics on Fly](/docs/reference/metrics/) for more information about collecting metrics for your apps.

## The `experimental` section

This section is for flags and feature settings which have yet to be promoted into the main configuration.

```toml
[experimental]
cmd = ["path/to/command", "arg1", "arg2"]
entrypoint = ["path/to/command", "arg1", "arg2"]
```

### `cmd`

This overrides the `CMD` set by the Dockerfile. It should be specified as an array of strings, as seen in the example above.

### `entrypoint`

This overrides the `ENTRYPOINT` set by the Dockerfile. It should be specified as an array of strings, as seen in the example above.
