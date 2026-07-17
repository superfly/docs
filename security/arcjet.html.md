---
title: Application Security by Arcjet
layout: docs
sitemap: true
nav: firecracker
redirect_from: /docs/reference/arcjet/
---

[Arcjet](https://arcjet.com) is a security layer that allows developers to protect their apps with just a few lines of code. Implement rate limiting, bot protection, email validation, and defense against common attacks.

Arcjet is installed as a dependency in your application and doesn't require an agent or any additional infrastructure. The SDK is currently available for JS & Python applications, with support for other languages coming soon.

## Quick start (Next.js)

A quick way to see what Arcjet can do is to deploy [the example app](https://github.com/arcjet/arcjet-example-nextjs-fly). It's also available at [example.arcjet.com](https://example.arcjet.com).

Clone the GitHub repository:

```cmd
git clone git@github.com:arcjet/arcjet-example-nextjs-fly.git
```

Set up a new Fly app:

```cmd
fly launch --no-deploy
```

This command will generate a `Dockerfile` and a `fly.toml` for you.

Create an Arcjet account and link it to your Fly app:

```cmd
fly ext arcjet create
```

This will:

* Create an Arcjet account linked to your Fly account.
* Create an Arcjet team mapped to your Fly organization.
* Create an Arcjet site for your Fly application.
* Set `ARCJET_KEY` as a secret on your Fly application.

Deploy to Fly:

```cmd
fly deploy
```

Open your app in your browser and try the features.

Review the request details in your Arcjet dashboard:

```cmd
fly ext arcjet dashboard
```

## Run locally

Arcjet protections run locally as well as when deployed to Fly. This makes it easy to test and debug security rules.

Assuming you have already cloned [the example](https://github.com/arcjet/arcjet-example-nextjs-fly) and linked Arcjet to your Fly app (see above):

Log into your Arcjet dashboard to get the `ARCJET_KEY` for your app.

```cmd
fly ext arcjet dashboard
```

Install dependencies:

```cmd
npm ci
```

Rename `.env.local.example` to `.env.local` and add your Arcjet key. If you
want to test the rate limiting authentication, you will also need to add an
Auth.js secret and [create a GitHub OAuth
app](https://authjs.dev/guides/configuring-github).

Start the dev server

```cmd
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Protecting your application with Arcjet

Once you have set your `ARCJET_KEY` secret, you can start using Arcjet to protect your application. Arcjet supports many different web frameworks e.g. [Bun](https://docs.arcjet.com/get-started/bun), [Next.js](https://docs.arcjet.com/get-started/nextjs), [Node.js](https://docs.arcjet.com/get-started/nodejs), [SvelteKit](https://docs.arcjet.com/get-started/sveltekit).

### Node.js example

You can also find this example [on GitHub](https://github.com/arcjet/arcjet-js/tree/main/examples/nodejs-rl).

1. Install the Arcjet SDK:

    ```cmd
    npm i @arcjet/node
    ```

1. Add a rate limit to a route in `index.ts`:

    ```ts
    import arcjet, { tokenBucket } from "@arcjet/node";
    import http from "node:http";

    const aj = arcjet({
      key: process.env.ARCJET_KEY!, // Set as a secret on your Fly app
      rules: [
        // Create a token bucket rate limit. Other algorithms are supported.
        tokenBucket({
          mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
          characteristics: ["userId"], // track requests by a custom user ID
          refillRate: 5, // refill 5 tokens per interval
          interval: 10, // refill every 10 seconds
          capacity: 10, // bucket maximum capacity of 10 tokens
        }),
      ],
    });

    const server = http.createServer(async function (
      req: http.IncomingMessage,
      res: http.ServerResponse,
    ) {
      const userId = "user123"; // Replace with your authenticated user ID
      const decision = await aj.protect(req, { userId, requested: 5 }); // Deduct 5 tokens from the bucket
      console.log("Arcjet decision", decision);

      if (decision.isDenied()) {
        res.writeHead(429, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Too Many Requests", reason: decision.reason }),
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Hello world" }));
      }
    });

    server.listen(8000);
    ```

1. Run your application:

    ```cmd
    npx tsx --env-file .env.local index.ts
    ```

Load the application and refresh the page a few times to see the rate limit in action.

### Python + FastAPI example

You can also find this example [on GitHub](https://github.com/arcjet/examples/tree/main/examples/fastapi).

1. Install the Arcjet SDK:

    ```cmd
    mkdir arcjet-fastapi
    cd arcjet-fastapi
    uv init
    uv add arcjet "fastapi[standard]" uvicorn
    ```

1. Create a new file at `main.py` with the contents:

    ```python
    import os
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    
    from arcjet import (
        arcjet,
        shield,
        detect_bot,
        token_bucket,
        Mode,
        BotCategory,
    )
    
    app = FastAPI()
    
    aj = arcjet(
        key=os.environ["ARCJET_KEY"],  # Get your key from https://app.arcjet.com
        rules=[
            # Shield protects your app from common attacks e.g. SQL injection
            shield(mode=Mode.LIVE),
            # Create a bot detection rule
            detect_bot(
                mode=Mode.LIVE,
                allow=[
                    BotCategory.SEARCH_ENGINE,  # Google, Bing, etc
                    # Uncomment to allow these other common bot categories
                    # See the full list at https://arcjet.com/bot-list
                    # BotCategory.MONITOR, # Uptime monitoring services
                    # BotCategory.PREVIEW, # Link previews e.g. Slack, Discord
                ],
            ),
            # Create a token bucket rate limit. Other algorithms are supported
            token_bucket(
                # Tracked by IP address by default, but this can be customized
                # See https://docs.arcjet.com/fingerprints
                # characteristics: ["ip.src"],
                mode=Mode.LIVE,
                refill_rate=5,  # Refill 5 tokens per interval
                interval=10,  # Refill every 10 seconds
                capacity=10,  # Bucket capacity of 10 tokens
            ),
        ],
    )
    
    
    @app.get("/")
    async def hello(request: Request):
        # Call protect() to evaluate the request against the rules
        decision = await aj.protect(
            request,
            requested=5,  # Deduct 5 tokens from the bucket
        )
    
        # Handle denied requests
        if decision.is_denied():
            status = 429 if decision.reason.is_rate_limit() else 403
            return JSONResponse(
                {"error": "Denied", "reason": decision.reason.to_dict()},
                status_code=status,
            )
    
        # Check IP metadata (VPNs, hosting, geolocation, etc)
        if decision.ip.is_hosting():
            # Requests from hosting IPs are likely from bots, so they can usually be
            # blocked. However, consider your use case - if this is an API endpoint
            # then hosting IPs might be legitimate.
            # https://docs.arcjet.com/blueprints/vpn-proxy-detection
    
            return JSONResponse(
                {"error": "Denied from hosting IP"},
                status_code=403,
            )
    
        return {"message": "Hello world", "decision": decision.to_dict()}
    ```

1. Run your application with your Arcjet key in the environment:

    ```cmd
    export ARCJET_ENV=development
    export ARCJET_KEY=ajkey_yourkey
    uv run uvicorn main:app --reload
    ```

## Pricing

See [the Arcjet pricing page](https://arcjet.com/pricing).

## Support

Email: <support@arcjet.com>

Discord: [Join](https://arcjet.com/discord).

See the Arcjet docs for the [full support policy](https://docs.arcjet.com/support).
