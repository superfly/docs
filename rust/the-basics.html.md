---
title: The Basics
layout: framework_docs_overview
toc: false
order: 2
---


These guides will help you get through the basics of setting up your Rust application with pieces of infrastructure commonly found in the wild. Most Rust frameworks follow the same flow in terms of setup and vary only in their application code. For frameworks that also have a frontend component additional steps will be required.

To develop Rust applications, you will need to setup the rust toolchain. We recommend using [rustup](https://rustup.rs/+external) to install these tools. 

## Install flyctl and log in

In order to start working with Fly.io, you will need `flyctl`, our CLI app for managing apps. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/flyctl/install/). Once that's installed you'll want to [log in to Fly](/docs/getting-started/sign-up-sign-in/).

For most popular frameworks you can deploy your app with just one command: 

```cmd
fly launch
```

