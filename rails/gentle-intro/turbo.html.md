---
title: Turbo Stream Changes
layout: framework_docs
order: 3
objective: Provision a redis cluster, and turbo stream changes to all browsers as they occur.
---

We now have a basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) application where the index page shows a snapshot of
the server state at the time it was displayed.  Lets make the index page
come alive using [Turbo Streams](https://turbo.hotwired.dev/handbook/streams).

This will involve provisioning a redis cluster and a surprisingly small number
of updates to your application.

## Provisioning Redis

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

## Adding turbo streams to your application.

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

## Deployment and testing

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

# Arrived at Destination

You have successfully built, deployed, and connected to your first Rails application on Fly.

We've accomplished a lot with only just over a handful of lines of code and
just over a dozen commands.  When you are ready, proceed to a
[recap](/docs/rails/quick-start/recap/).
