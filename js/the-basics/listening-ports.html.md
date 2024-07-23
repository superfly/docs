---
title: Listening Ports
layout: framework_docs
objective: Connecting your application to the internet.
order: 5
---

When you run your application locally you typically test it in your browser by navigating
to a page like `http://localhost:3000/`.  The number after the colon is called a _port_.
For most Node.js applications this port is 3000, for some it is 8080, but it can be any number between 1024 and 65535.

If you are using a high level framework, it will generally take care of this for you.
For lower level frameworks, you likely have code such as the following, typically in
a file named `server.js` or `server.ts`:

```javascript
const hostname = "0.0.0.0";
const port = process.env.port || 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

If you don't have this configured correctly, you may see messages like the following
when you launch:

```text
WARNING The app is not listening on the expected address and will not be reachable by fly-proxy.
You can fix this by configuring your app to listen on the following addresses:
  - 0.0.0.0:3000
```

## Correcting the port

If you look for a file named `fly.toml`, you will see something like the following:

```toml
[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]
```

The number specified by `internal_port` needs to match the port used to start your
application.  It doesn't matter whether you change your application or the contents
of this file to make these numbers match.

## Correcting the host

Another common problem is that the application is set up to listen only for connections
originating from `localhost` instead of connections from the internet.  If you have
code like the above, change the value of `hostname` to either `0.0.0.0` or `[::]`.

Other frameworks may require you to change command used to start your application:

  * Fastify applications can be started using `fastify start --address 0.0.0.0`
  * Gatsby applications can be started using `npx gatsby server -H 0.0.0.0`.

## Exposing multiple ports

If you need to expose additional ports, you will need to add a
[`services` section](https://fly.io/docs/reference/configuration/#the-services-sections) for each additional port.  Be sure to review our
[Public Network Services](https://fly.io/docs/networking/services/) page before proceeding, in particular:

  * If you want your port other than 80/443 to be available on IPv4 you will need to [allocate a dedicated IPv4 address](https://fly.io/docs/flyctl/ips-allocate-v4/).
  * If you want to take advantage of our TLS services, you will want to add _"tls"_ to the list of connection handlers.
