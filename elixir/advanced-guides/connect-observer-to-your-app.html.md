---
title: Connecting Observer to Your App in Production
layout: framework_docs
order: 5
objective: Guide for connecting a locally running Observer instance to your application running on Fly.
redirect_from: /docs/app-guides/elixir-observer-connection-to-your-app/
author: mark
categories:
  - elixir
date: 2021-06-15
---

Elixir, Erlang, and really just the BEAM has a slick feature called "[Observer](https://elixir-lang.org/getting-started/debugging.html#observer)". It's a powerful UI that connects to a running Elixir or Erlang node and let's you "observe" what's going on inside. It has some limited ability to modify things as well, most notably you can kill running processes. This can help when something is misbehaving or you just want to play "chaos monkey" and kill parts of the system to see how it recovers.

This shows a process tree for the application. Using this I can inspect individual processes or even kill them!

![Observer screen shot](/docs/images/observer-tictac-local-application-pane.webp?card&2/3&centered)

One very cool way to run Observer is to run it on your local machine (which has the ability to display the UI) and connect to a production server (with no windowing UI available) and "observe" it from a distance. So yeah... have a problem in production? Not sure what's going on? You can literally tunnel in, crack the lid and poke, prod, and peek around to see what's going on.

Next we'll cover how your project can support this feature and see how to do it on Fly.io!

## What We Will Do

