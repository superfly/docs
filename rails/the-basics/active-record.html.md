---
title: Active Record
layout: framework_docs
objective: Provision an application using a Postgres database
order: 3
---

<div>
  <img src="/static/images/rails-intro.webp" srcset="/static/images/rails-intro@2x.webp 2x" alt="">
</div>

In this guide we'll develop and deploy a Rails application that scaffolds a database table.

## Create an application

Start by verifying that you have Rails installed, and then by
creating a new application:

``` shell
$ rails --version
$ rails new list --database postgresql
$ cd list
```

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

And finally, as the splash screen served it purpose, edit `config/routes.rb`, and connect the root with the names index:

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

### Launch

To configure and launch the app, you can use `fly launch` and follow the
wizard.  Fly.io will automatically detect that Postgres is required by
your application.

```cmd
fly launch
```
```output
Detected a Rails app
Creating app in ~/tmp/list
We're about to launch your Rails app on Fly.io. Here's what you're getting:

Organization: Joe Developer                                             (fly launch defaults to the personal org)
Name:         list-little-fire-1088                                     (generated)
Region:       Ashburn, Virginia (US)                                    (this is the fastest region for you)
App Machines: shared-cpu-1x, 1GB RAM                                    (most apps need about 1GB of RAM)
Postgres:     (Fly Postgres) 1 Node, shared-cpu-1x, 256MB RAM, 1GB disk (determined from app source)
Redis:        <none>                                                    (not requested)
Tigris:       <none>                                                    (not requested)

? Do you want to tweak these settings before proceeding? (y/N) 
```

For demo purposes you can accept the defaults.  You can always change these later.
So respond with "N" (or simply press enter).

This will take a few seconds as it uploads your application, builds a machine image,
deploys the images, and then monitors to ensure it starts successfully. Once complete
visit your app with the following command:

```cmd
fly apps open
```

That's it!  You are up and running!  Wasn't that easy?
