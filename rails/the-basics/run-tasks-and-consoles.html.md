---
title: Running Tasks & Consoles
layout: framework_docs
objective: Access the Rails console, run rake tasks, and access the SSH shell of a running Rails application with these one-liners.
order: 3
---

Running one-off tasks on Fly can be accomplished via `fly ssh console`.

## Rails tasks

To execture the `rails` command on Fly, run:

```cmd
fly ssh console -C "app/bin/rails db:migrate"
```

To list all the available tasks, run:

```cmd
fly ssh console -C "app/bin/rails help"
```

## Rails console

To access an interactive Rails console, run:

```cmd
fly ssh console -C "app/bin/rails console"
```
```output
irb>
```

Then start using the console, but be careful! You're in a production environment.

## Interactive shell

To access an interactive shell, simply run:

```cmd
fly ssh console
```
```output
#
```

## Custom Rake tasks

You can create [Custom Rake Tasks](https://community.fly.io/) to
automate frequently used commands.  As an example, add the
following into `lib/tasks/fly.rake` to reduce the number of
keystrokes it takes to launch a console:

```ruby
namespace :fly do
  task :ssh do
    sh 'fly ssh console'
  end

  task :console do
    sh 'fly ssh console -C "app/bin/rails console"'
  end

  task :dbconsole do
    sh 'fly ssh console -C "app/bin/rails dbconsole"'
  end
end
```

You can run these tasks with `bin/rails fly:ssh`, `bin/rails fly:console`,
and `bin/rails fly:dbconsole` respectively.

