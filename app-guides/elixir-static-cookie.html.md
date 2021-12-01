---
title: Setting a Static Cookie for Elixir
layout: docs
sitemap: false
nav: firecracker
author: mark
categories:
  - elixir
date: 2021-06-21
---

## The Cookie Situation

Before two Elixir nodes **can** cluster together, they must share a secret cookie. The cookie itself isn't meant to be a super secret encryption key or anything like that, it's designed to let you create multiple sets of small clusters on the same network that don't all just connect together. Different cookies means different clusters. For instance, only the nodes that all use the cookie "abc" will connect together.

For us, this means that in order for `my_remote` node to connect to the cluster on Fly, I need to share the same cookie value used in production.

### The Cookie Problem

When you build a `mix release`, it generates a long random string for the cookie value. When you **re-run** the `mix release` command, it keeps the same cookie value. That is, when you don't run it in Docker. The Dockerfile we're using is building a fresh release every time we run it. That's kind of the point of a Docker container. So **our cookie value is being randomly generated every time we deploy**. This means after every deploy, I would have to figure out what the new cookie value is so my local node can use it.

### The Cookie Solution

The easiest solution here is to **specify** the value to use for our cookie. One that we will know outside of the build and that won't keep changing on us.

## Making the Changes

Let's walk through making the changes on the [hello_elixir project](https://github.com/fly-apps/hello_elixir-dockerfile) used in the [Elixir guide](/docs/getting-started/elixir/) to see what's involved.

### Release Section

In your `mix.exs` file, you can add a `releases/0` function that returns the configuration.

This is following the [mix release](https://hexdocs.pm/mix/Mix.Tasks.Release.html) docs, these are the changes we'll make:


```elixir
defmodule HelloElixir.MixProject do
  use Mix.Project

  def project do
    [
      app: :hello_elixir,
      # ...
      releases: releases()
    ]
  end

  # ...

  defp releases() do
    [
      hello_elixir: [
        include_executables_for: [:unix],
        cookie: "YOUR-COOKIE-VALUE"
      ]
    ]
  end
end
```

The `releases` function returns a keyword list. To clarify, the `:hello_elixir` atom isn't actually important. It could be named `demo` or `full_app`. The name becomes important when you are defining **multiple** release configurations. However, that's beyond the scope of this guide. When only defining a single configuration, it uses that regardless of the name. So for simplicity, I'll just name it the same as the application.


For the `:cookie` value, you can generate a unique value using the following Elixir command:

```elixir
Base.url_encode64(:crypto.strong_rand_bytes(40))
```


Once your pre-defined cookie value is set, deploy your updated app.

```cmd
fly deploy
```

If desired, you can verify that the cookie value was set correctly in production, here's how:

```
$ fly ssh console
Connecting to icy-leaf-7381.internal... complete

/ #  cat app/releases/COOKIE
YOUR-COOKIE-VALUE
```

With a known and unchanging cookie value deployed in our application, we are ready for the next step!
### Umbrella Note

If you have an umbrella project, you may want to add an option called `:applications`. In it, you specify the name of all "entrypoint" applications. For instance, if I had two apps in my umbrella: `web` and `core` where `web` is a Phoenix application, that is the entrypoint. My configuration would look like this:

```elixir
  defp releases() do
    [
      hello_elixir: [
        include_executables_for: [:unix],
        applications: [web: :permanent],
        cookie: "YOUR-COOKIE-VALUE"
      ]
    ]
  end
```

This instructs which applications should be started and in which order for this release configuration. In my application `web` has a dependency on `core`, so specifying `web` is all I need to do.

See the [documentation here](https://hexdocs.pm/mix/Mix.Tasks.Release.html#module-customization) for more details and what other options are available.
