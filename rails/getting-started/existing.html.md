---
title: Existing Rails Apps
layout: framework_docs
objective: Learn how to run your existing Rails applications on Fly.
order: 3
---

If you have an existing Rails app that you want to move over to Fly, this guide walks you through the initial deployment process and shows you techniques you can use to troubleshoot issues you may encounter in a new environment.

## Provision Rails and Postgres Servers

To configure and launch your Rails app, you can use `fly launch` and follow the wizard.

```cmd
fly launch
```
```output
Creating app in ~/list
Scanning source code
Detected a Rails app
? Choose an app name (leave blank to generate one): list
? Select Organization: John Smith (personal)
? Choose a region for deployment: Ashburn, Virginia (US) (iad)
Created app list in organization personal
Admin URL: https://fly.io/apps/list
Hostname: list.fly.dev
Set secrets on list: RAILS_MASTER_KEY
? Would you like to set up a Postgresql database now? Yes
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clu
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster in organization personal

. . .

Postgres cluster list-db is now attached to namelist
? Would you like to set up an Upstash Redis database now? Yes
? Select an Upstash Redis plan Free: 100 MB Max Data Size

Your Upstash Redis database namelist-redis is ready.

. . .

      create  Dockerfile
      create  .dockerignore
      create  bin/docker-entrypoint
      create  config/dockerfile.yml
Wrote config file fly.toml

Your Rails app is prepared for deployment.

Before proceeding, please review the posted Rails FAQ:
https://fly.io/docs/rails/getting-started/dockerfiles/.

Once ready: run 'fly deploy' to deploy your Rails app.
```

You can set a name for the app, choose a default region, and choose to launch
and attach either or both a PostgreSQL and Redis databases.  Be sure to include
Redis is if you make use of Action Cable, caching, and popular third-party gems
like Sidekiq.

## Deploy your application

Deploying your application is done with the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully. Once complete
visit your app with the following command:

```cmd
fly apps open
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

Rails stack tracebacks can be lengthy, and the information you often want
to see is at the top.  If not enough information is available in the
`fly logs` command, try running `fly dashboard`, and select `Monitoring`
in the left-hand column.

### Open a Rails console

It can be helpful to open a Rails console to run commands and diagnose production issues.  If you are not running with a sqlite3 or a volume, the recommended way to do this is to run a [console](/docs/reference/configuration/#console-command) in an ephemeral Machine:

```cmd
fly console
```

If you are running with sqlite3 or a volume, you will need to ssh into an existing machine.  You may need to first make sure that you have enough
[memory](../dockerfiles/#out-of-memory) to accommodate the additional session.

```cmd
fly ssh console --pty -C "/rails/bin/rails console"
```
```output
Loading production environment (Rails 7.0.4.2)
irb(main):001:0> 
```

## Common initial deployment issues

Now that you know the basics of troubleshooting production deployments, lets have a look at some common issues people have when migrating their existing Rails applications to Fly.

### Access to Environment Variables at Build Time

Some third-party gems and services require configuration including the
setting of secrets/environment variables.  The `assets:precompile` step
will load your configuration and may fail if those secrets aren't set
even if they aren't actually used by the `assets:precompile` step.

Rails itself has such a variable, and you will see some combination of
`SECRET_KEY_BASE` and `DUMMY` in most Dockerfiles.

In many cases, you can avoid the problem by adding an `if` statement.  For example, if your code looks like:

```ruby
Stripe.api_key = Rails.application.credentials.stripe[:secret_key]
```

Changing the configuration file to the following will avoid the build time
error:

```ruby
if Rails.application.credentials.stripe
  Stripe.api_key = Rails.application.credentials.stripe[:secret_key]
