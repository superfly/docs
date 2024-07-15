---
title: Error codes and troubleshooting
layout: docs
nav: firecracker
redirect_from: 
  - /docs/reference/error-codes/
  - /docs/metrics-and-logs/error-codes/
---

The Fly.io platform logs errors to customer log streams. Each log line contains an error code and a field containing that code. This page gives more context about the errors and how to troubleshoot them.

## Proxy errors

The Fly proxy issues different categories of errors, identifiable by the second letter in each code, referring to: Upstream, Connection, TLS, Machine, App, Edge and Routing errors.

### Internal Errors

These errors are internal to the Fly proxy. They're not related to your application behavior.

#### PP01: Failed to set TCP socket options

The proxy wasn't able to set TCP socket options. This is an internal Fly.io error.

### Upstream Proxy errors

Upstream errors occur when the proxy fails to send or complete a request to one of your upstream application machines.

#### PU01: Failed HTTP/2 handshake

In the case that your app accepts h2c requests, `PU01` errors indicate that the HTTP/2 handshake to one of your machines failed. This error is not relevant to applications accepting only HTTP/1 connections.

#### PU02: Failed to complete HTTP request to instance

An HTTP request to a machine was started, but could not be completed.

#### PU03: Unreachable worker host

The underlying host where a machine lives became unreachable. This is an internal Fly.io error unrelated to your application.

#### PU04: Could not build HTTP request

It wasn't possible to create an HTTP request, for unknown reasons.


#### PC01: Machine refused connection on port

A request was sent to a specific port that isn't open on the target machine.

Is your app listening on the correct port?

Is your app listening on `0.0.0.0` or `::`? Make sure it's not listening on `127.0.0.1`. Check your app startup logs. Servers often print the address they're listening on.

#### PC02: Connection refused

A request was sent to an unspecified port that isn't open on the target machine.

Is your app listening on `0.0.0.0` or `::`? Make sure it's not listening on `127.0.0.1`. Check your app startup logs. Servers often print the address they're listening on.

#### PC03: Connection reset

This indicates a problem with your application resetting a TCP connection prematurely. Check your application logs for possible causes.

#### PC04: Connection aborted

This indicates a problem with your application aborting a TCP connection prematurely. Check your application logs for possible causes.

#### PC05: Connection timed out

This indicates a problem with connections timing out to your application. Check the following to diagnose:

