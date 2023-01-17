---
title: Naming Your Elixir Node
layout: framework_docs
order: 3
blog_path: /phoenix-files
objective: Setup a consistent naming pattern that makes it easy to cluster Elixir nodes using DNS.
---

To make clustering easier, we want our Elixir nodes to be named using our Fly application name and the IPv6 address assigned to the node. Then later, our cluster can form up using DNS settings based on this naming scheme.

## Naming the Node

In your Elixir application, run this command:

```cmd
mix release.init
```

Then edit the generated `rel/env.sh.eex` file and add the following lines:

```shell
ip=$(grep fly-local-6pn /etc/hosts | cut -f 1)
export RELEASE_DISTRIBUTION=name
export RELEASE_NODE=$FLY_APP_NAME@$ip
```

This names our Elixir node using the Fly application name and the internal IPv6 address. Make sure to deploy after making this change!

```cmd
fly deploy
```

## What's Next?

Nice! Our application is ready for clustering!

Next up, [Clustering](/docs/elixir/the-basics/clustering/)!
