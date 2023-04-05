---
title: Dockerfiles and fly.toml
layout: framework_docs
order: 4
---

Once you have completed running `fly launch` you have some new files,
most notably a `Dockerfile` and a `fly.toml` file.  For many applications
you are ready to deploy.  But before you do, scan the following list
to see if any of these common situations apply to you, and how to proceed.

If after reading this and you still need help, please post on
[community.fly.io](https://community.fly.io).  We also offer [email
support](https://community.fly.io/t/fly-io-support-community-vs-email-read-this-first/9962/1),
for the apps you really care about.

## Updates

Your application is unlikely to stay the same forever.  Perhaps you've
updated to a new version of Ruby, bundler, node, or other package.  Or
added a gem which has system dependencies.  When this occurs, you will
need to update your Dockerfile to match.  In most cases, all you need
to do is rerun the generator:

```cmd
bin/rails generate dockerfile
```

The generator will remember the options you selected before (these are
stored in `config/dockerfile.yml`).  If you need to change a boolean
option, add or remove a `no-` prefix before the option name.

If you have made hand edits to your Dockerfile you may want to take advantage
of the option to diff the changes before they are applied.

## Custom Packages

The [Dockerfile generator for Rails](https://github.com/rubys/dockerfile-rails#overview) attempts to detect common dependencies and handle them for you.  If you come across a dependency that may be useful to others, please consider opening up an [issue](https://github.com/rubys/dockerfile-rails/issues) or a [pull request](https://github.com/rubys/dockerfile-rails/pulls).

You may have needs beyond what is automatically detected.
Most [official Ruby docker images](https://hub.docker.com/_/ruby)
are based on Debian [bullseye](https://www.debian.org/releases/bullseye/),
and there are a [large number of packages](https://packages.debian.org/stable/)
available to be installed in this manner.

An example adding basic kernel and network monitoring packages from this list:

```cmd
bin/rails generate dockerfile --add procps net-tools traceroute iputils-ping
```

## Using Sqlite3

Every time you deploy you will start out with a fresh image.  If your database is on that image, it too will start fresh which undoubtedly is not what you want.

The solution is to create a [Fly Volume](https://fly.io/docs/reference/volumes/).

Once you have created a volume, you will need to set the `DATABASE_URL` environment variable to cause Rails to put your database on that volume.  The result will be the following lines in your `fly.toml` file:

```toml
[env]
  DATABASE_URL = "sqlite3:///mnt/volume/production.sqlite3"

[mounts]
  source = "sqlite3_volume"
  destination = "/mnt/volume"
```

Adjust the name of the source to match the name of the volume you created.

## Out of Memory

RAM memory is a precious commodity - both to those on Hobby plans who want
to remain within or near the free allowances, and to apps that want to scale
to be able to handle a large number of concurrent connections.

Both [fullstaq](https://fullstaqruby.org/) and [jemalloc](https://jemalloc.net/) are used by many to reduce their memory footprint.  As every application is different, test your application to see if either are appropriate for you.  Enabling one or both can be done by regenerating your Dockerfile and specifying the appropriate option(s):

```cmd
bin/rails generate dockerfile --fullstaq --jemalloc
```

At some point you may find that you need more memory.  There are two types:
real and virtual.  Real is faster, but more expensive.  Virtual is slower
and often times free.

To scale your app to 1GB of real memory, use:

```cmd
fly scale memory 1024
```

To allocate 512MB of swap space for use as virtual memory, use:

```cmd
bin/rails generate dockerfile --swap=512M
```

## Scaling

If your application involves multiple servers, potentially spread across
a number of regions, you will want to prepare your databases once per
deploy not once per server.

Regenerate your Dockerfile specifying that you no longer want the
prepare step there:

```cmd
bin/rails generate dockerfile --no-prepare
```

Next, add a deploy step to your fly.toml:

```toml
[deploy]
  release_command = "bin/rails db:prepare"
```

## Shelling in

Fly provides the ability to `ssh` into your application, and it would
be convenient to run things like the Rails console in one line:

```cmd
fly ssh console --pty -C '/rails/bin/rails console'
```

To enable `bin/rails` commands to be run in this manner, adjust your
deployed binstubs to set the current working directory:

```cmd
bin/rails generate dockerfile --bin-cd
```

## Build speeds

The Dockerfile you were provided will only install gems and node modules if
files like `Gemfile` and `package.json` have been modified.  If you are
finding that you are doing this often and deploy speed is important to
you, turning on build caching can make a big difference.  And if your
Rails application makes use of node.js, installing gems and node packages
in parallel can reduce build time.  You can regenerate your Dockerfile
to enable one or both:

```cmd
bin/rails generate dockerfile --cache --parallel
```

## Runtime performance

Ruby images starting with 3.2 include [YJIT](https://github.com/Shopify/yjit) but disabled.  You can enable YJIT using:

```cmd
bin/rails generate dockerfile --yjit
```

## Testing Locally

If you have Docker installed locally, you can test your applications
before you deploy them by running the following commands:

```sh
bin/rails generate dockerfile --compose
export RAILS_MASTER_KEY=$(cat config/master.key)
docker compose build
docker compose up
```

Windows Powershell users will want to use the following command instead of export:

```powershell
$Env:RAILS_MASTER_KEY = Get-Content 'config\master.key'
```