* Application logs may indicate the cause of a timeout
* Ensure your app isn't overloaded by properly set its [concurrency limits](https://fly.io/docs/reference/concurrency/#main-content-start)
* Check [application metrics](/docs/monitoring/metrics/#managed-grafana) for signs of resource exhaustion (CPU, memory, disk I/O)

#### PC06: Unidentified I/O error

A connection to a machine experienced an unidentifiable I/O error.

#### PC07: Connection retries exhausted

The proxy failed to connect to a machine after too many retries.

#### PC08: TCP timeout couldn't be set

Failed to set the TCP timeout for an upstream connection. This is an internal Fly.io issue.

### TLS errors

TLS errors are related to the automatic TLS termination provided by Fly Proxy. These errors occur before a request is passed on to your application.

#### PT01: Exceeded TLS handshake rate limit

A specific IP range exceeded the rate limit for TLS handshake attempts.

#### PT02: Exceeded rate limit for SNI

TLS handshake requests to a specific SNI exceeded the rate limit.

#### PT03: TLS handshake canceled

A TLS handshake was canceled prematurely.

#### PT04: TLS handshake failed

A TLS handshake failed.

#### PT05: No valid TLS certificate for SNI

No TLS certificate was found for a specific server name, and the connection was aborted.

#### PT06: No valid TLS certificate

No TLS certificate was found for the connection, and the connection was aborted.

#### PT07: TLS handshake I/O error

A TLS handshake failed due to an unspecified I/O error.

#### PT08: TLS handshake timed out

A TLS handshake timed out.

#### PT09: Internal TLS error

An internal TLS error occurred.

### Machine-related errors

This class of errors relates to how the proxy behaves when starting and stopping machines on request.

#### PM01: Machines API error

The Machines API returned an error. If the underlying error is known, it's displayed.

#### PM02: Machine wake internal error

An internal Fly.io error prevented a machine transitioning from a `stopped` to `started` state.

#### PM03: Machine wake timeout

The API request to transition a machine from a `stopped` to `started` state timed out.

#### PM04: Machine wake parsing error

A request parsing error prevented a machine transitioning from a `stopped` to `started` state.

#### PM05: Machine connection failed

The proxy failed to connect to a machine. If the underlying error is known, it's displayed.

#### PM06: Missing app name

The Machines API requires an app name to operate on an individual machine. That app name wasn't specified.

#### PM07: Machine state change failed

The proxy wasn't able to stop or start a machine. If the underlying error is known, it's displayed.

#### PM08: Non-startable machine state

A machine could not be started since due to its current non-startable state, such as `stopping` or `destroyed`. The state is displayed along with this message.


#### PM09: Unknown machine state

The proxy doesn't recognize the machine's current state.

#### PM10: Machine start canceled

A machine start was canceled prematurely due to an internal Fly.io problem.

#### PM11: Machine recently stopped

Machine states are broadcast to the Fly proxies in an eventually consistent manner. So, edge proxies may not have an up-to-date picture about machine states. A machine that appears as `started` to the edge proxy may actually have been recently stopped.

If the edge proxy forwards a request to a recently stopped machine, and there are other machines available to handle the request, the `PM11` error will be returned to the edge proxy. The error informs the proxy about the `stopped` state of the machine, and instructs the edge to forward the request to another machine.

If the edge proxy believes there's only one machine that can service the request, this logic is bypassed. The request is forwarded to the machine even if it was stopped recently.

The current threshold for 'recently stopped' is 5 minutes.

#### PA01: Replay/retry buffer exceeded

To prepare for the possibility of receiving [`fly-replay` response header](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header), or for retrying failed requests, Fly edge proxies buffer requests up to 10MB.

If a request grows larger than 10MB, buffering stops, making it impossible to replay or retry the request. When this happens, `PA01` is emitted.

#### PA02: Excess fly-replay headers

After a ['fly-replay' response header](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header) replays a request, the application may respond normally, or it may issue another `fly-replay`, up to 10 times. `PA02` is emitted when `fly-replay` is returned more than 10 times.

#### PA03: Malformed fly-replay header

Your app returned a malformed ['fly-replay' response header](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header).

#### PA04: Replay target app not found

Your app returned a ['fly-replay' response header](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header) targeting a non-existent application in the `app` parameter.


#### PA05: Unauthorized replay target app

Your app returned a ['fly-replay' response header](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header) targeting an application belonging to a different Fly.io organization. Only apps in the same
organization may replay requests to each other.

### Edge proxy errors

This category of errors refers to internal Fly.io errors happening only on edge proxies.

#### PE01: Replay source app not found

An internal error occurred while using `fly-replay` related to the source app name.

#### PE02: Replay source organization not found

An internal error occurred while using `fly-replay` related to the source organization.

### Routing errors

This category refers to request routing errors between proxies and applications.

#### PR01: No healthy machines

No healthy machines were found to forward a request to. This error is most common in non-HTTP TCP services. The reasons could be:

**Exhausting restart retries due to boot errors**

Your app machines may all be stopped due to boot errors exhausting the number of restart retries. Check your app logs and `fly status`.

**Deployments with volumes are failing**

If your app uses volumes and your rolling deployment is failing, you might encounter this error. Check your app logs and `fly status`.

**Using the `immediate` deploy strategy**

If you use the `immediate` deploy strategy, all current machines will be replaced at once, possibly leading to downtime and some `PR01` errors.

**App concurrency limits reached**

[Concurrency limits](/docs/reference/concurrency/) set in `fly.toml` define how traffic should be balanced across machines in your app.

To diagnose, check if:
* your app is using too much CPU, memory or disk I/O
* your app applies its own concurrency limits
* Connection pools to external services like databases are exhausted
* Connections to external services from your app are slow

#### PR02: Machine not found

The Fly proxy couldn't find a specific machine ID after the request was forwarded from an edge proxy. The VM was likely shut down between when the proxy received the request and when it got forwarded. This error is most common during [`bluegreen` deployments](https://fly.io/docs/reference/configuration/#picking-a-deployment-strategy).

#### PR03: No candidate machines found after retries

This error is functionally similar to `PR01`. It only applies to HTTP services however, and up to 90 retries are attempted before the proxy gives up and issues this error. This error should also display the cause of the most recent error before this one.

#### PR04: No candidate machines found after retries

This error is functionally similar to `PR03`, except it will not display previous errors.

#### PR05: Statics retrieval failed

The proxy failed to retrieve a static file from the specified Tigris storage bucket.

#### PL01: Bypassed connection concurrency limit

[Concurrency limits](https://fly.io/docs/reference/concurrency/#main-content-start) set in `fly.toml` define how traffic should be balanced across machines in your app.

This error occurs when concurrency is measured as the number of concurrent **connections**.

To diagnose, check if:
* your app is using too much CPU, memory or disk I/O
* your app applies its own concurrency limits
* Connection pools to external services like databases are exhausted
* Connections to external services from your app are slow

#### PL02: Bypassed request concurrency limit

This error is similar to `PL01`, but refers to concurrency measured as the number of concurrent **requests**.