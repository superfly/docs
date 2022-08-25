---
title: Recap of What We have Accomplished
layout: framework_docs
order: 4
objective: A few observations and tips to wrap things up.
---

We started with an empty directory and in a matter of minutes had a running
Rails application deployed to the web.  A few things to note:

  * From a Rails perspective, we demonstrated Action Cable, Action Pack,
    Action View, Active Job, Active Model, Active Record, and Turbo
    Streams.
  * From a Fly perspective, we demonstrated deployment of a Rails app,
    a Postgres DB, a Redis cluster, and the setting of secrets.

Now that you have seen it up and running, a few things are worth noting:

  * No changes were required to your application to get it to work.
  * Your application is running on a VM, which starts out based on a
    docker image.  To make things easy, `fly launch` generates a
    `Dockerfile` for you which you are free to modify.
  * Other files of note: `.dockerignore` and [`fly.toml`](https://fly.io/docs/reference/configuration/), both of which you can also modify.  All three files
    should be checked into your git repository.
  * `fly dashboard` can be used to monitor and adjust your application.  Pretty
    much anything you can do from the browser window you can also do from the
    command line using `fly` commands.  Try `fly help` to see what you can do.
  * `fly ssh console` can be used to ssh into your VM.  `fly ssh console -C "/app/bin/rails console"` can be used to open a rails console.

Now that you have seen how to deploy a trivial application, it is time
to move on to [The Basics](../../the-basics/).
