---
title: Troubleshooting your Deployment
layout: docs
sitemap: false
nav: firecracker
---

**So your deployment has failed. What now?**

The first thing to remember is that your application may well be running but be unable to give proof of life to the Fly health-checks. These happen as soon as your app is deployed and not passing them causes Fly to kill the latest version of your app that you just deployed and roll back to deploying an older version.

Unless you've not deployed successfully before. In which case it will just fail as there's nothing to roll back to.

## Port Checking

So the first thing to check is can your application see the world.

Check to see how your services are configured with `fly services list`:

```cmd
fly services list -a <app-name>
```
```out
Services
PROTOCOL        PORTS                   
TCP             80 => 8080 [HTTP]      
                443 => 8080 [TLS, HTTP]
```

This is the Fly services setting and comes from this part for the `fly.toml` file:

```
[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = "80"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

The important part of this is the internal port, in this case, set to 8080.

Now, that means that there must be an open TCP port on port 8080. If you've opened port 80 or 443 on your application, that's likely to be the wrong port.

As for _external ports_, if you're running services over IPv4 on ports other than 80 or 443, you need to make sure your app has a [dedicated IPv4 address](https://fly.io/docs/reference/services/#dedicated-ipv4). The [shared IPv4 addresses](https://fly.io/docs/reference/services/#shared-ipv4) that comes bundled with new apps will only accept connections on those two ports.

So, first stop, check what port you have open on your application. Sometimes an app's logs will tell you which internal port it's listening on, which brings us to...

## Logs Have Knowledge

Still can't connect? Ok, the first thing to do is look at the logs of the app when it's running. `flyctl logs` will give you the most recent log entries.

The next question is do the logs say why it is failing?

If you can see messages about the app just exiting, then there's likely a specific app issue, and you'll need to address that and redeploy, BUT...

## Host Checking

If there are messages about being unable to bind to a network port or listening to localhost, your problem is different. A lot of frameworks will, in development mode or similar, open a port on the localhost so that the developer can talk to the app.

The problem is that no one else can talk to the localhost so although the app may have the right port, it's on the wrong network interface. The Rule of thumb to fix this is to get the app to open up port 8080 on the IP address 0.0.0.0. That's anyone outside the system. Done that? Time to redeploy and hopefully this time you are working.

And how do you know if your app or framework is doing that? A quick check of the code and look for where the web service that listens is stated up - sometimes it'll be just `serve()` or `listen()` and what's missing is parameters for the port.

As an example, here's a bit of a [Fastify](https://www.fastify.io/) node app - it's their hello world.

```jsx
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 8080 })
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

If we build this locally and run it, it works just fine. Deploy it to fly though and we get:

```
Monitoring Deployment
You can detach the terminal anytime without stopping the deployment

1 desired, 1 placed, 0 healthy, 1 unhealthy
v1 failed - Failed due to unhealthy allocations - no stable job version to auto revert to
***v1 failed - Failed due to unhealthy allocations - no stable job version to auto revert to
```

That's not good, and there's no obvious reference to a host there. Lucky for us the fastify listen function accepts an object for defining additional options like host. We can pass in "0.0.0.0" as the host to successfully run inside a Docker container like so:

```jsx
...
const start = async () => {
  try {
    await fastify.listen({ port: 8080, host: "0.0.0.0" })
...
```

And redeploy that, it will work.

## Inspecting with SSH

You can use `flyctl ssh console` to connect to a running instance of your application. Use `flyctl ssh console -s` to select a specific instance.

## Health checks failing

If your health checks keep failing during deployment...

```
[error] Health check status changed 'warning' => 'critical'

```

... the first step is to look at a failed VM and see what you can figure out. RAM increases are only useful if the VM had an out of memory error (which you might see in the logs). The health check grace period is only helpful if health checks took too long to pass.

To see the specific VM status, run `fly status --all` to get a list of VMs. Find one with status `failed` , then run `fly vm status <id>` . This will give you a lot more information. Make sure you check the exit code, if it’s 0 it means health check failures, if it’s not zero it’s some issue crashing the process.

To increase the grace period for your app (ex: if it takes about 30 seconds for your application to boot), you would do so:
```
  # If you are using tcp_checks
  [[services.tcp_checks]]
    grace_period = "30s"
    ...

  # If you are using http_checks
  [[services.http_checks]]
    grace_period = "30s"
    ...
```

## HTTPS in fly.toml

If you specify in your `fly.toml` that `protocol = "https"`, this means your application must be serving TLS directly. If you have enabled this, try disabling for debugging.

## Are your variables set?

For example if you notice in your logs that the database is failing to connect to `DATABASE_URL`, make sure that variable is set.

Use these two commands to see environment variables.
```
flyctl secrets list
flyctl config env
```

## Did your buildpack-based deploy stop working?

First of all, we think using a [Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/) rather than buildpacks is more reliable and faster to deploy. If possible, making the switch is probably a good idea!

