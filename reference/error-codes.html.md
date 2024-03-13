---
title: Fly.io Error Codes
layout: docs
sitemap: false
nav: firecracker
---

The Fly.io platform logs internal errors from its various parts such as the proxy, VM orchestrator, etc. Each log line contains an error code, and a field containing that code. This page gives more context about errors.

These codes make it easier to track errors by type, for exmaple in metrics, independently from your application errors.

## Proxy errors

| Code | Name | Explanation |
|--------------------|-----------------------|--|
| P1 | http_handshake | Could not perform an HTTP handshake with a machine |
| P2 | http_request | Could not complete HTTP request to a machine |
| P3 | backhaul_connect |  Could not connect to the worker hosting a machine. This is a Fly.io internal issue. |
| P4 | connection_refused | Machine refused the connection. Check if your app is listening on `0.0.0.0` or `::`, and not just on `127.0.0.1` or `localhost`. Many servers print the port they're listening on at boot time. |
| P5 | connection_reset | Machine reset the connection. This means your app is closing the connection before returning data. Check your app logs and run your app in debug mode, if available. |

