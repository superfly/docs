---
title: Our Stack
layout: docs
sitemap: false
toc: false
nav: devjobs
---

Our platform, the stuff that actually runs apps for our customers, is
built on Rust and Go. Developers on all of our platform teams
switch-hit between those two languages. We love them both, and
that&#39;s an attribute we&#39;re looking for in platform devs.

When a user aims their browser at an app hosted on Fly.io, they&#39;re
talking to `fly-proxy`, a Rust / Tokio / Hyper proxy that powers our
Anycast network.  `fly-proxy` uses `attache`, our Go SQLite Consul
cache, and `corrosion`, our Rust SWIM-based state replication service,
to route requests to the right worker and VM.

Those VMs were booted up by `flyd`, our Go orchestrator. Persistent
encrypted storage for the VMs was provisioned by `vold`, another
orchestration component. `flyd` leverages the Go-based `containerd`
ecosystem to convert Docker containers into root filesystems for our
VMs.

The VMs themselves run under `firecracker`, Amazon&#39;s Rust-based
hypervisor (and the engine behind Lambda and Fargate). Our hardware!
Amazon&#39;s hypervisor code.

Inside the VM, our code gets control again: we own the `init` that
spins things up in the VM. `init` is Rust. More and more of our fun VM
tricks are features of our `init`.

To tell us what containers to boot up, our customers talk to our
GraphQL API. The backend for that API is a Rails app, running on
Postgres.

Most of our developer UX happens in `flyctl`, our Go-based
CLI. We&#39;re a CLI-first company.

Fancy customer UI stuff? Elixir! We love Elixir and sponsor the
Phoenix project. Generally, new UI stuff at Fly.io happens in
Elixir/Phoenix/LiveView. LiveView screams on Fly.io.