end
```

If that is not sufficient and you need more such dummy values, add
them directly to the `Dockerfile`.  Just be sure that any such values you add
to your Dockerfile don't contain actual secrets as your Dockerfile will
generally be committed to git or otherwise may be visible.

If you have need for actual secrets at build time, take a look
at [Build Secrets](/docs/apps/build-secrets/).

Finally, if there are no other options you can generate a Dockerfile that will
run `assets:precompile` at deployment time with the following command:

```
bin/rails generate dockerfile --precompile=defer
```

This will result in larger images that are slower to deploy:

  * The precompile step will be run for each server you deploy rather
    that once during build time to produce an image that can be deployed
    multiple times.
  * Normally Dockerfiles are structured so that packages that are only needed
    at build time (e.g. Node.js) are not present on the deployed machine.  
    If you defer the `assets:precompile` step, these packages will need
    to be present in order to deploy.

If you are evaluating Fly.io for the first time there may be some value
in setting precompile to defer initially for evaluation and then work over
time to eliminate the issues that prevent you from running this step at
build time.  Once those issues are resolved, regenerate your Dockerfile
using the following command:

```
bin/rails generate dockerfile --precompile=build
```

### Language Runtime Versions

Having different runtime versions of language runtimes on your development
machine and on production VMs can lead to problems.  Run the following
commands to see what versions you are using in development:

```shell
$ bundle -v
$ node -v
$ ruby -v
$ yarn -v
```

There also are files used by version managers to keep your development
environment in sync: `.ruby-version`, and `.node-version`.

Finally, `package.json` files may have version numbers in `engines.node`
and `packageManager` values.

Whenever you update your tools, run the following command to update your
Dockerfile:

```shell
$ bin/rails generate dockerfile
```

You can see the versions of each tool that will be used on your deployment
machine by looking for lines that start with `ARG` in your Dockerfile.

### ActiveStorage

From the [documentation](https://guides.rubyonrails.org/active_storage_overview.html#what-is-active-storage-questionmark):

> Active Storage facilitates uploading files to a cloud storage service like Amazon S3, Google Cloud Storage, or Microsoft Azure Storage and attaching those files to Active Record objects. It comes with a local disk-based service for development and testing and supports mirroring files to subordinate services for backups and migrations.

Accordingly:

* Don't use [Disk service](https://community.fly.io/t/active-storage-images-are-not-persisting-in-disk-part-2/13095/3) unless you put the data on a [Volume](https://fly.io/docs/volumes/) and are prepared to sync the data between machines
* If you want to have your active storage data hosted on fly.io, consider using the [postgres adapter](https://github.com/lsylvester/active_storage-postgresql) or [MinIO](https://fly.io/docs/app-guides/minio/).
* Of course, you are welcome to use [Amazon S3](https://edgeguides.rubyonrails.org/active_storage_overview.html#s3-service-amazon-s3-and-s3-compatible-apis), [Microsoft Azure](https://edgeguides.rubyonrails.org/active_storage_overview.html#microsoft-azure-storage-service), or [Google Cloud Services](https://edgeguides.rubyonrails.org/active_storage_overview.html#google-cloud-storage-service).

[Litefs](https://fly.io/docs/litefs/) is currently in beta, and if there were a sqlite3 active storage adapter it could be used for this purpose.  If this is of interest, bring up the topic on [community.fly.io](https://community.fly.io/).

### Postgres database drivers

If you didn't initially deploy with a postgres database but want to add one
later, you can create a database using [`fly postgres
create`](https://fly.io/docs/postgres/getting-started/create-pg-cluster/).
Next, update your dockerfile to include the postgres libraries using:

```shell
$ bin/rails generate dockerfile --postgresql
```

Finally, attach the database to your application using
<code>[fly postgres attach](https://fly.io/docs/postgres/managing/attach-detach/)</code>.

Multiple Rails applications can use the same PostgresQL server.  Just take
care to make sure that each Rails application uses a different database name.

### ActiveSupport::MessageEncryptor::InvalidMessage

Generally, this means that there is a problem with your `RAILS_MASTER_KEY`. It is a common initial setup problem, but once it works it tends to keep working.

`fly launch` will extract your master key if your project has one and make it
available to your deployed application as a
[secret](/docs/apps/secrets/).

If you've already run `fly launch` on a project that doesn't have a master key
(commonly because files containing these values are excluded from being pushed by being listed in your `.gitignore` file), you will need to generate a key
and set the secret yourself.  The [Ruby on Rails Guides](https://guides.rubyonrails.org/security.html#custom-credentials) contains information on generating new credentials.

If you've got your app's secrets stored in an encrypted credentials file such as `config/credentials.yml.enc`
or `config/credentials/production.yml.enc`, you'll need to provide the master key to your app via
`fly secrets set`. For example, if your master key is stored in `config/master.key`, you can run:

```cmd
fly secrets set RAILS_MASTER_KEY=$(cat config/master.key)
```

Windows users can run the following command in PowerShell:

```
fly secrets set RAILS_MASTER_KEY=$(Get-Content config\master.key)
```

You can verify that your credentials are encoded using your current master key using:

```cmd
bin/rails credentials:show
```

You can see what `RAILS_MASTER_KEY` is deployed using:

```cmd
fly ssh console -C 'printenv RAILS_MASTER_KEY'
```
