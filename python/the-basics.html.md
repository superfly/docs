---
title: The Basics
layout: framework_docs_overview
toc: false
order: 2
---


These guides will help you get through the basics of setting up your Python application with pieces of infrastructure commonly found in the wild. Most Python frameworks follow the same flow in terms of setup and vary only in their application code. For frameworks that also have a frontend component additional steps will be required.

To develop Python applications, you will need to install python. We also recommend installing poetry to manage your dependencies. 

## Install flyctl and log in

In order to start working with Fly.io, you will need `flyctl`, our CLI app for managing apps. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/hands-on/install-flyctl/). Once that's installed you'll want to [log in to Fly](/docs/getting-started/log-in-to-fly/).

For most popular frameworks you can deploy your app with just one command: 

```cmd
fly launch
```

