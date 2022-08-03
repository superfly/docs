---
title: Running tasks & consoles
layout: rails_docs
order: 3
---

Running one-off tasks on fly can be accomplished via `fly console`.

## Rake tasks

To execute rake on fly, run:

```cmd
fly ssh console -C "bin/rake db:migrate"
```

To list all the available tasks, run:

```cmd
fly ssh console -C "bin/rake -T"
```

## Rails tasks

Similarly, to run the rails command on fly:

```cmd
fly ssh console -C "bin/rails db:migrate"
```

To list all the available tasks, run:

```cmd
fly ssh console -C "bin/rails help"
```

## Rails console

To access an interactive Rails console, run:

```cmd
fly ssh console -c "bin/rails console"
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
