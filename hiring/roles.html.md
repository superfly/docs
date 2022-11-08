---
title: Our Engineering Roles
layout: docs
sitemap: false
toc: false
nav: devjobs
---

Currently, our engineering roles include:

- Backend development, in Rails (and some Go, and some Elixir). Backend makes our API work, and defines much of the developer experience of the product. Rails and Postgres are the big things here.
- UX development, in Elixir (and some Rails). UX is user interface, and, importantly, new customer experience and growth development. If it has a web interface, this is the role where it happens.
- Security engineering, in Rust, Go, Ruby, and whatever else makes sense. A modern startup security practice includes corpsec (protecting our staff and their machines), appsec (hunting and killing security vulnerabilities in our code), and infrasec (hardening the operating systems we run that code on). Currently, security engineers in our practice do all three of those roles.
- Infrastructure engineering, in Go, Ruby, Rust, and whatever else makes sense. Infra keeps the spice flowing. Infra opens up new regions, grows regions to meet capacity, and outguesses our tricksy software and operating systems with monitoring tools tools that predict and head off outages.
- Platform development, in Rust and Go. Platform runs the apps, and connects them to the Internet. It&#39;s the &quot;engine&quot; of Fly.io.

Platform development is a big category. We can further divide it — bear in mind that people switch teams within platform, so these can be fluid:

- Proxy: this is overwhelmingly Rust-based work on `fly-proxy`, building features that connect customer apps to the Internet.
- Machines: this is mostly Go-based work on `flyd` and other orchestration components (think: building a better, simpler K8s, at global scale). Exception: `init` is part of this work, and it&#39;s Rust.
- Private Networks: this is Go, Rust, and BPF work extending and streamlining our WireGuard-backend private networks.
