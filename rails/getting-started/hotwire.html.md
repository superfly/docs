---
title: Hotwire Rails Apps
layout: framework_docs
objective: Add environment variables to your Hotwire Rails applications, configure secrets, and use the encrypted `credentials.yml` file to manage your application's configuratio on Fly.
status: beta
order: 3
---

In this guide we'll develop and deploy a Rails application that first
demonstrates a trivial view, then scaffolds a database table, and finally makes
use of [Turbo Streams](https://turbo.hotwired.dev/handbook/streams) to dynamically
update pages.

In order to start working with Fly you will need `flyctl`, our CLI app for managing apps on Fly. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/getting-started/installing-flyctl/). Once thats installed you'll want to [log in to Fly](/docs/getting-started/log-in-to-fly/).

<div class="callout">
Before proceeding, something to be aware of.  While Rails is [Optimized for Programmer happiness](https://rubyonrails.org/doctrine#optimize-for-programmer-happiness), it isn't particularly optimized for minimum RAM consumption. If you wish to deploy an app of any appreciable size or even make extensive use of features like `rails console`, you likely will hit RAM limits on your machine.  And when applications run out of memory, they tend to behave unpredictably as error recovery actions will often also fail due to lack of memory.

The command to be used to address this is:

```fly scale vm shared-cpu-1x --memory 512```

While this does take you beyond what is offered with the free offering, the current
cost of adding this additional memory to what otherwise would be a free machine runs about five cents a day, or about a buck and a half a month, or less than twenty dollars a year.
</div>

Once you have logged on, here are the three steps and a recap.

## Rails Splash Screen

A newly generated Rails application will display a flashy splash screen when
run in development, but will do absolutely nothing in production until you
add add code.

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

To configure and launch the app, you can use `fly launch` and follow the wizard.
We are not going to use a database yet, but say *yes* to setting up a Postgresql database
in order to prepare for the next step in this guide.

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

You can set a name for the app, choose a default region, and choose to launch and attach a Postgresql database.

### Deploy your application

Deploying your application is done with the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully.  Once complete
visit your app with the following command:

```cmd
fly open
```

That's it!  You are up and running!  Wasn't that easy?

Now proceed to [Scaffold to Success](/docs/rails/quick-start/scaffold/) to make
your application a bit more interesting.

## Scaffold to Success

Real Rails applications store data in databases, and Rails scaffolding makes it
easy to get started.  We are going to start with the simplest table possible,
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
and server processes to restart.  Fly takes care of all of this and more, so all
you need to do is the following:

``` shell
$ fly deploy
$ fly open
```

Subsequent deploys are quicker than the first one as substantial portions of you
application will have already been built.

Try it out!  Add a few names and once you are done, proceed onto the next step: [Turbo Stream Changes](/docs/rails/quick-start/turbo/).

## Turbo

We now have a basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) application where the index page shows a snapshot of
the server state at the time it was displayed.  Lets make the index page
come alive using [Turbo Streams](https://turbo.hotwired.dev/handbook/streams).

This will involve provisioning a redis cluster and a surprisingly small number
of updates to your application.

### Provisioning Redis

Before proceeding, verify that your application is already set up to use Redis.
Examine your `Gemfile` and look for the following lines:

``` ruby
# Use Redis adapter to run Action Cable in production
gem "redis", "~> 4.0"
```

If the second line is commented out, uncomment it and then run `bundle install`.  Rails will automatically have done this for you if it detected the `redis-server` executable on your machine at that time the application was created.

Now that Rails is ready to make use of Redis, lets deploy a redis cluster:

```cmd
fly redis create
```
```output
? Select Organization: John Smith (personal)
? Choose a Redis database name (leave blank to generate one): list-redis
? Choose a primary region (can't be changed later) Ashburn, Virginia (US) (iad)
? Optionally, choose one or more replica regions (can be changed later):

Upstash Redis can evict objects when memory is full. This is useful when caching in Redis. This setting can be changed later.
Learn more at https://fly.io/docs/reference/redis/#memory-limits-and-object-eviction-policies
? Would you like to enable eviction? No
? Select an Upstash Redis plan Free: 100 MB Max Data Size

Your Upstash Redis database list-redis is ready.
Apps in the personal org can connect to at redis://default:<redacted>.upstash.io
If you have redis-cli installed, use fly redis connect to connect to your database.
```

Once again, you can set a name for the database, chose a primary region as well as
a number of replica regions, enable eviction, and select a plan.

The most important line in this output is the second to the last one which will contain
a URL starting with `redis:`.  The URL you see will be considerably longer than the one
you see above.  You will need to provide this URL to Rails, and with fly this is done
via [secrets](https://fly.io/docs/reference/secrets/).  Run the following command replacing the url with the one from the output above:

```cmd
fly secrets set REDIS_URL=redis://default:<redacted>.upstash.io
```

Now you are ready.  Rails is set up to use redis, knows where to find the redis instance,
and the instance is deployed.  Now onto the implementation:

### Adding turbo streams to your application.

There actually are five separate steps needed to make this work.  Fortunately all but
one require only a single line of code (or in one case, a single command).  The third
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

+ <%= turbo_stream_from 'names' %>
+
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
`fly open`.  Once that is done, copy the browser URL, open a second browser
window (it can even be a different browser or even on a different machine), and
paste the URL into the new window.

With one browser window open to the index page, use the other browser to change
one of the names.  Once you click "Update name" the index list in the original
window will instantly update.

Of course, if this were a real application, inserting and removing names would
cause those changes to be broadcast.  As they say, this is left as an exercise
for the student.

## Arrived at Destination

You have successfully built, deployed, and connected to your first Rails application on Fly.

We've accomplished a lot with only just over a handful of lines of code and
just over a dozen commands.  When you are ready, proceed to a
[recap](/docs/rails/quick-start/recap/).

## Recap

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


