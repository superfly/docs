---
title: Session Affinity (a.k.a. Sticky Sessions)
layout: docs
nav: guides
author: rubys
date: 2024-07-17
---

<figure>
  <img src="/static/images/session-affinity.png" alt="Illustration by Annie Ruygt of a machine sticking envelopes together" class="w-full max-w-lg mx-auto">
</figure>

## Overview

In a number of scenarios, it is important to ensure that certain requests are routed to a specific Machine.  This frequently is expressed in the form of wanting an entire user's session to be processed by the same Machine.

There are two approaches to addressing this with Fly.io:
  * [fly-force-instance-id](#fly-force-instance-id) - Client-side request header
  * [fly-replay](#fly-replay) - Server-side response header

## Fly-Force-Instance-Id

This approach requires you to have control over the client, typically a browser, but allows for immediate routing without an additional hop. The example below uses Rails' Hotwire [Turbo](https://turbo.hotwired.dev/) with [Stimulus](https://stimulus.hotwired.dev/) to send the required header.

For this to work, the client needs some way of knowing what Machine to route requests to.  This can be accomplished by adding attributes to the `<body>` tag in HTML responses.  With Rails, those tags would be found in
`app/views/layouts/application.html.erb`.

An example `<body>` tag:

```erb
<body data-instance="<%= ENV['FLY_MACHINE_ID'] %>"
   data-controller="sticky-session">
```

These attributes identify the Machine instance to direct future requests to, and the name of the Stimulus controller to be used to make this happen.

Place the following into `app/javascript/controllers/sticky-session.js`:

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="sticky-session"
export default class extends Controller {
  connect() {
    document.documentElement.addEventListener(
     'turbo:before-fetch-request',
     this.beforeFetchRequest
    )
  }

  disconnect() {
    document.documentElement.removeEventListener(
     'turbo:before-fetch-request',
     this.beforeFetchRequest
    )
  }

  beforeFetchRequest = event => {
    event.detail.fetchOptions.headers['fly-force-instance-id'] =
      this.element.dataset.instance;
  }
}
```

This code will subscribe and unsubscribe from
[turbo:before-fetch-request](https://turbo.hotwired.dev/reference/events#turbo%3Abefore-fetch-request) events and insert a `fly-force-instance-id` header into requests.

## Fly-Replay

This approach is implemented entirely on the server. Your application examines each request, determines which Machine should handle it, and returns a `fly-replay` response header to route the request accordingly. Initial requests will require an additional "hop" to route, and [requests are limited to payloads of 1 megabyte](https://fly.io/docs/networking/dynamic-request-routing/#limitations).

The example below creates [Express Middleware](https://expressjs.com/en/guide/using-middleware.html) that routes requests based on a session cookie:

```js
// Import required modules
import express from "express";
import cookieParser from "cookie-parser";

// Create an Express app
const app = express();

// Middleware to parse cookies
app.use(cookieParser());

app.use((request, response, next) => {
  // This assumes your application has already established a session using a session_id cookie via your session middleware.
  const sessionId = request.cookies["session_id"];

  if (!sessionId) {
    // No session - let any machine handle it
    next();
    return;
  }

  // Determine which machine should handle this session
  // This could be based on:
  // - Database lookup (session -> machine mapping)
  // - Consistent hashing of session ID
  // - Regional routing logic
  // - Load balancing algorithm
  // You'll need to implement determineTargetMachine() based on your routing strategy
  const targetMachineId = determineTargetMachine(sessionId);

  if (targetMachineId === process.env.FLY_MACHINE_ID) {
    // This is the correct machine - handle the request
    next();
  } else {
    // Route to the correct machine
    response.set('Fly-Replay', `instance=${targetMachineId}`);
    response.status(307);
    response.send();
  }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Optimizing with Replay Caching

For production workloads, having your application replay every request can create unnecessary load and latency. You can configure Fly Proxy to cache replay decisions, so only the first request in a session needs to consult your application.

Add replay cache rules to your `fly.toml`:

```toml
[http_service]
  internal_port = 8080
  force_https = true

  [[http_service.http_options.replay_cache]]
    path_prefix = "/"
    ttl_seconds = 300
    type = "cookie"
    name = "session_id"
```

With this configuration:
1. The first request with a given `session_id` hits your app
2. Your app returns a `fly-replay` response
3. Fly Proxy caches this decision for that specific `session_id` value
4. For the next 5 minutes, requests with the same `session_id` are automatically routed without consulting your app

Caching is an optimization, not a guarantee, so your origin app still needs to handle replaying requests that aren't routed by a cached replay.

Replays can be cached on any existing cookie or request header. For sticky sessions with an API, for example, you might choose to cache based on the `Authorization` header.

For complete details on replay caching configuration, see [Session-based Replay Caching](/docs/networking/dynamic-request-routing/#session-based-replay-caching).

### Related Reading

- [Dynamic Request Routing with `fly‑replay`](docs/networking/dynamic-request-routing/) Explains how `fly‑replay` lets you route requests to a specific machine or region—core technique for sticky sessions.
- [Load Balancing](/docs/reference/load-balancing/) Details how the Fly Proxy routes traffic among Machines, which underpins how session‑affinity decisions get made.
- [Networking](/docs/networking/) A broad overview of how Fly handles public/private networking, Anycast IPs, WireGuard mesh, domain routing, and more.