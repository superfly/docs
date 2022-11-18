---
title: Crontab with Superchronic
layout: docs
sitemap: false
nav: firecracker
author: brad
categories:
  - cron
date: 2022-11-19
---

`crontab` is a little too opinionated for containers—it's a great little tool, but when run inside of containers it doesn't grab `ENV` vars how we'd like it to. Fortunately there's a Go binary called `supercronic` that's a drop-in replacement for containers.

The good news is that it's pretty easy to get it running on Fly with a little bit of copy and pasting. Let's get to it.

## Create a crontab file

In the root of your project, add a `crontab` file.

```
touch ./crontab
```

If you need to run a job every 5 minutes, your `crontab` file would something like this:

```
*/5 * * * * echo "hello world!"
```

Check out [cron.help](https://cron.help) if you need a quick crontab syntax reference.

## Install `superchronic` in the container

The [latest releases for superchronic](https://github.com/aptible/supercronic/releases) are on [Github](https://github.com/aptible/supercronic), where they include copy pasta 🍝instructions for getting it in your Dockerfile. As of November 2022, the current version of `superchronic` is v0.2.1. You'll want to check the [releases page](https://github.com/aptible/supercronic/releases) for the latest version, but here's what it looks like now:

```
# Latest releases available at https://github.com/aptible/supercronic/releases
ENV SUPERCRONIC_URL=https://github.com/aptible/supercronic/releases/download/v0.2.1/supercronic-linux-amd64 \
    SUPERCRONIC=supercronic-linux-amd64 \
    SUPERCRONIC_SHA1SUM=d7f4c0886eb85249ad05ed592902fa6865bb9d70

RUN curl -fsSLO "$SUPERCRONIC_URL" \
 && echo "${SUPERCRONIC_SHA1SUM}  ${SUPERCRONIC}" | sha1sum -c - \
 && chmod +x "$SUPERCRONIC" \
 && mv "$SUPERCRONIC" "/usr/local/bin/${SUPERCRONIC}" \
 && ln -s "/usr/local/bin/${SUPERCRONIC}" /usr/local/bin/supercronic

# You might need to change this depending on where your crontab is located
COPY crontab crontab
```

After you put that in your Dockerfile, we're going to configure Fly to run only once instance of `superchronic`. Why? Because if you have a cronjob that does something like deliver emails to customers, you only want them to get that once. The last thing you want is them getting as many emails from your services that matches the number of instances you're running.

## Setup a web &amp; cront process

At the bottom of the `fly.toml` file, add the following:

```
[processes]
  # The command below is used to launch a Rails server; be sure to
  # replace with the command you're using to launcy your server.
  web = "bin/rails fly:server"
  cron = "cron"
```

Then we have to tell Fly that your `web` process matches up with a service by having this under the `[[services]].`

```
# Make sure there's only one `processes` entry under `[[services]]`
[[services]]
  processes = ["web"]
```

This change tells Fly that your `web` processes that you defined under `[processes]` will be exposed to the public internet. Your `cron` process won't be exposed to the public Internet because it doesn't need to!

## Deploy &amp; scale the new processes

Now that we've added `superchronic` to our `Dockerfile`, put the `crontab` at the root of our project folder, and reconfigured the `fly.toml` file, we're ready to deploy to production.

```
$ fly deploy
```

Then we'll need to scale the processes so that we only run one virtual machine container with the `cron` process. Be sure to change `web` to whatever number you had before.

```
$ fly scale count cron=1 web=
```

That's it! If all went well you now have Cron running in a `cron` process in a Fly virtual machine. When you `fly deploy` it will get the latest code changes and reboot the virtual machines.

# Resources

- [https://github.com/fly-apps/supercronic](https://github.com/fly-apps/supercronic)
- [https://cron.help](https://cron.help)
