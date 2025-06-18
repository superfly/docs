---
title: Content Encoding with the Fly Proxy
layout: docs
nav: firecracker
author: kcmartin
date: 2025-06-17
---

<div class="callout">
This page explains how our proxy handles HTTP response compression, so you get better performance out of the box.
</div>

Fly.io apps often serve a lot of text: HTML, CSS, JavaScript, JSON. Compressing those responses reduces bandwidth and speeds up delivery. Our edge proxy takes care of this automatically. Unless your app explicitly sets a `Content-Encoding` header, we negotiate compression on your behalf based on the client's `Accept-Encoding` header.

This behavior usually Just Works. But there are edge cases you might care about. Here's how it works, what we support, and how to override it if needed.

### What is Content Encoding?

Content encoding compresses HTTP response bodies (the data or content being sent  by the server to the client). Clients include an `Accept-Encoding` header listing the algorithms they support. If the server supports any of them, it compresses the response and sets the `Content-Encoding` header to indicate the algorithm used. The client then decompresses the body before rendering it.

Common encodings include:

- `br` (Brotli)
- `gzip`
- `zstd` (Zstandard)
- `deflate`

All of these are lossless. They're not encryption, and they're not the same as chunked transfer encoding—they just make payloads smaller.

### What the Fly.io Proxy Supports

The Fly.io proxy handles compression at the edge, automatically selecting the most efficient algorithm supported by both the client and the proxy. It prefers:

1. **Zstandard (zstd)** — Best all-around for performance and size. Supported in Chrome and Firefox.
1. **Brotli** — Still excellent, especially for text. Smaller files than gzip in many cases.
1. **gzip** — The fallback. Widely supported.
1. **deflate** — Rarely used, but still supported.

The proxy only compresses responses that don’t already include a `Content-Encoding` header. If your app sets one, the proxy passes the response through unmodified. You can also explicitly disable compression by setting `Content-Encoding: none`.

### Configuration

Configure the HTTP handler to enable proxy-level compression:

The http handler must be used in your `fly.toml` file for the service. There are two ways to do this (choose only one!):

- [http_service](/docs/reference/configuration/#the-http_service-section) preconfigures the most common options for a service speaking HTTP. It will use the http handler implicitly for both ports 80 and 443 (and additionally, of course, the tls handler for port 443).

```
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  [http_service.concurrency]
    type = "requests"
    soft_limit = 200
    hard_limit = 250
```

- A [service](/docs/reference/configuration/#the-services-sections) block explicitly using the http handler. This example serves http only (no https) on external port 80:

```
[[services]]
  internal_port = 8080
  protocol = "tcp"
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
[[services.ports]]
    handlers = ["http"]  # This is the important part
    port = 80
```

If you want to also serve external port 443 with https, add this to the above:

```
[[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```


### When You Might Want to Customize Behavior

Most apps can rely on the defaults, but if you're doing something more specific like streaming HTML, here is something to consider:

#### Streaming HTML

The proxy buffers responses before compressing them. That can break HTML streaming—e.g., progressive server-side rendering. To avoid buffering, disable compression by setting `Content-Encoding: none` for those responses:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: none
```

### Summary

Fly.io’s proxy gives you fast, automatic compression without config. You can let it handle things, or take control if you need to. If you're troubleshooting compression knowing how the proxy behaves can help you get the results you want.

More in the docs:

- [fly.toml reference](/docs/reference/configuration/)
- [How Fly.io handles HTTP](/docs/reference/services/)
- [Troubleshooting app performance](/docs/apps/performance/)
