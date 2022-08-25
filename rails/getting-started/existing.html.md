---
title: Existing Rails Apps
layout: framework_docs
objective: Learn how to run your existing Rails applications on Fly.
status: alpha
order: 2
---

If you've got an existing Rails app, and you want to set it up for Fly, the process is pretty similar;
`fly launch` will take you through the setup steps, but there's a couple of things to look at first.

If your Rails application wasn't created with the `--database=postgresql` option
and you didn't subsequently add the Postgres gem to your bundle, do so now
via:

```cmd
bundle add pg --group production
```

Your database settings will be passed to your app via a `DATABASE_URL` environment
variable (which Rails picks up automatically). That means you can drop a lot of the production configuration from `config/database.yml`.

If you've got your app's secrets stored in an encrypted credentials file such as `config/credentials.yml.enc`
or `config/credentials/production.yml.enc`, you'll need to provide the master key to your app via
`fly secrets set`. For example, if your master key is stored in `config/master.key`, you can run:

```cmd
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
```
