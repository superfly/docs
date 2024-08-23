---
title: Troubleshoot your deployment
layout: docs
nav: firecracker
---

<figure>
  <img src="/static/images/docs-magnify.webp" alt="">
</figure>

This section gives you some ideas of how to start troubleshooting if your deployment doesn't work as expected. If you're still stuck after reading, then visit our [community forum](https://community.fly.io/) for more help.

## Try this first

If the error you get isn’t obvious or specific, then try these basic steps first, to either fix the problem or to arm yourself with knowledge.

### Update flyctl

By default, flyctl (the Fly CLI), [updates automatically](https://community.fly.io/t/flyctl-versions-autoupdating-and-the-cli-apocalypse/13794).

But if you've disabled automatic updates, then you should update flyctl:

```cmd
fly version update
```

We frequently add new features to flyctl, so you should keep it up to date to avoid breaking things. You can also turn automatic updates back on with:

```cmd
fly settings autoupdate enable
```

### Check connectivity with fly doctor

Run some basic connectivity test for things like WireGuard, IP addresses, and local Docker instance:

```
fly doctor
```

Any failures in the `fly doctor` output point to where you can start troubleshooting.

### Review your `fly.toml` configuration

Double-check the formatting and configuration options in your `fly.toml` file. Besides [checking port numbers](#warning-the-app-is-listening-on-the-incorrect-address-host-and-port-checking), you should also review any recent changes and make sure you're following the conventions described in the [app configuration](/docs/reference/configuration/) docs.

## Get more information about failures

Logs have knowledge.

### Check the logs

Check the logs of the app when it's running or when you run `fly deploy`. Run your command in one terminal window and open a second window to view the logs.

To get the most recent log entries:

```cmd
fly logs
```

Look for error messages that indicate why the app or deploy is failing, and the logs that occurred just before the app crashed or the deploy failed.

If you can see messages about the app just exiting, then there's likely an issue with your project source, and you'll need to address that before you can deploy successfully.

### Activate debug logging

Activate debug level logs on a command, like `fly deploy`:

```cmd
LOG_LEVEL=debug fly <command>
```

LOG_LEVEL=debug prints all the logs into the console as the command runs.

### Inspect with SSH

You can use `fly ssh console` to get a shell on a running Machine in your app. Use `fly ssh console -s` to select a specific Machine.

## WARNING The app is not listening on the expected address (Host and port checking)

Check your app's host and port settings. To be reachable by Fly Proxy, an app needs to listen on `0.0.0.0` and bind to the `internal_port` defined in the `fly.toml` configuration file.

If your app is not listening on the expected address and the configured port, you’ll get the following warning message when you deploy your app:

```
WARNING The app is not listening on the expected address and will not be reachable by fly-proxy.
```

The message supplies:

- The host address your app should be listening on, which is `0.0.0.0:<internal_port value>`.
- A list of processes inside the Machine with TCP sockets in LISTEN state. This includes `/app`, which might show something like `[ :: ]:8080`; the host address your app is trying to listen on. (You can ignore hallpass on port 22, which is used for SSH on Machines.)

### Fix the "app is not listening on the expected address" error

When you launch a new Fly App, the value of `internal_port` in the `fly.toml` file depends on the default port for your framework or the `EXPOSE` instruction in your Dockerfile. The default port when the `fly launch` command doesn't detect a framework or find ports set in a Dockerfile is `8080`.

To fix the error, you can either:
- Configure your app to listen on host `0.0.0.0:<internal port value in fly.toml>`, or
- Configure your app to listen on host `0.0.0.0:<framework default or other port>` and change the `internal_port` value in the `fly.toml` configuration file to match.

For example, if your app listens on `0.0.0.0:3000`, then set `internal_port = 3000` in the `fly.toml`.

### Why does my app listen on localhost with a different port number?

A lot of frameworks will listen on `localhost`/`127.0.0.1` by default so that the developer can connect to the app. Different frameworks also define different default ports, like 3000, 8000, or 8080, for example. It can be easy to make a mistake and configure your app in a way that makes it impossible for the Fly Proxy to route requests to it. And it can be difficult to debug, especially if your framework doesn't print the listening address to logs and your image doesn't have `netstat` or `ss` tools.

Learn more about [connecting to an app service](/docs/networking/app-services/).

### Example - Configure port and host in a Fastify Node app

How do you figure out which address port your app is listening on? Check your code for where the web service started up - sometimes it'll be just `serve()` or` listen()` and what's missing is parameters for the address and/or port.

For example, here’s a getting-started app for Fastify (Node.js):

```jsx
// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
// CommonJs
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
```

This example will work locally, but when you run `fly deploy` you’ll get the “app is not listening on the expected address” warning.

You can modify the example to listen on host `0.0.0.0` and to print a log with the listening address:

```jsx
...

fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
```

Then make sure that the `internal_port` value in `fly.toml` is set to `3000`.

## Smoke checks failing

Smoke checks run during deployment to make sure that a crashing app doesn't get successfully deployed to all your app's Machines. If possible, the smoke check failure output includes an excerpt of the logs to help you diagnose the issue with your app. Common issues with new apps might include [Machine size](#out-of-memory-oom-or-high-cpu-usage), missing environment variables, or other problems with the app's configuration.

## Health checks failing

We don't automatically add health checks to your `fly.toml` file when you create your app. The health checks that you subsequently add to your app can fail for a number of reasons.

A good first step can be to look at a failed Machine and see what you can figure out. To see the specific Machine status, run `fly status --all` to get a list of Machines in your app. Then run `fly machine status <machine id>` . This will give you a lot more information. Make sure you check the exit code: if it’s non-zero, then your process crashed.

### Out-of-memory (OOM) or high CPU usage

If your Machine's resources are reaching their limits, then this could slow everything down, including accepting connections and responding to HTTP requests. Slow responses can trigger health check failures.

You might see out-of-memory errors in logs. Some apps (like Node.js apps that use Prisma) can be RAM-intensive. So your app may be killed for out-of-memory (OOM) reasons. The solution is to just [add more RAM](https://fly.io/docs/apps/scale-machine/#add-ram). 

If you see high CPU usage in metrics you might need to select a new [preset CPU/RAM combination](/docs/apps/scale-machine/#select-a-preset-cpu-ram-combination), or even update only the [CPU on an individual Machine](/docs/apps/scale-machine/#machines-not-belonging-to-fly-launch).

### Grace period

Grace period is the time to wait after a Machine starts up before checking its health.

If your app takes a longer time to start up, then set a longer health check grace period.

To increase the grace period for your app, update the `fly.toml` file. For example, if your app takes 4 seconds to start up, then you could set the grace period to 6 seconds:

```toml
  # If you're using tcp_checks
  [[services.tcp_checks]]
    grace_period = "6s"
    ...

  # If you're using http_checks
  [[services.http_checks]]
    grace_period = "6s"
    ...
  # or
  [[http_service.checks]]
    grace_period = "6s"
  ...
```

### More issues that cause health checks to fail

- Something is blocking your `accept` loop. This would prevent the health check from connecting.
- You’re using an HTTP check and the response is not a 200 OK.
- Your app is not catching all thrown errors. If your app panics before it can respond to an HTTP request, it will look like a broken request to the health checker.

## Other common deployment issues

A miscellaneous list of potential pitfalls.

### HTTPS in fly.toml

If you specify in your `fly.toml` that `protocol = "https"`, this means that your application must be serving TLS directly. If you have enabled https, try disabling it for debugging.

### Missing variables

For example, if you notice in your logs that the database is failing to connect to `DATABASE_URL`, make sure that variable is set.

To see your app's secrets and environment variables, run:

```
fly config env
```

### Buildpack-based deploys

First of all, we think using a [Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/) rather than buildpacks is more reliable and faster to deploy. If possible, making the switch is probably a good idea!

That's because buildpacks come with lots of dependencies to build different stacks rather than just what you need. On top of that, we've seen buildpack providers upgrade the image on Docker Hub and things Stop Working (even with no code changes on your app). Running `fly launch` already generates Dockerfiles for many [popular frameworks](/docs/languages-and-frameworks/).

That said, if the build used to work, then you can try using a previous, fixed buildpack version so it's back in a known good state.

## Related topics

- [Troubleshoot apps when a host is unavailable](/docs/apps/trouble-host-unavailable/)
- [Fly.io error codes and troubleshooting](/docs/monitoring/error-codes/)
