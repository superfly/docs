---
title: Cell-based architecture
layout: docs
nav: firecracker
author: rubys
categories:
  - shared-nothing
  - cell-based
  - machines
  - routing
toc: false
status: alpha
published: false
---

Previously know as
[shared-nothing-architecture](https://en.wikipedia.org/wiki/Shared-nothing_architecture),
the concept was rediscovered and rebranded as
[cell-based](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/what-is-a-cell-based-architecture.html)
by Amazon.

This blueprint shows you how to implement a scenario where each user of your
application is assigned a new Machine.  These Machines, by default, will
automatically stop when not in use and be restarted when accessed, so the
primary expense will be for volumes and actual usage.

<div class="warning icon">
**Warning**: if you follow this example, applications will be deployed without
their databases being replicated.  This exposes your application to volume and
Machine failures.  Backups become your responsibility.  Some approaches to
addressing this requirement are listed at the <a href="#backups">bottom of this
page</a>.
</div>

The example given here will be based on Rails, but the approach applies to all
frameworks.

## Start With a Single Machine Application

If you don't have one, the following will do:

```
rails new blog --css tailwind
cd blog
bin/rails generate scaffold Post title:string body:text
fly launch --name blog-$USER-$RANDOM
```

Feel free to substitute a different name for your application.

## Configure Your Routes

Modify `config/routes.rb`.  Wrap your routes with:

```ruby
scope ENV.fetch("FLY_MACHINE_ID", "") do
...
end
```

If present, move `get "up"` line outside of this block.

Uncomment the `root` line.

Your final result will look something like this:

```ruby
Rails.application.routes.draw do
  scope ENV.fetch("FLY_MACHINE_ID", "") do
    resources :posts
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

    # Defines the root path route ("/")
    root "posts#index"
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
```

What this will do is place your entire application, minus the health check
endpoint, into a namespace when deployed to fly.io.  Access to your application
will need to be prefixed by your Machine id.  When run in environments where
the `FLY_MACHINE_ID` environment variable is not set, no prefix is required.

You can get a list of Machine ids using:

```
fly machines list -q
```

## Starting a Second Machine

In order to prepare for a multiple Machine deployment, we are going to need to
ensure that each request is routed to the correct Machine.  We can accomplish
this via middleware that makes use of the
[fly-replay](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-replay-response-header)
response header.

Place the following into `config/initializers/fly_router.rb`:

```ruby
if ENV["FLY_MACHINE_ID"]
  class FlyInstanceRouter
    def initialize(app)
      @app = app
    end

    def call(env)
      segments = env["PATH_INFO"].split('/')
      instance = segments[1]

      if instance =~ /^[0-9a-f]{14}$/ and instance != ENV["FLY_MACHINE_ID"]
        return [409, {"Fly-Replay" => "instance=#{instance}"}, [""]]
      end

      @app.call(env)
    end
  end

  Rails.application.config.middleware.use(FlyInstanceRouter)
end
```

Deploy this change using `fly deploy`, then use the following command to create
a second Machine:

```
fly machine clone
```

At this point, you have two instances of the blog application, each on its own
Machine, with its own volume and sqlite3 database.

Note that [fly machine clone](https://fly.io/docs/flyctl/machine-clone/) has a
number of options that can be used to specify such things as the region, vm
sizes, and whether the volume requires a unique zone.

Regions, in particular, can enable you to put both applications _and_ data
close to users.

## Optimizing your routes

This section is optional, and depends on a unique feature of Rails'
[Hotwire](https://hotwired.dev/) implementation.

At this point, many requests will end up making two hops: first to a nearby
Machine then to the desired Machine.  This increases latency of responses,
particularly when it is necessary to wake two Machines to process the first
request.

Not much can be done to avoid this for the first request, but subsequent
requests can route to the correct Machine using the `fly-force-instance-id`
request header.

Place the following into `app/javascript/controllers/fly_router_controller.js`:

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="fly-router"
export default class extends Controller {
  connect() {
    console.log('fly router connected')
    this.instance = this.element.dataset.instance;

    document.documentElement.addEventListener(
     'turbo:before-fetch-request',
     this.beforeFetchRequest
    )
  }

  disconnect() {
    document.documentElement.removeEventListener(
     'turbo:before-fetch-request',
     this.beforeFetchRequest
    )
  }

  beforeFetchRequest = event => {
    console.log('injecting ' + this.instance);
    event.detail.fetchOptions.headers['fly-force-instance-id'] = this.instance;
  }
}
```

Finally, modify the `<body>` line in `app/views/layouts/application.html.erb`:

```erb
  <body<% if ENV['FLY_MACHINE_ID'] %> data-instance="<%= ENV['FLY_MACHINE_ID'] %>" data-controller="fly-router"<% end %>>>
```

Deploy this change using `fly deploy`.

## Next steps

The above merely amounts to a proof of concept.  A production application will
likely make use of one or more of the following:

 * While putting the Machine id into the URL path is effective,
   it isn't very ergonomic.  A better solution would be have a registry of
   paths and their associated Machines.
 * Implementing routing in middleware gets the job done, but
   separating this out to a separate process using an application like
   [`nginx`](https://nginx.org/en/) can have a number of advantages:
    * `fly-replay` is limited to request payloads of one megabyte or less,
      which would affect features like file uploads.  A [reverse
      proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
      might be a better solution.
    * support for custom subdomains as an alternative to path namespaces and
      scopes.
    * authentication and serving static assets can be performed outside of your
      application.
    * Add-ons like [Phusion Passenger](https://www.phusionpassenger.com/) can
      enable you to run multiple instances of your application in one Machine.
 * Monitoring becomes more crucial when you have hundreds or even dozens of
   independent Machines.  Fly.io will combine your logs and while this
   addresses many problems, it doesn't help deal with logs that are missing due
   to application or network problems.  Consider having applications emit a
   heartbeat, and write monitoring software that looks for missing heartbeats
   and reports them as issues.  [Sentry](https://fly.io/docs/monitoring/sentry/)
   can help here.
 * While applying updates when all of the services for a single Machine are
   self contained is an easier problem then upgrading potentially
   interdependent services running live in production, it does come at a cost:
   a blue/green deployment is not possible so a focus on reducing startup times
   is necessary.
 * Consider building an administrative web based interface for your
   application.  User registration and Machine assignments are likely coupled
   in your workflow.  While Fly.io provides a <a
   href="https://fly.io/docs/machines/working-with-machines/">Machines API</a>,
   you can go a long way with old-fashioned scripting using the <a
   href="https://fly.io/docs/flyctl/">flyctl</a> command.

See [Showcase
Architecture](https://github.com/rubys/showcase/blob/main/ARCHITECTURE.md) for
an example of an application running in production that implements many of
these ideas.

## Backups

As mentioned above, backups are crucial.  Items to explore:

 * [LiteFS](https://fly.io/docs/litefs/) - Distributed SQLite.  By itself, it
   supports failover situations naturally.  Additional [disaster
   recovery](https://fly.io/docs/litefs/backup/) options are available.
 * Sqlite3 databases are just files.  Build a separate application to host
   backups and have your application periodiacally POST copies there.
 * [Rsync](https://rsync.samba.org/) is a utility available with Linux
   distributions that can be used to efficiently copy changes between Machines.
 * Run multiple Machines per cell so that you get the full benefits of
   traditional high availability configurations.  If you have implemented an
   admin web UI, you can automate the deployment of new clusters easily.
