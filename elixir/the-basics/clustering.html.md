---
title: Clustering Your Application
layout: framework_docs
order: 4
redirect_from:
  - /docs/app-guides/elixir-static-cookie/
  - /docs/elixir/getting-started/clustering/
blog_path: /phoenix-files
objective: Cluster your erlang nodes into a single distributed network!
---

Elixir and the BEAM have the incredible ability to be clustered together and
processes can pass messages seamlessly to each other between nodes. Fly.io makes
clustering easy! This extra (and totally optional) portion of the guide walks
you through clustering your Elixir application.

There are 3 parts to getting clustering quickly setup on Fly.io.

- Naming the Node(s)
- Installing and using `dns_cluster`
- Scaling our application to multiple VMs

## Naming the Node(s)

To make clustering easier, we want our Elixir nodes to be named using our Fly application name and the IPv6 address assigned to the node. Then later, our cluster can form up using DNS settings based on this naming scheme.

If you've run `fly launch` already then you should have a `rel` folder with a `rel/env.sh.eex` file already.

If not, run this command from your Elixir application:

```cmd
mix release.init
```

Then check the generated `rel/env.sh.eex` file and add ensure the lines looks similar:

```shell
# configure node for distributed erlang with IPV6 support
export ERL_AFLAGS="-proto_dist inet6_tcp"
export ECTO_IPV6="true"
export DNS_CLUSTER_QUERY="${FLY_APP_NAME}.internal"
export RELEASE_DISTRIBUTION="name"
export RELEASE_NODE="${FLY_APP_NAME}-${FLY_IMAGE_REF##*-}@${FLY_PRIVATE_IP}"
```

This names our Elixir node's name (also known as RELEASE_NODE) using the Fly application name, the Docker image reference value, and the internal IPv6 address. Make sure to deploy after making this change!

```cmd
fly deploy
```

## Adding `dns_cluster`