Fly.io natively supports [WireGuard](https://www.wireguard.com/), Jason Donenfeld's amazing VPN protocol. If you’ve ever lost hours of your life trying to set up an IPSec VPN, you’ll be blown away by how easy WireGuard is. It’s so flexible and performant that Fly uses it as our network fabric. And it’s supported on [every major platform](https://www.wireguard.com/install/), including macOS, iOS, Windows, and Linux. What that means for you is that if your app runs on Fly, you can open a secure, private, direct connection from your dev machine to your production network, in less time than it took me to write this paragraph. Cool, right?

This is what we're going to do.

![WireGuard observer connection](/docs/images/elixir-wireguard-observer-tunnel.webp?2/3&centered)

We will bring up a secure WireGuard tunnel that links to your servers on Fly. In this graphic, there are two `my_app` Elixir nodes clustered together running on Fly.

From the local machine, we can open an IEx terminal configured to **join** that cluster of remote Elixir nodes. Our local machine supports running Observer and drawing the UI. We use our local observer to talk to the remote nodes in the cluster!

Let's do it. This will be fun!

## Sharing a Cookie

The deployed servers running on Fly need a predictable, stable, known cookie value used for allowing nodes to join each other to create a cluster. This is required for your local node to be able to connect to the remote nodes. Your local node needs the cookie value too!

See [this guide on creating a static cookie value](/docs/elixir/the-basics/clustering/#the-cookie-situation) in your Elixir project.

## WireGuard Tunnel

Setup WireGuard on your local machine. Follow the Fly.io [Private Network VPN](/docs/networking/private-networking/#private-network-vpn) guide to walk through that.

## Connecting to Production

To make the connection, there are several steps in the process. We'll create a short script to automate the process for us!

### Knowing the Cookie

Our script needs to know the cookie value. The easiest way to do this and keep the script generic is to set the value in the ENV. This lets us copy the script unchanged to multiple projects.

To help manage project-specific ENV values, I like using [direnv](https://direnv.net/). When changing into a directory with an `.envrc` file, it loads those values into my ENV, when I leave that directory, it unloads them. This means I can set a COOKIE value (or other config) specific to each project and it works great.

You don't have to use a tool like [`direnv`](https://direnv.net/) though. The `./observer` script file can be customized to set the COOKIE value explicitly if you prefer that approach. Refer to the full [script file here](https://github.com/fly-apps/hello_elixir/blob/main/observer#L14) in the comments to see how you can  do that.

### Script File

This is a bash script to kick off a correctly configured local IEx session, connect a new local node to the remote cluster, and start Observer.

Here's a copy of the **[`observer`](https://github.com/fly-apps/hello_elixir/blob/main/observer) script file**.

This should work fine on Linux and MacOS. On Windows, if you are using [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) then it will work because it's Linux. Otherwise, refer to the manual steps outlined below.

After creating the file locally, make the script file executable:

```cmd
chmod +x observer
```

Execute the script:

```cmd
./observer
```
```output
Attempting to connect to hello-elixir-01HR8CXEYKQ9RXYQFEWSE5PTE0@fdaa:0:1da8:a7b:a160:73d2:f48b:2
Erlang/OTP 26 [erts-14.2.2] [source] [64-bit] [smp:4:4] [ds:4:4:10] [async-threads:1] [jit]

Node Connected?: true
Connected Nodes: [:"hello-elixir-01HR8CXEYKQ9RXYQFEWSE5PTE0@fdaa:0:1da8:a7b:a160:73d2:f48b:2"]

...

Interactive Elixir (1.16.1) - press Ctrl+C to exit (type h() ENTER for help)
```

When observer first opens, it might looks something like this:

![Observer connected to local node](/docs/images/observer-local-node.webp?centered)

Notice that the window title shows `my_remote@...`? This means it's showing the stats of my local IEx node that isn't actually running any of my code. So this data isn't very interesting yet.

If everything worked and it's connected, under the Nodes menu you should see the connected remote node.

![Observer connected to local node](/docs/images/observer-local-node-menu.webp?2/3&centered)

When the remote node is selected, then all the stats and information changes to reflect what's going on in the selected node.

![Observer connected to local node](/docs/images/observer-local-node-connected.webp?centered)

It worked! I'm seeing the information for the production node!

### Success!

Let's review briefly what was accomplished.

* I setup a WireGuard tunnel from my personal computer into my private Fly network.
* I started a local Elixir node that shares the same cookie value.
* My local node connected over WireGuard to the production cluster.
* I launched Observer.

Now, using WireGuard and this script, I can easily launch Observer and observe any node in the cluster!

## Disconnecting

When done, close Observer. It leaves you with an open IEx shell that is still connected to the remote cluster. You can safely CTRL+C, CTRL+C to exit it.

At this point you can shutdown your WireGuard connection as well if desired.

## Tips and Troubleshooting

The script is a simple tool to make it easy to launch observer and connect to the cluster. It doesn't diagnose or handle all the things that can fail. For instance, if your WireGuard connection isn't up, it just won't find the server but it also won't complain. If you encounter issues, you can go through the manual steps below to help diagnose any problems.

In order for everything to work, here's the checklist overview:

- Your wireguard connection must be up.
- Your application defines a release that specifies the cookie value to use.
- The local COOKIE value must be the same as the cookie value used in production.
- Observer needs to be working in your local environment. That requires WxWidget support in your Erlang install.

### Networking and the BEAM

Fly.io uses an IPv6 network internally for private IPs. The BEAM needs IPv6 support to be enabled explicitly. That's taken care of for the server through the Dockerfile. Locally, however, it needs to be enabled as well so the machine running Observer can actually _connect_ to the remote node.

The issue is, if IPv6 support is enabled globally, like in a `.bashrc` file, then setting it in the `observer` script essentially flips it OFF. If NOT set globally, then it should be set in the script. Choose the version that fits your situation by modifying the script.

It's the `--erl "-proto_dist inet6_tcp"` portion.

Example:
```
iex --erl "-proto_dist inet6_tcp" --sname my_remote --cookie ${COOKIE} -e "IO.inspect(Node.connect(:'${FULL_NODE_NAME}'), label: \"Node Connected?\"); IO.inspect(Node.list(), label: \"Connected Nodes\"); :observer.start"
```

Versus without the `--erl` option:
```
iex --sname my_remote --cookie ${COOKIE} -e "IO.inspect(Node.connect(:'${FULL_NODE_NAME}'), label: \"Node Connected?\"); IO.inspect(Node.list(), label: \"Connected Nodes\"); :observer.start"
```

### Manual Script Steps

If you encounter issues, this can help you diagnose what's going on. The script automates 4 things.

1. Getting the cookie value from the ENV - make sure the correct cookie value is either available in the ENV or explicitly set in the script.
2. Uses the `fly status` command to get the app name, Docker image ref, and the first private IP. This is used to build the fully qualified node name. You only need one IP address. Once you join to any node you are introduced and connected to all of them.
3. Set up a local node and executes multiple commands.
  1. It runs a command like `Node.connect(:'APP_NAME-IMAGE_REF@IPv6_ADDRESS')` to connect to the remote node. It returns `true` when it succeeds or `false` when it fails. The app name and the IP address used to make up the node's name are assembled from the previous steps.
  2. Launch observer with the command `:observer.start`. If this fails, check the other tip for WxWidgets.

To do it manually, once you get the IP address, you can customize the following command to launch Observer.

```
iex --erl "-proto_dist inet6_tcp" --sname my_remote --cookie ${YOUR-COOKIE-VALUE} -e "IO.inspect(Node.connect(:'${FULL_NODE_NAME}'), label: \"Node Connected?\"); :observer.start"
```

You need to substitute in your `YOUR-COOKIE-VALUE` value, the `FULL_NODE_NAME`.

### WxWidgets Support

If you are using [asdf-vm](https://asdf-vm.com/) for managing your Elixir and Erlang versions, check out the [Erlang plugin's documentation](https://github.com/asdf-vm/asdf-erlang) for getting WxWidget support in your Erlang environment. This is required for using Observer.

To test if WxWidgets and observer is working correctly on you local machine, try the following.

Start IEx:

```
iex
```

Start observer:

```
:observer.start
```

It should bring Observer running on your machine. It won't be connected to
anything else, but it verifies that the libraries and dependencies are working.
