---
title: Creating an App on Fly
layout: docs
sitemap: false
nav: hands_on
toc: false
---

Fly allows you to deploy any kind of app as long as it is packaged in a **Docker image**. That also means you can just deploy a docker image and as it happens we have one ready to go in `flyio/hellofly:latest`. 

Each Fly application needs a `fly.toml` file to tell the system how we'd like to deploy it. That file can be automatically generated with the `flyctl launch` command. 

```cmd
flyctl launch --image flyio/hellofly:latest
```
```output
? App Name (leave blank to use an auto-generated name):
```
**App Names**: Every Fly.io app must be given a name unique to your organization. By default, this name is also used as the application's hostname.

**Organizations**: Organizations are a way of sharing applications and resources between Fly users. Every fly account has a personal organization, called `personal`, which is only visible to your account.

Proceeding here will select your personal organization for the tutorial deployment, unless you have previously made other configurations.

```output
? Select region:
```
**Regions**: Regions are cities around the world with Fly servers you can deploy apps to. For this tutorial, you can choose to deploy anywhere you'd like.

```output
? Would you like to set up a Postgresql database now?
```
Part of the magic of Fly is turn-key support for a database service. We provide Postgres as a regular Fly.io app, which can be automatically created during deployment of other applications.

```output
? Would you like to deploy now?
```
If you're satisfied with your configuration settings and prepared to see Fly in action, say yes here. At this point, `flyctl` creates an app for you and writes your configuration to a `fly.toml` file. The `fly.toml` file now contains a default configuration for deploying your app.

```toml

app = "hellofly"

[build]
  image = "flyio/hellofly:latest"

[[services]]
  internal_port = 8080

...
```

The `flyctl` command will always refer to this file in the current directory if it exists, specifically for the `app` name value at the start. That name will be used to identify the application on the Fly platform. You can also see how the app will be built and that internal port setting. The rest of the file contains settings to be applied to the application when it deploys.

We'll have more details about these properties as we progress, but for now, it's enough to say that they mostly configure which ports the application will be visible on.

[Next: Deploying Your App](/docs/hands-on/deploy-app/)
