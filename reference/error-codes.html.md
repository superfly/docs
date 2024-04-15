---
title: Fly.io Error Codes
layout: docs
sitemap: false
nav: firecracker
---

The Fly.io platform logs internal errors from our proxy, VM orchestrator, etc. Each log line contains an error code and a field containing that code. This page gives more context about the errors.

## Proxy errors

THe Fly proxy issues different categories of errors, identifiable by the second letter in each code: Upstream, Connection, TLS, Machine, App, Edge and Routing.

### Internal Errors

These errors are internal to the Fly proxy. They're not related to your application behavior.

#### PP01: Failed to set TCP socket options

The proxy wasn't able to set TCP socket options. This an internal Fly.io error.

### Upstream Proxy errors

Upstream errors occur when the proxy fails to send or complete a request to your one of your upstream application machines.

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

Is your app listening on `0.0.0.0` or `::`? Make sure it's not listening `127.0.0.1`. Check your app startup logs. Servers often print the address they're listening on.

#### PC02: Connection refused

A request was sent to an unspecified port that isn't open on the target machine.

Is your app listening on `0.0.0.0` or `::`? Make sure it's not listening `127.0.0.1`. Check your app startup logs. Servers often print the address they're listening on.

#### PC03: Connection reset

This indicates a problem with your application resetting a TCP connection prematurely. Check your application logs for possible causes.

#### PC04: Connection aborted

This indicates a problem with your application aborting a TCP connection prematurely. Check your application logs for possible causes.

#### PC05: Connection timed out

This indicates a problem with connections timing out to your application. Check the following to diagnose:

* Application logs may indicate the cause of a timeout
* Ensure your app isn't overloaded by properly set its [concurrency limits](https://fly.io/docs/reference/concurrency/#main-content-start)
* Check [application metrics](https://fly.io/docs/metrics-and-logs/metrics/#managed-grafana) for signs of resource exhaustion (CPU, memory, disk I/O)

#### PC06: Unidentified I/O error

A connection to a machine experienced an unidentifiable I/O error.

#### PC07: Connection retries exhausted

The proxy failed to connect to a machine after too many retries.

#### PC08: TCP timeout couldn't be set

Failed to set the TCP timeout for an upstream connection. This is an internal Fly.io issue.

### TLS errors

TLS errors are related to the automatic TLS termination provided by Fly Proxy. These errors occur before a request is passed on to your application.

#### PT01: Exceeded rate limit for IP range

A given IP range made too many TLS handshake attempts and was rate limited.

#### PT02: could not proxy TCP data

The proxy failed to proxy TCP data to or from a machine.


    PT03, // tls handshake was canceled
    PT04, // tls handshake failed
    PT05, // no valid tls certificate was found for SNI {sn}. aborted connection
    PT06, // no valid tls certificate was found. aborted connection
    PT07, // encountered an io error while performing tls handshake
    PT08, // tls handshake timed out
    PT09, // internal tls error
    PM01, // machines API returned an error
    PM02, // could not wake up machine due to an internal communication error
    PM03, // could not wake up machine due to a timeout requesting from the machines API
    PM04, // could not wake up machine due to an internal parsing error
    PM05, // failed to connect to machine
    PM06, // failed to connect even if machine has been started for a while
    PM07, // missing app name for machine, cannot make machines API HTTP request
    PM08, // failed to change machine state
    PM09, // machine is in a non-startable state
    PM10, // machine is in a state unknown to the proxy
    PM11, // machine start was canceled due to an internal problem
    PM12, // could not find machine state, this is an internal problem
    PM13, // machine was recently stopped and is unavailable to service request
    PA01, // cannot retry/replay request because request body has been read past what we're willing to buffer
    PA02, // 'fly-replay' response header was returned too many times, stopping there
    PA03, // could not parse 'fly-replay' response header returned by app
    PA04, // app '{source_app}' used 'fly-replay' response header to target app '{target_app}', which we cannot find
    PA05, // app '{source_app}' used 'fly-replay' response header to target app '{target_app}', but it doesn't have permission to do so
    PE01, // internal error while fly-replaying: could not find app name
    PE02, // internal error while fly-replaying: could not find org id assigned to your app
    PR01, // no known healthy instances found for route
    PR02, // fly proxy could not find local instance for route
    PR03, // could not find a good candidate within {} attempts at load balancing
    PR04, // could not find a good candidate within {} attempts at load balancing
    PR05, // failed to request static files for {} from Tigris bucket
