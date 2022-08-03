---
title: Multiple Fly Applications
layout: rails_docs
---

This guide discusses how to manage multiple Fly applications within a Rails projects. This is useful Rails projects that need to run other services, like running a pool of Puppeteer servers that your Rails app calls to take screenshots of web pages.

## What is a Fly application?

Your Rails application is a Fly application, which means it has the following few things:

* A `fly.toml` file in the root directory
* A `Dockerfile` in the root directory that describes the image
* A "server" running on Fly's infrastructure.

So how do you spin up multiple Fly applications for a single Rails project?

## Creating a Fly application within a Fly application

The important thing about creating multiple Fly applications within a project is keeping them organized. For our example, we'll setup a Redis server application and keep it in the `./fly/applications` folder within our project repo.

Let's get started by running the following commands:

```cmd
mkdir -p fly/applications/redis
cd fly/applications/redis
```

From inside the `fly/applications/redis` folder, run:

```cmd
fly launch --image flyio/redis:6.2.6 --no-deploy --name my-project-name-redis
```

This command will create a `Dockerfile` and `fly.toml` file that can be further configured for your applications needs.

Next deploy the application:

```cmd
fly deploy
```

## Accessing from the root application

Fly creates DNS hosts for each or your applications that are not surprising.

## Deploying updates

In the future when its time to deploy updates to your Fly application within a Fly application, run:

```cmd
cd fly/application/redis
fly deploy
```

That's it.