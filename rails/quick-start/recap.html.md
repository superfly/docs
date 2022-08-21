---
title: Recap of What We have Accomplished
layout: framework_docs
order: 4
objective: A few observations and tips to wrap things up.
status: alpha
---

We started with an empty directory and in a matter of minutes had a running
Rails application deployed to the web.  A few things to note:

  * From a Rails perspective, we demonstrated Action Cable, Action Pack,
    Action View, Active Job, Active Model, Active Record, and Turbo
    Streams.
  * From a Fly perspective, we demostrated deployment of a Rails app,
    a Postgres DB, a Redis cluster, and the setting of secrets.

Now that you have seen it up and running, a few things are worth noting:

  * Your application is running on a VM, which starts out based on a
    docker image.  To make things easy, `fly launch` generates a
    `Dockerfile` for you which you are free to modify.
  * Other files of note: `.dockerignore` and [`fly.toml`](https://fly.io/docs/reference/configuration/), both of which you can also modify.  All three files
    should be checked into your git repostory.
  * `fly dashboard` can be used to monitor and adjust your application.  Pretty
    much anything you can do from the browser window you can also do from the
    command line using `fly` commands.  Try `fly help` to see what you can do.
  * `fly ssh console` can be used to ssh into your VM.  `fly ssh console -C "/app/bin/rails console"` can be used to open a rails console.

A final note.  While Rails is [Optimized for Prammer happiness](https://rubyonrails.org/doctrine#optimize-for-programmer-happiness), it isn't particularly optimized for minimam RAM consumption. If you wish to deploy an app of any appreciable size or even make extensive use of features like `rails console`, you likely will hit RAM limits on your machine.  And when applications run out of memory, they tend to behave unpredicably as error recovery actions will often also fail due to lack of memory.

The command to be used to address this is:

```cmd
fly scale vm shared-cpu-1x --memory 512
```

While this does take you beyond what is offered with the free offering, the current
cost of adding this additional memory to what otherwise would be a free machine runs about five cents a day, or about a buck and a half a month, or less than twenty dollars a year.