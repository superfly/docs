---
title: Do Interesting Things with Livebook and Your Production App
layout: framework_docs
order: 7
objective: Guide shows interesting things we can do when Livebook connects to our deployed app running on Fly.
author: mark
categories:
  - elixir
  - livebook
date: 2021-06-22
---

[Livebook](https://livebook.dev/) is an exciting advancement in the Elixir community. It was created for the Elixir machine learning library [nx](https://github.com/elixir-nx/nx). You can think of it as Elixir's version of [Jupyter Notebooks](https://jupyter.org/).

Livebook ends up being very flexible and powerful. Because Elixir nodes can easily be clustered together, you can run Livebook on your local machine, connect it to your Elixir servers, and do some really interesting things.

Once you have [Livebook connected to your app on Fly](), you are ready to start playing!

## Getting Started with Livebook

Once you have Livebook running locally, **visit the "Learn" section** for examples of things you can do. Also, check out the [Livebook News](https://news.livebook.dev/) to find interesting developments and to spark new ideas.

Here are a few ideas of things you can do when Livebook is connected to your server.

- Query your users grouping by an interesting attribute and graph it.
- Chart user sign-ups over time.
- Analyze customer orders in a table.
- Create scripts in the form of notebooks to run common administrative commands.

## Business Intelligence Through Livebook

Let's walk through using Livebook to get Business Intelligence (BI) data from your Elixir app.

### Visualization Setup

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

### Starting Your Analysis Notebook

While you are figuring out **what** you want to examine in your app, you can explore it locally on your dev machine. Once you start, you may find you want to update your project code. Also, while playing locally, you reduce the chance of a badly structured query negatively impacting your live system.

I like [starting Livebook using the EScript method](https://github.com/livebook-dev/livebook#escript). Once installed, in a terminal you just go to the directory where your project's source code lives and start Livebook from there.

```cmd
livebook server
```

#### Create a Notebook

Open Livebook in a browser and create a "New notebook". For the first notebook, let's keep it really generic because I don't know what makes sense for your project.

Name the notebook something like "Exploring Data". Create a section for "Setup" and one for "Analysis".

Save the notebook with your project. I suggest creating a "notebook" folder to hold them so they can be checked in with your project and shared with the team.

#### Connect to Your Project

At this point, we haven't connected to your project yet so you can't access your code. Let's do that now. Click the "Runtime settings" button.

![Livebook runtime connection](/docs/images/livebook-data-analysis-runtime-click.png?card&centered)

Choose "Mix standalone" and click "Connect". If you started Livebook from your project's directory, it should already be in the right location for the mix project. Assuming your application compiles, it starts a runtime with your project's code available!

#### Your First Analysis

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

### Getting Started with VegaLite

If the VegaLite code looks scary, don't worry! I'm actually a total VegaLite noob! Livebook includes some built-in notebooks you should check out for code examples on how to structure data and configure VegaLite for the visualization you want.

![VegaLite examples](/docs/images/livebook-vegalite-examples.png?card&2/3&centered)

Then I customized a little using the [VegaLite docs](https://vega.github.io/vega-lite/docs/) and [examples](https://vega.github.io/vega-lite/examples/).

### Summary

Livebook is an awesome tool for BI on your Elixir applications. Because it's going directly to your **code** and not just your **data**, you can use your code to query integrated services like Stripe and do awesome things!
