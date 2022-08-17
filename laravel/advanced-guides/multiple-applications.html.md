---
title: Multiple Fly Applications
layout: framework_docs
objective: At some point a Laravel application will need to run additional services, perhaps Redis for a cache or session storage. Learn how to manage multiple applications from one Laravel project to keep your monolith a monolith.
---

This guide discusses how to manage multiple Fly applications within a Laravel projects. This is useful for Laravel projects that need to run other services, like running a Redis service for queues, cache, and session storage.

## What is a Fly application?

Your Laravel application is a Fly application, which means it has the following few things:

* A `fly.toml` file in the root directory
* A `Dockerfile` in the root directory that describes the image
* A "server" running on Fly's infrastructure.

So how do you spin up multiple Fly applications for a single Laravel project?

## Creating a Fly application within a Fly application

The important thing about creating multiple Fly applications within a project is keeping them organized. For our example, we'll setup a Laravel server application and keep it in the `./fly/applications` folder within our project repo.

Let's get started by running the following commands:

```cmd
# Further reference: https://fly.io/laravel-bytes/full-stack-laravel/
mkdir -p fly/applications/redis
cd fly/applications/redis
```

From inside the `fly/applications/redis` folder, run:

```cmd
fly launch --image flyio/redis:6.2.6 --no-deploy --name my-project-name-redis
```

This command will create a `Dockerfile` and `fly.toml` file that can be further configured for your application's needs.

Next, we cab do some light configuration and then deploy the application:

```cmd
# Add a required redis password
# (note this means using this password when connecting to Redis from your apps)
fly secrets set REDIS_PASSWORD=mypassword

# Add a volume so deploys of this redis app dont lose data
flyctl volumes create redis_server

# Configure the volume mount in fly.toml
cat <<EOT >> fly.toml
[mounts]
  source      = "redis_server"
  destination = "/data"
EOT

# Deploy it!
fly deploy
```

## Accessing from the root application

Fly creates DNS hosts for each of your applications based on the application name. For this example, we can reach the Redis instance via hostname `my-project-name.internal`.

## Deploying updates

In the future, when it's time to deploy updates to your Fly application within a Fly application, run:

```cmd
cd fly/application/redis
fly deploy
```

That's it.
