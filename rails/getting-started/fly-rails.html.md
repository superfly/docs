---
title: Experimental Fly Rails Gem
layout: framework_docs
status: alpha
order: 5
---

This guide runs you through how to use the `fly-rails` gem to deploy your Rails applications to Fly.io using Rails commands.

Please note that the `fly-rails` gem is designed to work well with common Rails production configurations, like a Turbo app that uses Sidekiq, AnyCable, Redis, & Postgres. For less common configurations, we recommend using `flyctl` and its respective configuration files to manage your deployment.

## Install the `flyctl` command line interface

First you'll need to [install the Fly CLI, and signup for a Fly.io account](/docs/hands-on/install-flyctl/). The gem used in the next step will use this CLI to deploy your application to Fly.io and it's something that's worth learning more about as you become more comfortable with Fly.io.

## Install the gem

Add the `fly-rails` gem from the root of your Rails project.

```cmd
bundle add fly-rails
```

This installs and bundles the `fly-rails` gem in your Rails project, which adds commands to Rails that make deploying apps to Fly.io require less steps.

## Launch your app

The first deployment will both provision and deploy the application to Fly.io. Run the following command:

```cmd
bin/rails fly:launch
```

If the deployment is successful, you can view your app by running:

```cmd
fly open
```

You should see your application!

## Deployments

Changes to your application can be deployed with one command.

```cmd
bin/rails fly:deploy
```

This will deploy the latest changes to your application and run any database migrations, if present.

## Ejecting

There may be a point where you need to "eject" from the `fly-rails` gem for deployments that require more advanced configuration. Ejecting creates a `fly.toml` and `Dockerfile` at the root of your project that works with `flyctl` and gives you full and exact control over your application configuration.

```cmd
bin/rails generate fly:app --eject
```
