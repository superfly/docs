---
title: Environment Configuration
layout: framework_docs
objective: Add environment variables to your Rails applications, configure secrets, and use the encrypted `credentials.yml` file to manage your application's configuration on Fly.
order: 4
---

Rails applications are usually configured via the encrypted `credentials.yml` file or via environmental variables.

## Environmental variables

Environment variables are a great way to configure a Rails application that needs to run in multiple environments.

### Secret variables

Environment variables that have sensitive data in them, like a `DATABASE_URL` that contains a password, can be kept in a secret that can't be viewed except when the container is running.

To set a secret in Fly, run:

```cmd
fly secrets set SUPER_SECRET_KEY=password1234
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

There you'll see all of the environment variables in your application that have been set by `fly secrets`, the `[env]` directive in the `fly.toml` file, and the `environment` directive from your Dockerfile.

## Encrypted credentials file

Another approach to managing credentials in Rails is to use an encrypted credentials file, such as `config/credentials.yml.enc` or `config/credentials/production.yml.enc`, which you can learn more about by running the following from the root of your Rails application:

```cmd
bin/rails credentials:help
```

When deploying to production, the `RAILS_MASTER_KEY` that will decrypt the credentials file can be set via `fly secrets set`. For example, if your master key is stored in `config/master.key`, you can run:

```cmd
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
```

For Windows/Powershell:

```powershell
$Env:RAILS_MASTER_KEY = Get-Content 'config\master.key'
```
