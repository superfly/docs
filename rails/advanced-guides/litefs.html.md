---
title: LiteFS
layout: framework_docs
objective: This guide shows use LiteFS with Rails
status: beta
---

This is a technology preview. It shows how to do multi-region deployments
using Sqlite3 and Litefs. See [LiteFS - Distributed
SQLite](https://fly.io/docs/litefs/) for background.

In order to run this demo, you need `flyctl` to be version `0.1.9` or later.


## Deploying a Rails project as a Fly.io Machine

Let's start with a very simple Rails project:

```sh
rails new list
cd list
bin/rails generate scaffold Name name
echo 'Rails.application.routes.draw {root "names#index"}' >> config/routes.rb
```

Launching this will require a litefs configuration file (`litefs.yml`) and a number of changes to your dockerfile.  Fly.io provides a [dockerfile generator](https://github.com/fly-apps/dockerfile-rails) which will do this for you.  Run it immediately after `fly launch` thus:


```sh
fly launch
bin/rails generate dockerfile --litefs
```

`fly launch` will prompt you for a name, region, and whether or not you want postgres or redis databases.  Say no to the databases, you won't need them for this demo.

`generate dockerfile` will prompt you whether or not you want to accept the changes.  Feel free to peruse the diffs, but ultimately accept the changes.  If you would rather not even be prompted to see the diffs, you can add a `--force` option the command.

Before we deploy, let's make a one-line change to our `fly.toml` to keep our machines running so that we can ssh into them whenever we want:

```toml
  auto_stop_machines = false
```

Now we can deploy normally:

```
fly deploy
```

Once the application has been deployed, running `fly apps open` will open a
browser. Add one name.

Return back to your terminal window and run:

```cmd
fly machines list -q
```

You will see that only one copy of your application is running.  You can deploy a second machine in a different region using:

```cmd
fly machine clone --region lhr 3d8d9930b32189
```

Feel free to pick a different region.  Substitute the machine id with the one
that you see in the response to `fly machines list -q`.  Once both instances
are running, enter the following command and select the instance that is
furthest from you:

```
% fly ssh console -s
? Select VM:  [Use arrows to move, type to filter]
  atl: 3d8d9930b32189 fdaa:0:d445:a7b:e5:b340:6b3d:2 autumn-breeze-5346
> lhr: e784e90ea17928 fdaa:0:d445:a7b:13e:8621:f8bd:2 muddy-moon-3291
```

Once you see a prompt, verify that you landed where you expected:

```cmd
printenv FLY_REGION
```

Now run rails console and display the last name:

```
% /rails/bin/rails console
Loading production environment (Rails 7.0.4)
irb(main):001:0> Name.last
```

Return to the browser and change the value of this name, and then once again use the rails console to verify that the name has been updated.

# Current limitations

 * [What Litefs Can Do Today](https://fly.io/blog/introducing-litefs/#what-litefs-can-do-today) describes current capabilities and future plans.

