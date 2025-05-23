---
title: Connecting to User Machines
layout: docs
nav: firecracker
date: 2025-04-02
---

# Connecting to User Machines

When running machines for end users, a common challenge is efficiently managing and routing requests to these machines. This document outlines the recommended approach for connecting to user machines on Fly.io, focusing on the following key concepts:

## Typical Stack

- **Coordinator**: Your app that manages machines on behalf of end users. This can also function as the Router.
- **Router**: An app that relays requests to user machines. This can be the same as the Coordinator.
- **User App**: Apps assigned to specific users on isolated networks.
- **User Machine**: Machine(s) in those apps.

## HTTP Services

A typical setup includes two services:
- A **management** HTTP service (`port 9090`) for tasks such as:
  - Sending LLM generated code changes
  - Health checks
  - Metrics requests
- A **public** HTTP service (`port 4443`) for:
  - Live Previews
  - LLM <-> MCP Server Connectivity
  - Deployed User Apps

### HTTP Request Processing

![HTTP Request Flow](/docs/blueprints/connecting-to-user-machines-http-flow.svg)

This diagram illustrates how HTTP requests are processed:
- Public HTTP requests arrive at your router app, which issues a fly-replay to a specific user app. The Fly Proxy then replays the request to the target app, matching the service based on the inbound request port.
- Private HTTP requests arrive at an internal management gateway, which is not accessible from the internet. The same replay process gets that request to the user app on the specified port, matching the service based on the inbound request port.

## Using fly-replay

The recommended mechanism for connecting to user machines over HTTP is the `fly-replay` response header. This works by instructing our global proxy to reroute the request to a specific machine. If the machine is not running, the proxy will start it. This approach works for any kind of HTTP request, including WebSockets. Since our proxy manages the entire request, your router app is no longer a point of failure after it sends the `fly-replay` header.

### Port Matching

When using fly-replay, the proxy matches the incoming request's port to the target service's public port. For example:
- A request to port 80 will be routed to a service configured with `port: 80`
- A request to port 9090 will be routed to a service configured with `port: 9090`

This means your router app needs to receive requests on the same ports that your target services are configured to use. For example, to connect to a management API on port 9090, the router must receive the request on port 9090.

### Private Network Router Example

The [private-network-router](https://github.com/fly-apps/private-network-router) example shows how to build a router that can handle multiple services. It uses flycast to keep management APIs private while still allowing routing to them. The router:

1. Receives requests on any port
2. Determines the target app and machine based on the request
3. Sends a `fly-replay` response header with parameters like `app` and `instance` to route the request to the correct app and machine. For more details on the parameters, see the [fly-replay documentation](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header).

This pattern allows you to:
- Keep management APIs private by running them with flycast
- Route requests to multiple services from a single router
- Maintain security by not exposing management ports directly to the internet

## Authentication

- **Management Service**: Use simple `Authorization: Bearer <token>` with a pre-shared secret assigned to the app at creation time. No need for more complicated authentication mechanisms.
- **Public Services**: Authenticate these through your coordinator or router app before issuing the `fly-replay` header.

## Antipatterns

- **flycast, <app>.fly.dev, and Dedicated IPs**: These are meant for permanent apps that need to communicate with each other. They and involve more moving parts than simply routing with `fly-replay`. More moving parts mean more potential for issues.
- **TCP or UDP**: Avoid using raw TCP or UDP when communicating with end user machines. If necessary, consider running Tailscale containers alongside your code.

## Example Service Configuration

Here's an example service configuration for a machine that includes both a management service and a standard public HTTP service:

```json
{
  "services": [
    {
      "name": "management",
      "internal_port": 9090,
      "ports": [
        {
          "port": 9090,
          "handlers": ["http"]
        }
      ]
    },
    {
      "name": "public",
      "internal_port": 8080,
      "ports": [
        {
          "port": 80,
          "handlers": ["http"]
        }
      ]
    }
  ]
}
```

This configuration sets up:
- A management service listening internally on port 9090 and exposed on port 9090
- A public service listening internally on port 8080 and exposed on port 80
Both services will automatically start when needed and stop when idle. 