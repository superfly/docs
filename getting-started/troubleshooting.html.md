---
title: Troubleshooting your Deployment
layout: docs
sitemap: false
nav: firecracker
---

**So your deployment has failed. What now?**

The first thing to remember is that your application may well be running but be unable to give proof of life to the Fly health-checks. These happen as soon as your app is deployed and not passing them causes Fly to kill the latest version of your app that you just deployed and roll back to deploying an older version.

Unless you've not deployed successfully before. In which case it will just fail as there's nothing to roll back to.

## _Port Checking_

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

So, first stop, check what port you have open on your application. Sometimes an app's logs will tell you which internal port it's listening on, which brings us to...

## _Logs Have Knowledge_

Still can't connect? Ok, the first thing to do is look at the logs of the app when it's running. `flyctl logs` will give you the most recent log entries.

The next question is do the logs say why it is failing?

If you can see messages about the app just exiting, then there's likely a specific app issue, and you'll need to address that and redeploy, BUT...

## _Host Checking_

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

## _Inspecting with SSH_

You can use `flyctl ssh console` to connect to a running instance of your application. Use `flyctl ssh console -s` to select a specific instance.

## _Health checks failing_

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

## _HTTPS in fly.toml_

If you specify in your `fly.toml` that `protocol = "https"`, this means your application must be serving TLS directly. If you have enabled this, try disabling for debugging.

## _Are your variables set?_

For example if you notice in your logs that the database is failing to connect to `DATABASE_URL`, make sure that variable is set.

Use these two commands to see environment variables.
```
flyctl secrets list
flyctl config env
```

## _Is your buildpack-based app failing to deploy?_

First of all, we think using a [Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/) rather than buildpacks is more reliable and faster to deploy.

That's because buildpacks come with lots of dependencies to be able to build different app stacks rather than just what you need. On top of that, we've seen buildpack providers upgrade the image on dockerhub and things Stop Working (even with no code changes on your app). Fly launch already generates Dockerfiles for [many](https://fly.io/ruby-dispatch/rails-on-docker/) [popular](https://fly.io/docs/elixir/getting-started/#generate-the-app-and-deploy-with-postgres) [frameworks](https://fly.io/docs/django/getting-started/#provision-django).

That said, one option is to try using a fixed SHA so the build is reproducible. For example, `heroku/buildpacks:20` uses Github Actions for pushing new images and the SHA256 can be found on their [Build, Publish, Test action](https://github.com/heroku/builder/actions/runs/4684001790/jobs/8299757439). Finding and using a known-good build (example):

```
[build]
  builder = "heroku/buildpacks@sha256:4b3478410cb52c480c77f18a26a0c88cfc7e23c259df4ca833e0500215ab5535"
```

instead of the most recent one might help fixing deploys that stopped working for no good reason.
