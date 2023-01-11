---
title: Troubleshooting
layout: framework_docs
order: 10
redirect_from: docs/elixir/getting-started/troubleshooting/
blog_path: /phoenix-files
objective: Common troubleshooting issues and resources for getting unstuck.
---

Some problems are harder to diagnose because they deal with [Elixir releases](https://hexdocs.pm/mix/master/Mix.Tasks.Release.html) or Docker build problems. Typically, you don't run the application that way locally, so you only encounter those problems when it's time to deploy.

Here are a few tips to help diagnose and identify problems.

- Run `mix release` locally on your project.
- Build the Dockerfile locally to verify it builds correctly. `docker build .`
- Check the `:prod` config in `config/runtime.exs`, which is not used locally. Carefully review it.
- Run `fly logs` to check server logs.

For diagnosing database app issues, refer to the [Postgres Monitoring](/docs/reference/postgres/#monitoring) information.

Here's a quick hit list of commands to help:

- Run `fly logs -a <pg-db-name>` to check database app's server logs.
- Run `fly checks list -a <pg-db-name>` to check the database app's health.
- Run `fly status -a <pg-db-name> --all` to see if any VMs failed.
- Run `fly vm status <id> -a <pg-db-name>` to debug a specific VM.

## _Diagnosis Tip_

Most difficulties center around application config. Applications generated with an older version of Phoenix are configured differently than a newly generated app. If you have problems like connecting to your database, usually an IPv6 configuration update is needed.

The internal networks at Fly.io use a IPv6 addresses. Elixir/OTP needs some config to work smoothly.

One way to identify an issue is to generate a new Elixir application using a current version of Phoenix. Deploy that to Fly.io with a database. With that, you have a local working example to compare against. Don't worry, you can easily [`destroy`](/docs/flyctl/destroy/) the test app when you're ready to.

Suggested files to pay attention to when looking for config differences.

- `config/config.exs`
- `config/prod.exs`
- `config/runtime.exs`
- `Dockerfile`
- `mix.exs`


## Not Enough Connections

A common failure mode is the application exhuasting the number of free connections, your default `fly.toml` has the following settings:
```toml
  [services.concurrency]
    hard_limit = 50
    soft_limit = 25
    type = "connections"
```

Setting the `hard_limit` and `soft_limit` closer to your needs will free up the number of live connections per node. 
