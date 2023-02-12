---
title: Getting Started
layout: framework_docs
order: 1
redirect_from: /docs/getting-started/rails/
subnav_glob: docs/rails/getting-started/*.html.*
objective: Quickly get a very basic Rails blog up and running on Fly.io. This guide is the fastest way to try using Fly, so if you're short on time start here.
related_pages:
  - /docs/rails/the-basics
  - /docs/flyctl/
  - /docs/reference/configuration/
  - /docs/reference/redis
  - /docs/postgres/
---

In this guide we'll develop and deploy a Rails application that first
demonstrates a trivial view, then scaffolds a database table, and finally makes
use of [Turbo Streams](https://turbo.hotwired.dev/handbook/streams) to dynamically
update pages.

In order to start working with Fly.io, you will need `flyctl`, our CLI app for managing apps. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/hands-on/install-flyctl/). Once thats installed you'll want to [log in to Fly](/docs/getting-started/log-in-to-fly/).

Once you have logged on, here are the three steps and a recap.

## Rails Splash Screen

A newly generated Rails application will display a flashy splash screen when
run in development, but will do absolutely nothing in production until you
add code.

In order to demonstrate deployment of a Rails app on fly, we will create a new application, make
a one line change that shows the splash screen even when run in production mode,
and deploy the application.

### Create an application

Start by verifying that you have Rails version 7 installed, and then by
creating a new application:

``` shell
$ rails --version
$ rails new list
$ cd list
```

Now use your favorite editor to make a one line change to `config/routes.rb`:

``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

   # Defines the root path route ("/")
-  # root "articles#index"
+  root "rails/welcome#index"
 end
 ```

 Now that we have an application that does something, albeit something trivial,
 let's deploy it.

### Provision Rails and Postgres Servers

To configure and launch the app, you can use `fly launch` and follow the
wizard.  We are not going to use a database or redis yet, but say *yes* to both
setting up a Postgresql database and to setting up Redis in order to prepare
for the next step in this guide.

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

You can chose a name for your application or allow one to be assigned to you.
You can chose where the application is run or a location near you will be
picked.  You can pick machine sizes for your database machine and redis; for
demo purposes you can let these default.  You can always change these later.

It is worth heeding the advice at the end of this:
Before proceeding, please review the posted Rails FAQ:
[https://fly.io/docs/rails/getting-started/dockerfiles/](https://fly.io/docs/rails/getting-started/dockerfiles/).

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

That's it!  You are up and running!  Wasn't that easy?

If you have seen enough and are eager to get started, feel free to
skip ahead to the [Recap](#recap) where you will see some tips.

For those that want to dig in deeper, let's make the application a bit more
interesting.

## Scaffold to Success

Real Rails applications store data in databases, and Rails scaffolding makes it
easy to get started. We are going to start with the simplest table possible,
add a small bit of CSS to make the display a bit less ugly, and finally adjust
our routes so that the main page is the index page for our new table.

### Scaffold and style a list of names

Since we are focusing on fly deployment rather than Rails features, we will keep it simple and create a single table with exactly one column:

```cmd
bin/rails generate scaffold Name name
```

Now add the following to the bottom of `app/assets/stylesheets/application.css`:

``` css
#names {
  display: grid;
  grid-template-columns: 1fr max-content;
  margin: 1em;
}

#names strong {
  display: none;
}

#names p {
  margin: 0.2em;
}
 ```

And finally, as the splash screen served it purpose, edit `config/routes.rb` once again, and replace the welcome screen with the names index:

 ``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

   # Defines the root path route ("/")
-  root "rails/welcome#index"
+  root "names#index"
 end
 ```

While certainly not fancy or extensive, we now have an application that makes use
of a database.

Let's deploy it.

### Deployment

Normally at this point you have database migrations to worry about, code to push,
and server processes to restart. Fly.io takes care of all of this and more, so all
you need to do is the following:

``` shell
$ fly deploy
$ fly open
```

Subsequent deploys are quicker than the first one as substantial portions of you
application will have already been built.

Try it out!  Add a few names and once you are done, proceed onto the final step.

## Make Index come Alive

We now have a basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) application where the index page shows a snapshot of
the server state at the time it was displayed. Lets make the index page
come alive using [Turbo Streams](https://turbo.hotwired.dev/handbook/streams).

This will involve provisioning a [redis](https://redis.com/) cluster and a
surprisingly small number of updates to your application.

### Adding turbo streams to your application.

There actually are five separate steps needed to make this work. Fortunately all but
one require only a single line of code (or in one case, a single command). The third
step actually requires two lines of code.

Start by generating a channel:

```cmd
bin/rails generate channel names
```

Next, name the stream by modifying `app/channels/names_channel.rb`:

```diff
  class NamesChannel < ApplicationCable::Channel
    def subscribed
-      # stream_from "some_channel"
+      stream_from "names"
    end

    def unsubscribed
      # Any cleanup needed when channel is unsubscribed
    end
  end
```

Then modify `app/views/names/index.html.erb` to stream from that channel:

```diff
  <p style="color: green"><%= notice %></p>

  <h1>Names</h1>
+
+ <%= turbo_stream_from 'names' %>

  <div id="names">
    <% @names.each do |name| %>
      <%= render name %>
      <p>
        <%= link_to "Show this name", name %>
      </p>
    <% end %>
  </div>

  <%= link_to "New name", new_name_path %>
  </div>
```

And we complete the client changes by modifying `app/views/names/_name.html.erb` to
identify the turbo frame:

```diff
- <div id="<%= dom_id name %>">
+ <%= turbo_frame_tag(dom_id name) do %>
    <p>
      <strong>Name:</strong>
      <%= name.name %>
    </p>

- </div>
+ <% end %>
```

There is only one step left, and that is to modify `app/controllers/names_controller.rb` to broadcast changes as updates are made:

```diff
  # PATCH/PUT /names/1 or /names/1.json
  def update
    respond_to do |format|
      if @name.update(name_params)
        format.html { redirect_to name_url(@name), notice: "Name was successfully updated." }
        format.json { render :show, status: :ok, location: @name }
+
+       @name.broadcast_replace_later_to 'names', partial: 'names/name'
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @name.errors, status: :unprocessable_entity }
      end
    end
  end
```

### Deployment and testing

By now it should be no surprise that deployment is as easy as `fly deploy` and
`fly open`. Once that is done, copy the browser URL, open a second browser
window (it can even be a different browser or even on a different machine), and
paste the URL into the new window.

With one browser window open to the index page, use the other browser to change
one of the names. Once you click "Update name" the index list in the original
window will instantly update.

Of course, if this were a real application, inserting and removing names would
cause those changes to be broadcast. As they say, this is left as an exercise
for the student.

## Arrived at Destination

You have successfully built, deployed, and connected to your first Rails application on Fly.

We've accomplished a lot with only just over a handful of lines of code and
just over a dozen commands. When you are ready, proceed to a
[recap](#recap).

## Recap

We started with an empty directory and in a matter of minutes had a running
Rails application deployed to the web. A few things to note:

  * From a Rails perspective, we demonstrated Action Cable, Action Pack,
    Action View, Active Job, Active Model, Active Record, and Turbo
    Streams.
  * From a Fly.io perspective, we demonstrated deployment of a Rails app,
    a Postgres DB, a Redis cluster, and the setting of secrets.

Now that you have seen it up and running, a few things are worth noting:

  * No changes were required to your application to get it to work.
  * Your application is running on a VM, which starts out based on a
    docker image. To make things easy, `fly launch` generates a
    `Dockerfile` and a `bin/docker-entrypoint` for you which you are free to modify.
  * There is also a `config/dockerfile.yml` file which keeps track of your
    dockerfile generation options.  This was covered by the
    [FAQ](https://fly.io/docs/rails/getting-started/dockerfiles/) you read above.
  * Other files of note: `.dockerignore` and
    [`fly.toml`](https://fly.io/docs/reference/configuration/), both of which
    you can also modify.
    All five files should be checked into your git repository.
  * `fly dashboard` can be used to monitor and adjust your application. Pretty
    much anything you can do from the browser window you can also do from the
    command line using `fly` commands. Try `fly help` to see what you can do.
  * `fly ssh console` can be used to ssh into your VM. `fly ssh console -C "/rails/bin/rails console"` can be used to open a rails console.

Now that you have seen how to deploy a trivial application, it is time
to move on to [The Basics](../../rails/the-basics/).
