---
title: IEx into Your Running App
layout: framework_docs
order: 1
redirect_from:
  - /docs/getting-started/elixir/
  - /docs/getting-started/iex-into-running-app/
blog_path: /phoenix-files
objective: Get an IEx shell into your running production app on Fly!
---

Elixir supports getting a IEx shell into a running production node. How cool is that?


## SSH Into our App

To do this, we will [login with SSH](/docs/flyctl/ssh/) to our
application VM. There is a one-time setup task for using SSH. Follow the instructions.

```
fly ssh issue --agent
```

With SSH configured, let's open a console.

```cmd
fly ssh console -C "app/bin/hello_elixir remote"
```
```output
Connecting to hello_elixir.internal... complete
Erlang/OTP 23 [erts-11.2.1] [source] [64-bit] [smp:1:1] [ds:1:1:10] [async-threads:1]

Interactive Elixir (1.11.2) - press Ctrl+C to exit (type h() ENTER for help)
iex(hello_elixir@fdaa:0:1da8:a7b:ac4:b204:7e29:2)1>
```
You have a live IEx shell into your application!

<div class="callout">
**Tip:** One of several ways to [exit the IEx shell](https://hexdocs.pm/iex/IEx.html#module-exiting-the-shell) is to hit `Ctrl+C, Ctrl+C`; to log out of the VM console, use `Ctrl+D` or `exit`.
</div>

## What's Next?

With another quick update we can prepare our application for clustering by naming our nodes differently.

Next up, [Naming Your Elixir Node](/docs/elixir/getting-started/naming-your-elixir-node/)!
