---
title: Environment Configuration
layout: framework_docs
order: 4
---

Rails applications usually configured via the encrypted `credentials.yml` file or via environmental variables.

## Environmental variables

Enviornment variables are a great way to configure a Rails application that needs to run in multiple environments.

### Secret variables

Environment variables that have sensitive data in them, like a `DATABASE_URL` that contains a password, can be kept in a secret that can't be viewed except when the container is running.

To set a secret in Fly, run:

```cmd
fly secret set SUPER_SECRET_KEY=password1234
```

### Non-sensitive variables

Variables that don't have sensitive data can be set in the `fly.toml` file under the `[env]` directive. An example file might look like:

```toml
[env]
  RAILS_LOG_TO_STDOUT = x
```

### View the variables

To view the environment variables of your Fly Rails app, run:

```cmd
fly ssh console -C "printenv"
```

There you'll see all of the enviornment variables in your application that are set by `fly secrets`, the `[env]` directive in the `fly.toml` file, and the `environment` directive from your Dockerfile.

## `credentials.yml` file

Another approach to managing credentials in Rails is to use the encrypted `credentials.yml` and encrypted `credentials.yml.enc`, which you can learn more about by running the following from the root of your Rails application:

```cmd
bin/rails credentials:help
```

When deployed to production, the `RAILS_MASTER_KEY` that will decrypt the secrets can be set by running:

```cmd
fly secret set RAILS_MASTER_KEY=only-a-fool-would-use-1234-for-their-rails-master-key
```
