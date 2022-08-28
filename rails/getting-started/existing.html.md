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

Before jumping right into a solution to this problem, it is important to
set a bit of background.  From time to time we are all going to make
mistakes, it happens.  And some of these mistakes will escape the tests you run
on your machine and will therefore be found after you type `fly deploy`.  When
those problems are found makes a big difference.  They can be found at the time
your image is being built.  They can prevent your server from starting.  Or
your server can start but doesn't do what it is supposed to.

Clearly the ideal is the first case.  You can check the build messages,
fix the problem, and try again; all without impacting live VMs.

Surprisingly the next best is often times the last case, because at least
then you can generally `ssh` into the machine or otherwise observe the
behavior.

The middle case generally results in an attempt to spin up a VM, see it
crash, after which point the VM is rolled back and a prior successful
deployment, presuming there is one.  For initial deployment problems, well, you
have nothing.

For that reason it may be worth investing a bit of time to see if
your build process can be adapted to make use of
[Build Secrets](../../reference/build-secrets/).

But many of the people that landed on this page have done so because everything
else has failed, and they need something that is done at build time that
absolutely **must** have access to the full deployment context.  The steps
below are for the most common case, namely `assets:precompile`, but
realistically it could happen other places.

To address such a need, First remove the following from `Dockerfile`:

```
RUN bundle exec rails assets:precompile
```

Then modify `fly.toml` to set:

```
SERVER_COMMAND = "bin/rails fly:init"
```

And finally, put the following into `lib/tasks/fly.rake`:

```ruby
namespace :fly do
  task init: "assets:precompile" do
    sh "bundle exec puma"
  end
end
```

What that means is that you won't be able to `ssh` into a VM that fails
to deploy whenver `assets:precompile` fails.  In this particular case,
that hopefully is rare enough to not be a problem, and any time this
happens the error messages you get back are likely sufficient.  The
one remaining issue of VMs being brought up, then down and then up again
is hopefully only a minor nuisance.

Hopefully the takeaway here is that while this potentially a general
solution to build processes that require access to the environment, it
should really only be used sparingly.


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
fly ssh console -C env | grep RAILS_MASTER_KEY
```


