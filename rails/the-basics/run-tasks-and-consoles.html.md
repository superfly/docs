---
title: Running Tasks & Consoles
layout: framework_docs
objective: Access the Rails console, run rake tasks, and access the SSH shell of a running Rails application with these one-liners.
order: 3
---

## Rails console

To access an interactive Rails console, run:

```cmd
fly ssh console -C "rails/bin/rails console"
```
```output
Loading production environment (Rails 7.0.4.2)
irb(main):001:0>
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

## Rails tasks

In order to run other Rails tasks, a small change is needed to your Rails
binstubs to set the current working directory.  The following command will
make the adjustment for you:

```cmd
bin/rails generate dockerfile --bin-cd
```

Accept the changes to your Dockerfile, and then rerun `fly deploy`.

Once this is complete, you can execute other commands on Fly, for example:

```cmd
fly ssh console -C "rails/bin/rails db:migrate"
```

To list all the available tasks, run:

```cmd
fly ssh console -C "rails/bin/rails help"
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
    sh 'fly ssh console -C "rails/bin/rails console"'
  end

  task :dbconsole do
    sh 'fly ssh console -C "rails/bin/rails dbconsole"'
  end
end
```

You can run these tasks with `bin/rails fly:ssh`, `bin/rails fly:console`,
and `bin/rails fly:dbconsole` respectively.

