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

## Installing Livebook

There are several ways to install and run [Livebook](https://github.com/elixir-nx/livebook). Personally, I prefer [installing Livebook as an escript](https://github.com/elixir-nx/livebook#escript). It is the most versatile and convenient. In this guide we'll cover two different approaches for running Livebook locally.

### Install as an Escript

This is the easiest way to use Livebook locally. This assumes you are doing Elixir development locally and are setup for Elixir development.

Following the Livebook [Escript README section](https://github.com/elixir-nx/livebook#escript), this is how you install Livebook.

```cmd
mix escript.install hex livebook
```

Then locally launching Livebook is:

```cmd
livebook server
```

When connecting to a Fly.io app, you need to launch it like this:

```cmd
ERL_AFLAGS="-proto_dist inet6_tcp" livebook server --name livebook@127.0.0.1
```

The special customization we need is the `ERL_AFLAGS` settings passed to the beam on startup. The `--name` setting gives our local node a fully qualified name, which the UI detects and changes how it attaches to the server.

#### Upgrading when using an Escript

When upgrading your Livebook version while using [asdf](https://asdf-vm.com/) for managing your Elixir and Erlang installs, then here's a helpful tip:

* Remove the existing `livebook` shim: `rm ~/.asdf/shims/livebook`
* Install the new version: `mix escript.install hex livebook`
* Re-shim to get the command: `asdf reshim elixir`
* Verify you have the upgrade: `livebook --version`

### Clone Livebook Locally

This step covers how to clone the Livebook project locally and run it as a local project. We are not modifying or forking the code, just running it. If you want to do development on the Livebook project itself, this is the approach to use.

```cmd
git clone git@github.com:elixir-nx/livebook.git
```

When working with a local clone of the source code, here's how we start Livebook:

```cmd
MIX_ENV=prod elixir --erl "-proto_dist inet6_tcp" --name livebook@127.0.0.1 -S mix phx.server
```

The special customization we need is the `--erl` settings passed to the beam on startup. The `--name` setting gives our local node a fully qualified name, which the UI detects and changes how it attaches to the server.


## Running Livebook

Regardless of the approach you choose, once started, Livebook generates a link in the console you use to connect to it. The Livebook link in the console looks something like this:

```
[Livebook] Application running at http://localhost:8080/?token=uzbwvvpexj7mdftwjilezi4qaygt2bfc
```

With Livebook running locally, let's get started!

### Create or Load a Notebook

Let's create a new notebook to test the remote connection.

Create a new notebook titled, "Remote Connect Test" and add a Section.

On the left side, click the "Runtime settings" as pictured below:

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

### Attaching to a Fly Server

**REMEMBER:** At this point, make sure your WireGuard connection to Fly is up!

When you have the name and cookie, enter those and "Connect" to the server.

![Attached to remote](/docs/images/livebook-runtime-attached.png?centered&card)

**REMEMBER:** Each time you deploy your app, the private IP will change. You will need to get the new IP before you can connect again.

Once connected, you have code completion available in the Elixir cells for the app you are connected to. The [HelloElixir app](https://github.com/fly-apps/hello_elixir-dockerfile) doesn't have anything useful to run so we can just prove to ourselves that our code is being executed remotely.

Add the following code to a Livebook Elixir cell and execute it.

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

### Success!

You successfully executed Elixir code through Livebook connected to a remote server running on Fly.io! The code was actually executed on the server!

## Troubleshooting Checklist

If you have problems connecting, here are a few things to check:

- Ensure your WireGuard connection is up
- Check that the version of Elixir on the server is 1.12 or higher
- Check that the version of Elixir on the client matches the server
- If you re-deployed, you need to get the new IP address for the deployed app
- Check the server logs. Failed connections may still log errors at the server.

## Do Interesting Things

The [Getting Started](https://github.com/elixir-nx/livebook#getting-started) section of the Livebook page links to video examples showing more interesting things you can do with Livebook. Check those out to get a better idea of what can be done.

Here are a few ideas of things you can do when Livebook is connected to your server.

- Query your users grouping by an interesting attribute and graph it.
- Chart user sign-ups over time.
- Analyze customer orders in a table.
- Create scripts in the form of notebooks to run common administrative commands.

### Business Intelligence Through Livebook

Let's walk through using Livebook to get Business Intelligence (BI) data from your Elixir app.

#### Visualization Setup

With [Livebook v0.2](https://github.com/livebook-dev/livebook/blob/main/CHANGELOG.md), support was added for visualizations through the Elixir packages [VegaLite](https://github.com/livebook-dev/vega_lite) and [Kino](https://github.com/livebook-dev/kino). In this example, we're connecting a locally running Livebook to our app running on Fly. In order for the visualization tools to work, these libraries need to be installed on our server.

You may have seen Livebook examples showing how we can `Mix.install` the needed graphics libraries. That doesn't work when you are attaching to a remote mix project. It's actually a good thing that we can't just `Mix.install` like that on a remote project. You wouldn't want anyone with access to attach to your live system and install random packages!

That just means we need to install the dependencies first. Add the `vega_lite` and `kino` libraries to your project's `mix.exs` file and deploy your app.

```elixir
  defp deps do
    [
      {:phoenix, "~> 1.5.6"},
      # ...

      # Graphing/charting - for Livebook or analysis
      {:vega_lite, "~> 0.1.0"},
      {:kino, "~> 0.1.0"}
    ]
  end
```

With the updated app deployed to Fly, Livebook can connect and render charts and visualizations!

#### Starting Your Analysis Notebook

While you are figuring out **what** you want to examine in your app, you can explore it locally on your dev machine. Once you start, you may find you want to update your project code. Also, while playing locally, you reduce the chance of a badly structured query negatively impacting your live system.

I like [starting Livebook using the EScript method](https://github.com/livebook-dev/livebook#escript). Once installed, in a terminal you just go to the directory where your project's source code lives and start Livebook from there.

```cmd
livebook server
```

##### Create a Notebook

Open Livebook in a browser and create a "New notebook". For the first notebook, let's keep it really generic because I don't know what makes sense for your project.

Name the notebook something like "Exploring Data". Create a section for "Setup" and one for "Analysis".

Save the notebook with your project. I suggest creating a "notebook" folder to hold them so they can be checked in with your project and shared with the team.

##### Connect to Your Project

At this point, we haven't connected to your project yet so you can't access your code. Let's do that now. Click the "Runtime settings" button.

![Livebook runtime connection](/docs/images/livebook-data-analysis-runtime-click.png?card&centered)

Choose "Mix standalone" and click "Connect". If you started Livebook from your project's directory, it should already be in the right location for the mix project. Assuming your application compiles, it starts a runtime with your project's code available!

##### Your First Analysis

This is where everything gets specific to the project. I'll walk through an example so we can see how to pull data, aggregate it, and visualize it. Then we'll turn you loose on your project!

My project contains survey-style questions. Some questions use a "personality" type field. My first goal is just to get the data and some counts to see how it's distributed.

Under **Setup**, I add an Elixir cell and the following code:

```elixir
alias VegaLite, as: Vl
alias Core.Schemas.Question
alias Core.Repo
import Ecto.Query
```

The important one for visualizations is:

```elixir
alias VegaLite, as: Vl
```

My first query groups the questions by the personality type value and returns the count.

```elixir
query =
  from(q in Question,
    group_by: q.personality,
    select: {q.personality, count(q.id)}
  )

personality_counts =
  query
  |> Repo.all()
  |> Enum.into(%{})
```

The results look like this:

```elixir
%{any: 77, extrovert: 10, introvert: 13}
```

That's helpful already, but it's still just data. I'd like to see what that looks like.

I add another Elixir cell and write the following code:

```elixir
# Convert the raw data into a Pie Chart friendly format
data =
  Enum.map(personality_counts, fn {type, count} ->
    %{"personality" => Atom.to_string(type), "value" => count}
  end)

Vl.new()
|> Vl.data_from_values(data)
|> Vl.mark(:arc)
|> Vl.encode_field(:theta, "value", type: :quantitative)
|> Vl.encode_field(:color, "personality", type: :nominal)
|> Vl.config(view: [stroke: nil])
```

The `Vl` is the VegaLite alias. Here's the result:

![Pie chart visualization](/docs/images/livebook-personality-pie-visualization.png?card&centered)

Nice! I get a better sense for the personality type distribution in the question data.

What if I want to render the data as bar charts?

```elixir
# Convert the raw data into a Bar Chart friendly format
data =
  Enum.map(personality_counts, fn {type, count} ->
    %{"Personality" => Atom.to_string(type), "Question Count" => count}
  end)

# Sort the data by counts to order the results
data = Enum.sort_by(data, & &1["Question Count"], :desc)

Vl.new(width: 300, height: 300)
|> Vl.data_from_values(data)
|> Vl.mark(:bar)
|> Vl.encode_field(:x, "Personality",
  type: :nominal,
  axis: [label_angle: 0],
  sort: [field: "Question Count", order: "descending"]
)
|> Vl.encode_field(:y, "Question Count", type: :quantitative)
```

Here's the result:

![Bar chart visualization](/docs/images/livebook-personality-bar-visualization.png?card&centered)

#### Getting Started with VegaLite

If the VegaLite code looks scary, don't worry! I'm actually a total VegaLite noob! Livebook includes some built-in notebooks you should check out for code examples on how to structure data and configure VegaLite for the visualization you want.

![VegaLite examples](/docs/images/livebook-vegalite-examples.png?card&2/3&centered)

Then I customized a little using the [VegaLite docs](https://vega.github.io/vega-lite/docs/) and [examples](https://vega.github.io/vega-lite/examples/).

#### Summary

Livebook is an awesome tool for BI on your Elixir applications. Because it's going directly to your **code** and not just your **data**, you can use your code to query integrated services like Stripe and do awesome things!
