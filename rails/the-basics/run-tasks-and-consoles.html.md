---
title: Running tasks & consoles
layout: framework_docs
order: 3
---

Running one-off tasks on Fly can be accomplished via `fly console`.

## Rake tasks

To execute `rake` on Fly, run:

```cmd
fly ssh console -C "app/bin/rake my_rake_task"
```

To list all the available tasks, run:

```cmd
fly ssh console -C "app/bin/rake -T"
```

## Rails tasks

Similarly, to run the `rails` command on Fly:

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
