---
title: Litefs
layout: framework_docs
objective: This guide shows use LiteFS with Rails
status: beta
---

This is a technology preview.  It shows how to do multi-region deployments
using Sqlite3 and Litefs.  See [Introducting LiteFS](https://fly.io/blog/introducing-litefs/) for
background.


## Deploying a Rails project as a Fly.io Machine

Let's start with a very simple Rails project:

```cmd
rails new list; cd list; bin/rails generate scaffold Name name
```

At this point you have two choices.  You can run `fly launch` and follow the instructions in [Getting Started with LiteFS](https://fly.io/docs/litefs/getting-started/) which would require you to make the following modifications:

  * In `Dockerfile`, add `FROM flyio/litefs:pr-109`, `fuse` package, `COPY --from=lite fs`, `COPY config/litefls.yml`, `mkdir /data`.  Change `SERVER_COMMAND` to `litefs`.
  * In `lit/tasks/fly.rake`, remove the `release` step.
  * In `fly.toml`, change `SERVER_COMMAND` to `litefs`, remove `[deploy]` section, set `DATABASE_URL` to `"sqlite3:///data/production.sqlite3"`, add `enable_consul` to the `[experimental]` section, and add a `[mount]` section.
  * Add `config/litefs.yml`, with `data-dir` set to `/mnt/volume` and `exec` set to `bin/rails fly:server`.
  * create two volumes with the same name and in two different regions.

Or you could install a gem which will do all of the above:

```
bundle add fly-io.rails
bin/rails generate fly:app --nomad --litefs --region iad lhr
```

Feel free to add to or change the regions in the list above.

Now let the fun begin.

```cmd
fly deploy
```

Once the application has been deployed, running `fly open` will open a browser and show you that `The page you were looking for doesn't exist.`  This is
because we didn't set up a root.  Add `/names` to the path and you will see the scaffolded view.  Add one name.

Return back to your terminal window and run:

```cmd
fly status
```

You will see that only one copy of your application is running.  You can increase the count by running:

```cmd
fly scale count 2
```

This may take a minute or so to complete.  Run `fly status` to see the progress.

Once both instances are running, enter the following command and select the instance that is furthest from you:

```
% fly ssh console -s
? Select instance:  [Use arrows to move, type to filter]
  iad.blue-smoke-2696.internal
> lhr.blue-smoke-2696.internal
```

Once you see a prompt, verify that you landed where you expected:

```cmd
printenv FLY_REGION
```

Now run rails console and display the last name:

```
% /app/bin/rails console
Loading production environment (Rails 7.0.4)
irb(main):001:0> Name.last
```

Return to the browser and change the value of this name, and then once again use the rails console to verify that the name has been updated.

# Current limitations

 * litefs currently only works with Nomad, not with machines.
 * VMs with Consol enabled never exit, making releases impossible.  Additionally litefs write forwarding needs work.
   Perhaps [fly-ruby](https://github.com/superfly/fly-ruby) would address this, or could readily be adapted.
   [What Litefs Can Do Today](https://fly.io/blog/introducing-litefs/#what-litefs-can-do-today) describes current
   capabilities and future plans.




