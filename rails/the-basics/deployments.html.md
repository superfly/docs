---
title: Deployments
layout: framework_docs
objective: Understand what it means to deploy a Rails application to Fly along with some common tasks you may want to run after deployments, like a database migration or script.
order: 0
---

Deploying applications to Fly can be as simple as running:

```cmd
fly deploy
```

When the application successfully deploys, you can quickly open it in the browser by running:

```cmd
fly open
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

Migrations are configured to automatically run after each deployment via the following entry in your application's `fly.toml` file:

```toml
[deploy]
  release_command = "bundle exec rails db:migrate"
```

To disable automatic migrations for deploys, delete the `release_command` line in the `fly.toml` file. Then, to manually run migrations after a deployment, run:

```cmd
fly ssh console -C "app/bin/rails db:migrate"
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
cd app
ls
```
```output
Aptfile       CHANGELOG.md  Dockerfile    LICENSE     README.md  app   config.ru  fly     package.json       pull_request_template.md  test    yarn.lock
Brewfile      CODE_OF_CONDUCT.md  Gemfile       Procfile      Rakefile   bin   db     lib     postcss.config.js  resources           tmp
Brewfile.lock.json  CONTRIBUTING.md Gemfile.lock  Procfile.dev  SECURITY.md  config  docs     node_modules  public       tailwind.config.js        vendor
```
```cmd
bundle exec ruby my-hello-world-script.rb
```
```output
hello world
```

## Asset compilation and build commands

The default Rails image is configured to run `bundle exec rails assets:precompile` in the [`Dockerfile`](https://github.com//superfly/flyctl/blob/709c542ce5cd2d3326ec1cbe347deeb8dd57cf9f/scanner/templates/rails/standard/Dockerfile#L84).

```Dockerfile
RUN bundle exec rails assets:precompile
```

If you have additional build steps beyond the Rails asset precompiler, you may need to modify your application's Dockerfile to build assets.