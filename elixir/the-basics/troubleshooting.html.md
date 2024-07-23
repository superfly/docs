---
title: Troubleshooting
layout: framework_docs
order: 10
redirect_from: /docs/elixir/getting-started/troubleshooting/
blog_path: /phoenix-files
objective: Common troubleshooting issues and resources for getting unstuck.
---

Some problems are harder to diagnose because they deal with [Elixir releases](https://hexdocs.pm/mix/master/Mix.Tasks.Release.html+external) or Docker build problems. Typically, you don't run the application that way locally, so you only encounter those problems when it's time to deploy.

Here are a few tips to help diagnose and identify problems.

- Run `mix release` locally on your project.
- Build the Dockerfile locally to verify it builds correctly. `docker build .`
- Check the `:prod` config in `config/runtime.exs`, which is not used locally. Carefully review it.
- Run `fly logs` to check server logs.

For diagnosing database app issues, refer to the [Postgres Monitoring](/docs/postgres/managing/monitoring/) information.

Here's a quick hit list of commands to help:

- Run `fly logs -a <pg-db-name>` to check database app's server logs.
- Run `fly checks list -a <pg-db-name>` to check the database app's health.
- Run `fly status -a <pg-db-name> --all` to see if any VMs failed.
- Run `fly vm status <id> -a <pg-db-name>` to debug a specific VM.

## _Diagnosis Tip_

Most difficulties center around application config. Applications generated with an older version of Phoenix are configured differently than a newly generated app. If you have problems like connecting to your database, usually an IPv6 configuration update is needed.

The internal networks at Fly.io use a IPv6 addresses. Elixir/OTP needs some config to work smoothly.

One way to identify an issue is to generate a new Elixir application using a current version of Phoenix. Deploy that to Fly.io with a database. With that, you have a local working example to compare against. Don't worry, you can easily [`destroy`](/docs/flyctl/apps-destroy/) the test app when you're ready to.

Suggested files to pay attention to when looking for config differences.

- `config/config.exs`
- `config/prod.exs`
- `config/runtime.exs`
- `Dockerfile`
- `mix.exs`


## _Not Enough Connections_

A common failure mode is the application exhausting the number of free connections, your default `fly.toml` has the following settings:
```toml
  [services.concurrency]
    hard_limit = 50
    soft_limit = 25
    type = "connections"
```

Setting the `hard_limit` and `soft_limit` closer to your needs will free up the number of live connections per node. A safe starting point could be 1000 for the hard_limit and 975 for the soft_limit. The "right" amount depends on how much data is actively stored in the LiveView processes. That value will vary for each application.

## _Clustering_

Here are some troubleshooting tips when working with [Clustering](/docs/elixir/the-basics/clustering/).

When using [IEx to remote into a running application](/docs/elixir/the-basics/iex-into-running-app/) to diagnose connection issues, note if you see this warning when connecting:

```
warning: the --remsh option will be ignored because IEx is running on limited shell
```

When that warning is present, the Elixir node we are connecting to is not the remote running node. A new node was launched when the remote shell request was ignored. Refer to the [docs here about the `--pty`](/docs/elixir/the-basics/iex-into-running-app/) option.

Another indication of this situation is when typing `Node.self()`, the name of the node is returned with a prefix similar to "rem-ea46-".
Example:

```
:"rem-ea46-hello_elixir@fdaa:0:1da8:a7b:115:5641:7e85:2"
```

A working remote shell will return a node name more like this:
```
:"hello_elixir@fdaa:0:1da8:a7b:115:5641:7e85:2"
```

### Testing Node Connectivity

Using `libcluster` is an easy way to [auto-cluster](#clustering) an Elixir application. However, going through the process manually can help diagnose issues.

We can open two terminals locally on our machine. In terminal A, we get an [IEx terminal](/docs/elixir/the-basics/iex-into-running-app/) to one node. Then in terminal B, we get an IEx terminal to a different node.

In each terminal, we can ask the node for it's name:
```
Node.self
```

Then, taking the response node in terminal A, we can explicitly try to connect through terminal B (on the other node).

That command might look like this:
```
Node.connect(:"result-from-terminal-A@ipvs-address")
```

If the result is `true` then it either connected to the other node or we entered into the wrong terminal and it says it's connected to itself.

If we received a `true` response, we can check the list of connected nodes using this command:
```
Node.list()
```

An empty list means is has no connections.

During the process, make note of any logged messages that might help explain why the two nodes can't connect.