That's because buildpacks come with lots of dependencies to build different stacks rather than just what you need. On top of that, we've seen buildpack providers upgrade the image on Docker Hub and things Stop Working (even with no code changes on your app). Running `fly launch` already generates Dockerfiles for [many](https://fly.io/ruby-dispatch/rails-on-docker/) [popular](https://fly.io/docs/elixir/getting-started/#generate-the-app-and-deploy-with-postgres) [frameworks](https://fly.io/docs/django/getting-started/#provision-django).

That said, if the build used to work, then you can try using a previous, fixed buildpack version so it's back in a known good state. For example, `heroku/buildpacks:20` uses Github Actions for pushing new images and the SHA256 can be found on their [Build, Publish, Test action](https://github.com/heroku/builder/actions/workflows/build-test-publish.yml), under `publish`. After finding a working build, use `@sha256:{digest}` to pin your app to that version. Example:

```
[build]
  builder = "heroku/buildpacks@sha256:4b3478410cb52c480c77f18a26a0c88cfc7e23c259df4ca833e0500215ab5535"
```

## Do you have enough RAM?

Some apps (like NodeJS ones that use Prisma) can be RAM intensive. So your app may be killed for out-of-memory (OOM) reasons. The solution is just to [add more RAM](https://fly.io/docs/apps/scale-machine/#add-ram).

## Troubleshoot connections to a service

You've checked your app VMs are running. You're pretty sure your service is listening on the internal port you put in your `fly.toml` or Machine config, it's listening on all network interfaces and not just localhost, and it's got public IP addresses, but you still can't connect to it in the browser. It's time to get systematic. There are a number of other ways you can try to connect to your service, to narrow down where the problem starts.

From the inside outward (you could start at the other end and work inward too):

### Connect to the process from inside the VM

You may want to make sure the process is doing what you think it is, inside the VM. If you should have a service running internally, you can try connecting to it with cURL from within the VM. Pull up an interactive shell with `fly ssh console`. If your Docker image doesn't have `curl` installed, you can install it; it'll be wiped away next time the VM is restarted (e.g. on the next `fly deploy`).

Note: Don't use the `fly console` command; it brings up an ephemeral VM from the app's Docker image, but doesn't start up the same process(es), so your service won't be running.

A HEAD request (`curl -I`) should be enough to see if you're getting a response:

```cmd
# curl -I http://localhost:80
```
```out
HTTP/1.1 200 OK
Server: nginx/1.23.4
Date: Tue, 02 May 2023 20:32:32 GMT
Content-Type: text/html
Content-Length: 615
Last-Modified: Tue, 28 Mar 2023 15:01:54 GMT
Connection: keep-alive
ETag: "64230162-267"
Accept-Ranges: bytes

```

That `200 OK` means my service is running, and listening on port 80 as anticipated.

You can further check that the right HTML is being served, with `curl http://localhost:<port>` (leaving out the `-I`).

One step up from `localhost`, check if the service is bound to the right address.

For a public app, or one using Flycast for load balancing, that's `0.0.0.0:<port>`:

```
# curl -I 0.0.0.0:80
HTTP/1.1 200 OK
...
```
If this fails (i.e. returns a status code that's not 200), Fly Proxy won't be able to reach the service to route to it.

For an app that should be reachable directly over its private IPv6 address from within its WireGuard network, it's `fly-local-6n:<port>`.
Inside a VM, the `fly-local-6pn` hostname resolves to the VM's private IPv6 address. You can use this (or the actual address) to check whether your service is bound to this address:

```
# curl -I fly-local-6pn:80
HTTP/1.1 200 OK
...
```

If this fails, the service won't be reachable on your private WireGuard network.

### Check if a service is available on the private network

Let's try to connect again with `curl`, this time from outside the VM! This time, `fly console` will do, as will a shell on one of the app's VMs with `fly ssh console`, a shell on another app in the same private network, or from your local computer [connected over WireGuard](https://fly.io/docs/reference/private-networking/#private-network-vpn).


If this service is meant to be reached over 6PN, there's a good chance you're using [internal DNS](https://fly.io/docs/reference/private-networking/) and `.internal` addresses. The simplest one is just `<app-name>.internal`.

```cmd
curl -I myapp.internal
```
```out
HTTP/1.1 200 OK
```

If you have an address, you can use that directly:

```cmd
curl -I 'http://[fdaa:0:3b99:a7b:88dc:e1a6:42b4:2]:80/‘
```
```out
HTTP/1.1 200 OK
```

### Check if a service is available via its `.fly.dev` hostname

You can try `curl`ing the hostname (and port if desired), just to make sure the problem isn't some sort of browser shenanigans. cURL doesn't follow redirects unless you tell it to, and it doesn't cache.

```
$ curl -I https://<app-name>.fly.dev:443  
HTTP/2 200 
...

```

The HTTP URL always elicits a 301 redirect, because the Fly Proxy upgrades HTTP connections to HTTPS. To get cURL to follow the redirect to see if there's anything there, use the `-L` flag.

```
$ curl -IL http://<app-name>.fly.dev:80
HTTP/1.1 301 Moved Permanently
location: https://<app-name>.fly.dev/
...

HTTP/2 200 
...

```

Success!


