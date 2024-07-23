---
title: Deployments
layout: framework_docs
objective: Understand what it means to deploy a Rails application to Fly along with some common tasks you may want to run after deployments, like a database migration or script.
order: 2
---

Deploying applications to Fly can be as simple as running:

```cmd
fly deploy
```

When the application successfully deploys, you can quickly open it in the browser by running:

```cmd
fly apps open
```

If all goes well, you should see a running application in your web browser. You can also view a history of deployments by running:

```cmd
fly releases
```
```output
VERSION STABLE  TYPE  STATUS    DESCRIPTION                             USER                  DATE
v55     true    scale succeeded Scale VM count: ["web, 6"]              brad@fly.io           2022-08-10T17:05:57Z
v54     true    scale dead      Scale VM count: ["web, 0"]              brad@fly.io           2022-08-10T16:43:13Z
v53     true    scale succeeded Scale VM count: ["web, 6"]              brad@fly.io           2022-08-10T16:42:51Z
v52     true    scale succeeded Scale VM count: ["web, 6"]              brad@fly.io           2022-08-10T16:40:57Z
v51     true    scale succeeded Scale VM count: ["web, 3"]              kurt@fly.io           2022-08-08T20:14:08Z
v50     true    scale succeeded Scale VM count: ["web, 3"]              kurt@fly.io           2022-08-08T19:55:23Z
```

## Troubleshooting a deployment

If a deployment fails, you'll see an error message in the console. If the error is a Rails stack trace, it will be truncated. To view the entire error message run:

```cmd
fly logs
```

You may need to open another terminal window and deploy again while running `fly logs` to see the full error message.

## Running migrations

For Postgresql, migrations are configured to automatically run after each
deployment via the following task in your application's `fly.toml`:

```toml
[deploy]
  release_command = './bin/rails db:prepare'
```

Sqlite3 migrations are done by the `bin/docker-entrypoint` script.

To disable automatic migrations for deploys, remove `db:prepare` lines from these files. Then, to manually run migrations after a deployment, run:

```cmd
fly ssh console -C "/rails/bin/rails db:migrate"
```

## Run ad-hoc tasks after deploying

Sometimes after a deployment you'll need to run a script or migration in production. That can be accomplished with the Fly SSH console by running:

```cmd
fly ssh console
```
```output
Connecting to top1.nearest.of.my-rails-app.internal... complete
```
```cmd
ls
```
```output
Dockerfile      README.md       config          lib             test
Gemfile         Rakefile        config.ru       log             tmp
Gemfile.lock    app             db              public          vendor
Procfile.dev    bin             fly.toml        storage
```
```cmd
bundle exec ruby my-hello-world-script.rb
```
```output
hello world
```
