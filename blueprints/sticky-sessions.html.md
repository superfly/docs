---
title: Session Affinity (a.k.a. Sticky Sessions)
layout: docs
nav: firecracker
author: rubys
date: 2024-07-17
---

In a number of scenarios, it is important to ensure that certain requests are
routed to a specific Machine.  This frequently is expressed in the form of
wanting an entire user's session to be processed by the same Machine.

There are two basic approaches to addressing this with Fly.io:
  * [fly-force-instance-id](https://fly.io/docs/networking/dynamic-request-routing#the-fly-force-instance-id-request-header) request header
  * [fly-replay](https://fly.io/docs/networking/dynamic-request-routing#the-fly-replay-response-header) response header.

## Fly-Force-Instance_Id

This is the preferred approach, but it does require you to have control over the client, typically a browser.  The example below uses Rails' Hotwire [Turbo](https://turbo.hotwired.dev/) with [Stimulus](https://stimulus.hotwired.dev/) to
send the required header.

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

This approach can be implemented entirely on the server.  This will require an additional "hop" to route requests and [is limited to payloads of 1 megabyte](https://fly.io/docs/networking/dynamic-request-routing/#limitations).

The example below creates [Express Middleware](https://expressjs.com/en/guide/using-middleware.html) that creates cookies containing the desired Machine id, and then replays requests that arrive at the wrong destination:

```js

// Import required modules
import express from "express";
import cookieParser from "cookie-parser";

// Create an Express app
const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Make sessions sticky
app.use((request, response, next) => {
  if (!process.env.FLY_MACHINE_ID) {
    next();
  } else if (!request.cookies["fly-machine-id"]) {
    const maxAge = 6 * 24 * 60 * 60 * 1000; // six days
    response.cookie("fly-machine-id", process.env.FLY_MACHINE_ID, { maxAge });
    next();
  } else if (request.cookies["fly-machine-id"] !== process.env.FLY_MACHINE_ID) {
    response.set('Fly-Replay', `instance=${request.cookies["fly-machine-id"]}`)
    response.status(307)
    response.send()
  } else {
    next();
  }
});

// For demonstration purposes: show the Machine id that produced the response
app.get("/", (_request, response) => {
  response.send(`FLY_MACHINE_ID: ${JSON.stringify(process.env.FLY_MACHINE_ID)}`);
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

The key code here appears directly after the `// Make sessions sticky` comment.

If the `FLY_MACHINE_ID` environment variable is not set, this code is not running on a Fly.io Machine, and this middleware immediately exits.

If the `fly-machine-id` cookie is not set, then this presumably is the first request of a session, and the cookie is
set to ensure that future requests are routed to the same destination.

If the cookie does not match the environment variable, then a response containing a `Fly-Replay` header is created, which triggers the Fly Proxy to replay the request to the desired Machine.

If none of these conditions is satisfied, the middleware passes on the request to the next handler.
