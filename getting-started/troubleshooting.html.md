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

When you deploy, you see a message like:

```
TCP 80/443 ⇢ 8080
```

quite early on. This is the Fly services setting and comes from this part for the `fly.toml` file:

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

So, first stop, check what port you have open on your application. If you are using a Dockerfile, also make sure you have `EXPOSE port` in there. Redeploy and see what happens...

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
    await fastify.listen(8080)
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

That's not good, and there's no obvious reference to a host there. If we look at the fastify listen function though, we find it also takes a second parameter, the hostname as a string. If we just modify that line and add in the "0.0.0.0" host there...

```jsx
...
const start = async () => {
  try {
    await fastify.listen(8080,"0.0.0.0")
...
```

And redeploy that, it will work.

## _Inspecting with SSH_

You can use `flyctl ssh console` to connect to a running instance of your application. If this is your first time using `flyctl ssh` then you need to run `flyctl ssh establish` first.

## _Health checks failing_

This problem mainly affects Elixir apps, but if your health checks keep failing during deployment...
```
[error] Health check status changed 'warning' => 'critical'
```

You may have to increase the grace period for health checks. For example if it takes about 30 seconds for your application to boot:
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

For example if you notice in your logs that the database if failing to connect to `DATABASE_URL`, make sure that variable is set.

Use these two commands to see environment variables.
```
flyctl secrets list
flyctl config env
```