---
title: Existing Rails Apps
layout: framework_docs
objective: Learn how to run your existing Rails applications on Fly.
status: beta
order: 2
---

If you have an existing Rails app that you want to move over to Fly, this guide walks you through the initial deployment process and shows you techniques you can use to troubleshoot issues you may encounter in a new environment.

### Provision Rails and Postgres Servers

To configure and launch your Rails app, you can use `fly launch` and follow the wizard.

```cmd
fly launch
```
```output
Creating app in ~/list
Scanning source code
Detected a Rails app
? App Name (leave blank to use an auto-generated name): list
? Select organization: John Smith (personal)
? Select region: iad (Ashburn, Virginia (US))
Created app list in organization personal
Set secrets on list: RAILS_MASTER_KEY
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? Yes
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clusters
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster list-db in organization personal
Postgres cluster list-db created
  Username:    postgres
  Password:    <redacted>
  Hostname:    list-db.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place -- you won't be able to see them again!

Monitoring Deployment

1 desired, 1 placed, 1 healthy, 0 unhealthy [health checks: 3 total, 3 passing]
--> v0 deployed successfully

. . .

Now: run 'fly deploy' to deploy your Rails app.
```

You can set a name for the app, choose a default region, and choose to launch and attach a PostgreSQL database.

### Deploy your application

Deploying your application is done with the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully. Once complete
visit your app with the following command:

```cmd
fly open
```

If all went well, you'll see your Rails application homepage.

## Troubleshooting your initial deployment

Since this is an existing Rails app, its highly likely it might not boot because you probably need to configure secrets or other service dependencies. Let's walk through how to troubleshoot these issues so you can get your app running.

### View log files

If your application didn't boot on the first deploy, run `fly logs` to see what's going on.

```cmd
fly logs
```

This shows the past few log file entries and tails your production log files.

### Open a Rails console

It can be helpful to open a Rails console to run commands and diagnose production issues.

```cmd
fly ssh console -C "/app/bin/rails console"
```
```output
irb>
```

## Common initial deployment issues

Now that you know the basics of troubleshooting production deployments, lets have a look at some common issues people have when migrating their existing Rails applications to Fly.

### Access to Environment Variables at Build Time

The most common reason Rails developers find that they need to access secrets
during build time is that `assets:precompile` loads your application's
environment, and this may fail without access to secrets.  If this applies
to you, generally the fix is to move this step from being done at build
time to being a prerequisite for deployment.

This can be accomplished by modifying `lib/tasks/fly.rake`, and in there
moving `assets:precompile` from being a prerequisite of the `:build`
task to being a prerequisite of the  `:server` task.

Other situations can be handled similarly.  But should the need for
secrets to be available at build time be unavoidable, take a look
at [Build Secrets](../../reference/build-secrets/).

### Language Runtime Versions

Having different runtime versions of language runtimes on your development
machine and on production VMs can lead to problems.  Run the following
commands to see what versions you are using in development:

```shell
$ bundle -v
$ node -v
$ ruby -v
```

Compare and update these versions with what you see in your `fly.toml` file:

```toml
[build]  
  [build.args]
    BUNDLER_VERSION = "2.3.18"
    NODE_VERSION = "14" 
    RUBY_VERSION = "3.1.2"
```

### Postgres database drivers

If your Rails application wasn't created with the `--database=postgresql` option
and you didn't subsequently add the Postgres gem to your bundle, do so now
via:

```cmd
bundle add pg --group production
```

Your database settings will be passed to your app via a `DATABASE_URL` environment
variable (which Rails picks up automatically). That means you can drop a lot of the production configuration from `config/database.yml`.

### Rails encrypted credentials

If you've got your app's secrets stored in an encrypted credentials file such as `config/credentials.yml.enc`
or `config/credentials/production.yml.enc`, you'll need to provide the master key to your app via
`fly secrets set`. For example, if your master key is stored in `config/master.key`, you can run:

```cmd
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
```

You can verify that your credentials are encoded using your current `config/master.key` using:

```cmd
bin/rails credentials:show
```

You can see what `RAILS_MASTER_KEY` is deployed using:

```cmd
fly ssh console -C 'printenv RAILS_MASTER_KEY'
```