The Phoenix library [dns_cluster](https://github.com/phoenixframework/dns_cluster) helps here.

The `dns_cluster` library lets you easily setup Erlang Clustering using DNS, and Fly.io has built in DNS support!

After installing `dns_cluster`, add it to the application like this:

```elixir
defmodule HelloElixir.Application do
  use Application

  def start(_type, _args) do
    children = [
      # ...
      # setup for clustering
      {Phoenix.PubSub, ...},
      {DNSCluster, query: Application.get_env(:hello_elixir, :dns_cluster_query) || :ignore},
      HelloElixirWeb.Endpoint
    ]

    # ...
  end

  # ...
end
```

Our next step is to add the `dns_cluster_query` configuration to the file `config/runtime.exs`.

```elixir
  config :hello_elixir, dns_cluster_query: System.get_env("DNS_CLUSTER_QUERY")
```

And finally add a key to our `fly.toml` file:

```toml
[env]
  DNS_CLUSTER_QUERY = "hello-elixir.internal"
```

**REMEMBER:** Deploy your updated app so the clustering code is available, with `fly deploy`.

This configures `dns_cluster` to look for other deployed apps using the same `$FLY_APP_NAME` on the `.internal` private network.

This assumes that your `rel/env.sh.eex` file is configured to name your Elixir node using the `$FLY_APP_NAME`. We did this earlier in the "Naming Your Elixir Node" section.

Before this app can be clustered, we need more than one VM. We'll do that next!

## Running multiple VMs

There are two ways to run multiple VMs.

1. Scale our application to have multiple Fly Machines in one region.
2. Add a Machine to another region (multiple regions).

Both approaches are valid and our Elixir application doesn't change at all for the approach you choose!

Let's first start with a baseline of our single deployment.

```cmd
fly status
```
```output
...
Machines
PROCESS ID              VERSION REGION  STATE   CHECKS                  LAST UPDATED
app     6e82dd00f75687  20      sea     started 1 total, 1 passing      2023-03-16T22:01:45Z
```

### Scaling in a single region

Let's scale up to 2 VMs in our current region.

```cmd
fly scale count 2
```

Checking on the status we can see what happened.

```cmd
fly status
```
```output
...
Machines
PROCESS ID              VERSION REGION  STATE   CHECKS                  LAST UPDATED
app     5683d474b4658e  20      sea     started 1 total, 1 passing      2023-06-16T01:49:36Z
app     6e82dd00f75687  20      sea     started 1 total, 1 passing      2023-03-16T22:01:45Z
```

We now have two VMs in the same region! That was easy.

Let's make sure they are clustered together. We can check the logs:

```cmd
fly logs
```
```output
...
app[5683d474b4658e] sea [info] 21:50:21.924 [info] [libcluster:fly6pn] connected to :"fly-elixir@fdaa:0:1da8:a7b:ac2:f901:4bf7:2"
...
```

But that's not as rewarding as seeing it from inside a node. From an IEx shell, we can ask the node we're connected to, what other nodes it can see.

```cmd
fly ssh console --pty -C "/app/bin/hello_elixir remote"
```

```elixir
iex(fly-elixir@fdaa:0:1da8:a7b:ac2:f901:4bf7:2)1> Node.list
[:"fly-elixir@fdaa:0:1da8:a7b:ac4:eb41:19d3:2"]
```

I included the IEx prompt because it shows the IP address of the node I'm connected to. Then getting the `Node.list` returns the other node. Our two VMs are connected and clustered!

### Scaling to multiple regions

Fly.io makes it super easy to run VMs of your applications physically closer to your users. Through the magic of DNS, users are directed to the nearest [region](/docs/reference/regions/) where your application is located.

Starting back from our baseline of a single VM running in `sea` which is Seattle, Washington (US), I'll add the region `ewr` which is NJ (US). I can do this by cloning the existing Fly Machine into my desired region:

```cmd
fly machine clone 6e82dd00f75687 --region ewr
```

Now our status shows we have two Machines spread across 2 regions! This puts a VM on both coasts of the US.

```cmd
fly status
```
```output
...
Machines
PROCESS ID              VERSION REGION  STATE   CHECKS                  LAST UPDATED
app     0e2869ea63d486  20      ewr     started 1 total, 1 passing      2023-06-16T01:56:19Z
app     6e82dd00f75687  20      sea     started 1 total, 1 passing      2023-03-16T22:01:45Z
```

Let's ensure they are clustered together.

```cmd
fly ssh console --pty -C "/app/bin/hello_elixir remote"
```

```elixir
iex(fly-elixir@fdaa:0:1da8:a7b:ac2:cdf6:c422:2)1> Node.list
[:"fly-elixir@fdaa:0:1da8:a7b:ab2:a8e:6666:2"]
```

We have two VMs of our application deployed to the West and East coasts of the North American continent and they are clustered together! Our users will automatically be directed to the server nearest them. That is so cool!

## The cookie situation

Before two Elixir nodes **can** cluster together, they must share a secret cookie. The cookie itself isn't meant to be a super secret encryption key or anything like that, it's designed to let us create multiple sets of small clusters on the same network that don't all just connect together. Different cookies means different clusters. For instance, only the nodes that all use the cookie `abc` will connect together.

For us, this means that in order for `my_remote` node to connect to the cluster on Fly, we need to share the same cookie value used in production.

### The cookie problem

When we build a `mix release`, it generates a long random string for the cookie value. When we **re-run** the `mix release` command, it keeps the same cookie value. That is, when we don't run it in Docker. The Dockerfile we're using is building a fresh release every time we run it. That's kind of the point of a Docker container. So **our cookie value is being randomly generated every time we deploy**. This means after every deploy, we would have to figure out what the new cookie value is so our local node can use it.

### The cookie solution

The easiest solution here is to **specify** the value to use for our cookie. One that we will know outside of the build and that won't keep changing on us.

## Making the cookie changes

If we read the [Mix.Tasks.Release docs](https://hexdocs.pm/mix/Mix.Tasks.Release.html#module-options), in the `:cookie` section we learn that if we provide an ENV named `RELEASE_COOKIE`, it will be used. If that ENV is not found, it falls back to the randomly generated one.

To generate the cookie string we will use this Elixir command:

```elixir
Base.url_encode64(:crypto.strong_rand_bytes(40))
```

To provide the ENV named `RELEASE_COOKIE` inside the running app, after generating the cookie, we can either:
- [Put it as a secret](https://fly.io/docs/apps/secrets/#set-secrets) inside project settings under the `RELEASE_COOKIE` name, or
- Store it in our `fly.toml` file like this:

```toml
[env]
  RELEASE_COOKIE = "my-app-cookie"
```

After setting up the ENV and deploying the application, we can verify that the cookie is being used by getting an [IEx shell into our running server](/docs/elixir/the-basics/iex-into-running-app/) and issuing the following command:

```elixir
Node.get_cookie()
```

This shows the cookie being used at runtime.

We can also check list of connected nodes by running the following command:

```elixir
Node.list()
```

An empty list means the node has no connections. If you are sure that there is more then one node running, you could proceed to [Troubleshooting](/docs/elixir/the-basics/troubleshooting/) documentation.

With a known and unchanging cookie deployed in our application, we are ready for the next step!

### Important IPv6 settings

The `flyctl` command attempts to modify your project's Dockerfile and append the following lines:

```Dockerfile
# Appended by flyctl
ENV ECTO_IPV6 true
ENV ERL_AFLAGS "-proto_dist inet6_tcp"
```

If you customized your Dockerfile or launched without the Dockerfile, this setting may not have been set for you. These values are important and enable your Elixir app to work smoothly in Fly's private IPv6 network.

Check for this If you encounter network related errors like this:

```
Could not contact remote node my-app@fdaa:0:31d4:a5b:9d36:7c1e:f284:2, reason: :nodedown. Aborting...
```

If you have non-empty list with all of your running nodes - congratulations, you have successfully set up the clustering!