---
title: App Configuration (fly.toml)
layout: docs
sitemap: false
nav: firecracker
---

All Fly applications have a `fly.toml` file which describes how the application should be configured when it is deployed onto the Fly platform. This configuration includes the application name, build configuration, ports, services, and handlers to set up and parameters for health checks.

The file is in TOML format ([github reference](https://github.com/toml-lang/toml)). If you are unfamiliar with TOML, here's a [useful introduction](https://npf.io/2014/08/intro-to-toml/). It is made up of lines with either key/value settings or sections (noted by values surrounded by one or more pairs of square brackets).

You don't need to create a `fly.toml` file by hand. Running [flyctl launch](/docs/flyctl/launch/) will create a `fly.toml` file for you. You can also save one from an existing app by running [flyctl config save](/docs/flyctl/config-save/)

## _Fly.toml - line by line_

### The `app` name

The first key/value in any `fly.toml` file is the application name. This will also be used to create the host name that the application will use by default. For example:

```toml
app = "restless-fire-6276"
```

Whenever `flyctl` is run, it will look for a `fly.toml` file in the current directory and use the application name in that file. This behavior can be overridden by using the `-a` flag to set the application name, or on some commands (such as `deploy`) by using a `-c` flag to point to a different `fly.toml` file.

### Runtime options

Various options are available to control the lifecycle of a running application. These are optional and can be placed at the top level of the `fly.toml` file:

#### `kill_signal` option

When shutting down a Fly app instance, by default, Fly sends a `SIGINT` signal to the running process. Typically this triggers a hard shutdown option on most applications. The `kill_signal` option allows you to change what signal is sent so that you can trigger a softer, less disruptive shutdown. Options are `SIGINT` (The default), `SIGTERM`, `SIGQUIT`, `SIGUSR1`, `SIGUSR2`, `SIGKILL`, or `SIGSTOP`. For example, to set the kill signal to SIGTERM, you would add:

```toml
kill_signal = "SIGTERM"
```

#### `kill_timeout` option

When shutting down a Fly app instance, by default, after sending a signal, Fly gives an app instance five seconds to close down before being killed. Depending on the type of VM, this timeout can be adjusted. Shared VMs can extend it to 300 seconds (five minutes). Dedicated VMs can extend the timeout to 86400 seconds (twenty-four hours). To set the timeout to two minutes, you would add:

```toml
kill_timeout = 120
```


### The `build` section

The optional build section contains key/values concerned with how the application should be built. You can read more about builders in [Builders and Fly](/docs/reference/builders/)
#### builder

```toml
[build]
  builder = "paketobuildpacks/builder:tiny"
  buildpacks = ["gcr.io/paketo-buildpacks/nodejs"]
```

The builder "builder" uses CNB Buildpacks and Builders to create the application image. These are third party toolkits which can use Heroku compatible build processes or other tools. The tooling is all managed by the buildpacks and buildpacks are assembled into CNB Builders - images complete with the buildpacks and OS to run the tool chains.

In our example above, the builder is being set to use [Paketo's all-purpose builder](https://paketo.io) with the NodeJS buildpack. To learn more about buildpacks and Fly, refer to this blog posting [Simpler Fly deployments for NodeJS, Rails, Go, and Java](/blog/simpler-fly-deployments-nodejs-rails-golang-java/).

#### image

```toml
[build]
  image = "flyio/hellofly:latest"
```

The image builder is used when you want to immediately deploy an existing public image. When deployed, there will be no build process; the image will be prepared and uploaded to the Fly infrastructure as it. This option is useful if you already have a working Docker image you want to deploy on Fly or you want a well known Docker image from a repository to be run.
#### dockerfile

Specify the path to Dockerfile to be used for builds. If this is not specified, or there is no build section, flyctl will look for `Dockerfile` in the application root.

#### build-target

Specify an optional Docker multistage build target for `Dockerfile` builds.

#### build.args

You can pass build-time arguments to both Dockerfile and Buildpack builds using the `[build.args]` sub-section:

```toml
[build.args]
  USER="plugh"
  MODE="production"
```

This will always pass the USER and MODE build arguments to the Dockerfile build process. You can also pass build arguments to `flyctl deploy` using `--build-arg`. These args take priority over args of the same name in `fly.toml`.

### The `deploy` section

This section configures deployment-related settings such as the release command or deployment strategy.

#### release_command

Run a command in a one-off VM - using the successfully built release - *before* that release is deployed . This VM won't mount volumes, but has full access to the network, environment variables and secrets.

This is useful for running database migrations:

```toml
[deploy]
  release_command = "bundle exec rails db:migrate"
```

A non-zero exit status from this command will stop the deployment. `fly deploy` will display logs from the command. Logs are available via `fly logs` as well.
#### strategy

Set the deployment strategy which informs how a new release should be placed on new VMs. This may be set here in with `--strategy`. The available strategies are:

**canary**: This default strategy - for apps without volumes - will boot a single, new VM with the new release, verify its health, then proceed with a `rolling` restart strategy.

**rolling**: One by one, each running VM is taken down and replaced by a new release VM. This is the default strategy for apps with volumes.

**bluegreen**: For every running VM, a new one is booted alongside it. All new VMs must pass health checks to complete deployment, when traffic gets migrated to new VMs. If your app has multiple VMs, this strategy may reduce deploy time and downtime, assuming your app is scaled to 2 or more VMs.

**immediate**: Replace all VMs with new releases immediately without waiting for health checks to pass. This is useful in emergency situations where you're confident a release will be healthy.

Note: If `max-per-region` is set to 1, the default strategy is set to `rolling`, since more than one VM must be running in a region, temporarily, for a canary deployment to function. This setting is equally incompatible with the `bluegreen` strategy.

```toml
[deploy]
  strategy = "bluegreen"
```

### The `env` variables section

The env variables section is an optional section that allows for the setting of non-sensitive information as environment variables in the application's [runtime environment](/docs/reference/runtime-environment/).

For sensitive information, such as credentials or passwords, we recommend using the [secrets command](/docs/reference/secrets). For anything else though, the `env` section provides a simple way to set environment variables. Here's an example:

```toml
[env]
  LOG_LEVEL = "debug"
  RAILS_ENV = "production"
  S3_BUCKET = "my-app-production"
```

Env variable names are strictly case-sensitive and cannot begin with `FLY_` (as this could clash with the [runtime enviroment](/docs/reference/runtime-environment)). Env values can only be strings.

Where there is a secret and an env variable set with the same name, the secret will take precedence.

### The `statics` sections

The `statics` sections expose static assets built into your application's container to Fly's Anycast network. Using a `static` mapping, you can serve HTML files, Javascript, and images without needing to run a web server inside your container.

Each `[[statics]]` block maps a URL prefix to a path inside your container:

```toml
[[statics]]
  guest_path = "/app/public"
  url_prefix = "/public"
```

When Fly's Anycast network handles requests for your application, it'll look for static mappings like these. When it finds them, it'll satisfy the request directly from our proxy, without passing the actual HTTP request on through to your app. That's faster than making your app do that work, and easier for you.

You can have up to 10 mappings in an application. The "guest path" --- the path
inside your container where the files to serve are located --- can overlap with other static mappings; the URL prefix should not (so, two mappings to `/public/foo` and `/public/bar` are fine, but two mappings to `/public` are not).

**Important**: our static cache service doesn't currently honor symlinks. So,
if `/app/public` in your container is actually a symlink to something like
`/app-39403/public`, you'll want to use the absolute original path in your
statics configuration.

### The `services` sections

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

#### `services.concurrency`

The services concurrency sub-section configures the application's behavior with regard to concurrent connections and [compute scaling](/docs/architecture/#compute-scaling). It is a simple list of key/values, so the section is denoted with single square brackets like so:

```toml
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
```

* `hard_limit` : When an application instance is at or over this number of concurrent connections, the system will bring up another instance.
* `soft_limit` : When an application instance is at or over this number of concurrent connections, the system is likely bring up another instance.

#### `services.ports`

For each external port you want to accept connections on, you will need a `services.ports` section. One for each port, the section is denoted by double square brackets like this:

```toml
  [[services.ports]]
    handlers = ["http"]
    port = "80"
    force_https = true  # optional
```

This example defines an HTTP handler on port 80.

* `handlers` : An array of strings, each string selecting a handler process to terminate the connection with at the edge. Here, the ["HTTP" handler](/docs/services/#http) will accept HTTP traffic and pass it on to the internal port of the application which we defined earlier.
* `port` : A string which selects which external ports you want Fly to accept traffic on. You can configure an application to listen for global traffic on ports 25, 53, 80, 443, 5000, 8443, 25565, and ports 10000 - 10100.
* `force_https`: A boolean which determines whether to enforce HTTP to HTTPS redirects.

You can have more than one `services.ports` sections. The default configuration, for example, contains two. We've already seen one above. The second one defines an external port 443 for secure connections, using the ["tls" handler](/docs/services/#tls).

```toml
  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

The details of how these handlers manage network traffic, and other handlers available, are detailed in the [Network Services](/docs/services/) documentation.

#### `services.tcp_checks`

When a service is running, the Fly platform checks up on it by connecting to a port. The `services.tcp_checks` section defines parameters for those checks. For example, the default tcp\_checks look like this:

```toml
  [[services.tcp_checks]]
    interval = 10000
    timeout = 2000
    grace_period = "5s"
```

* `grace_period`: The time to wait after a VM starts before checking it's health.
* `interval`: The time in milliseconds between connectivity checks.
* `timeout`: The maximum time a connection can take before being reported as failing its healthcheck.

#### `services.http_checks`

Another way of checking a service is running is through HTTP checks as defined in the `services.http_checks` section. These checks are more thorough than tcp\_checks as they require not just a connection but a successful HTTP status in response (i.e, 2xx). Here is an example of a `services.http_checks` section:

```toml
  [[services.http_checks]]
    interval = 10000
    grace_period = "5s"
    method = "get"
    path = "/"
    protocol = "http"
    timeout = 2000
    tls_skip_verify = false
    [services.http_checks.headers]
```

Roughly translated, this section says every ten seconds, perform a HTTP GET on the root path (e.g. http://appname.fly.dev/) looking for it to return a HTTP 200 status within two seconds. The parameters of a `http_check` are listed below.

* `grace_period`: The time to wait after a VM starts before checking it's health.
* `interval`: The time in milliseconds between connectivity checks.
* `method`: The HTTP method to be used for the check.
* `path`: The path of the URL to be requested.
* `protocol`: The protocol to be used (`http` or `https`)
* `timeout`: The maximum time a connection can take before being reported as failing its healthcheck.
* `tls_skip_verify`: When `true` (and using HTTPS protocol) skip verifying the certificates sent by the server.
* `services.http_checks.headers`: This is a sub-section of `services.http_checks`. It uses the key/value pairs as a specification of header and header values that will get passed with the http_check call.

**Note**: The `services.http_checks` section is optional and not generated in the default `fly.toml` file.

## The `mounts` section

This section supports the Volumes feature for persistent storage, available as a feature preview. The section has two settings, both are needed.

```toml
[mounts]
source="myapp_data"
destination="/data"
```

### `source`

The `source` is a volume name that this app should mount. Any volume with this name, in the same region as the app and that isn't already mounted, may be mounted. A volume of this name must exist in _some_ region for the application to deploy.

### `destination`

The `destination` is directory where the `source` volume should be mounted on the running app.

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
