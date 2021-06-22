---
title: Connecting Livebook to Your App in Production
layout: docs
sitemap: false
nav: firecracker
author: mark
categories:
  - elixir
date: 2021-06-22
---

[Livebook](https://github.com/elixir-nx/livebook) is an exciting advancement in the Elixir community. It was created for the Elixir machine learning library [nx](https://github.com/elixir-nx/nx). You can think of it as Elixir's version of [Jupyter Notebooks](https://jupyter.org/).

Livebook ends up being very flexible and powerful. Because Elixir nodes can easily be clustered together, you can run Livebook on your local machine, connect it to your Elixir servers, and do some really interesting things.

Visualizing the setup:

![WireGuard livebook connection](/docs/images/elixir-livebook-to-server-fly-overview.png?2/3&centered)

## Requirements

There are a few requirements for this to work.

- **Livebook requires Elixir version 1.12 or higher**. Livebook runs locally on your machine, so that part is easy to control. However, the **server** side needs to have the same version of Elixir as well. When Livebook connects to the server, it loads code into the server environment as well. So your server version of Elixir also needs to be 1.12 or higher. I recommend making your local version be the same as the production version to reduce potential problems.
- **Known cookie value on your server**. Livebook needs to know the cookie value used on the server. Follow [this guide to give your app a static cookie value](/docs/app-guides/elixir-static-cookie/).
- **WireGuard setup on your local machine**. Follow the Fly.io [Private Network VPN](/docs/reference/privatenetwork/#private-network-vpn) guide to walk through that.

## Local Livebook

There are several ways to run [Livebook](https://github.com/elixir-nx/livebook). In this guide, we will clone the Livebook project locally and run it as a local project. This lets us override certain settings at startup. We are not modifying or forking the code, just running it.

### Clone Livebook Locally

```cmd
git clone git@github.com:elixir-nx/livebook.git
```

### Starting Livebook

Working with a local clone of the source code, here's how we start Livebook.

```cmd
MIX_ENV=prod elixir --erl "-proto_dist inet6_tcp" --name livebook@127.0.0.1 -S mix phx.server
```

The special customization we need is the `--erl` settings passed to the beam on startup. The `--name` setting gives our local node a fully qualified name, which the UI detects and changes how it attaches to the server.

Once started, use the link it generates in the console to connect to it. The livebook link in the console looks something like this:

```
[Livebook] Application running at http://localhost:8080/?token=uzbwvvpexj7mdftwjilezi4qaygt2bfc
```

### Create or Load a Notebook

Let's create a new notebook to test the remote connection.

Create a new notebook titled, "Remote Connect Test" and add a Section.

On the left side, click the "Runtime settings" graphic pictured below:

![Runtime settings](/docs/images/livebook-runtime-selection.png?centered&card)

Before we can run any Elixir code, we need to connect to the remote server. To connect to the remote server, we use the "Attached node" mode (pictured as #1 below).

![Attach steps](/docs/images/livebook-runtime-attach-steps.png?centered&card)

We need to provide 2 additional pieces of information before we can connect.

1. Attached node mode is used
2. Name - Our node's name
3. Cookie - The cookie value used by the deployed server

### Getting the Node Name

Next we need the node name and private IP address.

To list your deployed apps:

```cmd
fly apps list
```
```output
...
icy-leaf-7381                personal     running 49m26s ago
```

Get the private IPv6 address for the desired app.

```cmd
fly ips private --app icy-leaf-7381
```
```output
ID       REGION IP
44040812 sjc(B) fdaa:0:1da8:a7b:ad1:4404:812:2
```

Combine the app name with the private IPv6 address to get the full node name. For our example here, it would be:

```
icy-leaf-7381@fdaa:0:1da8:a7b:ad1:4404:812:2
```

### Using the Cookie

You also need the cookie used by the server. Follow [this guide](/docs/app-guides/elixir-static-cookie/) for setting that up for your app.

## Attaching to a Fly Server

At this point, make sure your WireGuard connection to Fly is up.

When you have the name and cookie, enter those and "Connect" to the server.

![Attached to remote](/docs/images/livebook-runtime-attached.png?centered&card)

**REMEMBER**: Each time you deploy your app, the private IP will change. You will need to get the new IP before you can connect again.

Once connected, you have code completion available in the Elixir cells for the app you are connected to. The HelloElixir app doesn't have anything useful to run so we can just prove to ourselves that our code is being executed remotely.

Add the following code to an Elixir cell and execute it.

```elixir
require Logger
Logger.info("Testing logger")
```

Now, check the logs of your production app. You should find your logger output there!


```cmd
fly logs
```
```output
...
2021-06-21T22:47:21.415426797Z app[44040812] sjc [info] 22:47:21.414 [info] Testing logger
```

## Success!

You successfully executed Elixir code through Livebook connected to a remote server running on Fly.io!

## Do Interesting Things

The [Getting Started](https://github.com/elixir-nx/livebook#getting-started) section of the Livebook page links to video examples showing more interesting things you can do with Livebook. Check those out to get a better idea of what can be done.

Here are a few ideas of things you can do when Livebook is connected to your server.

- Query your users grouping by an interesting attribute and graph it.
- Chart user sign-ups over time.
- Analyze customer orders in a table.
- Create scripts in the form of notebooks to run common administrative commands.

## Troubleshooting

If you have problems connecting, here are a few things to check:

- Ensure your WireGuard connection is up
- Check that the version of Elixir on the server is 1.12 or higher
- Check that the version of Elixir on the client matches the server
- If you re-deployed, you need to get the new IP address for the deployed app
- Check the server logs. Failed connections may still log errors at the server.




