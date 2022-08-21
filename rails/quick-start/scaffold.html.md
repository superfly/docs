---
title: Scaffold to success
layout: framework_docs
order: 1
objective: Scaffold a database table, demonstrating use of a PostgreSQL database.
status: alpha
---

Real Rails applications store data in databases, and Rails scaffolding makes it
easy to get started.  We are going to start with the simplest table possible,
add a small bit of CSS to make the display a bit less ugly, and finally adjust
our routes so that the main page is the index page for our new table.

## Scaffold and style a list of names

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

And finally, as the splash screen served it purpose, now lets edit `config/routes.rb` once again, and replace the welcome screen with the names index:

 ``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
 
   # Defines the root path route ("/")
-  root "rails/welcome#index"
+  # root "names#index"
 end
 ```

While certainly not fancy or extensive, we now have an application that makes use
of a database.

Let's deploy it.

## Deployment

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
