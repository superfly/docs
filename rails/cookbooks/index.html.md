---
title: Cookbooks
layout: framework_docs
order: 4
---

It is official.  Rails 7.1 will have
[default dockerfiles](https://github.com/rails/rails/commit/4f3af4a67f227ed7998fed570b9aa671e1b74117).  While there is much
[polishing](https://community.fly.io/t/preparations-for-rails-7-1/9512) to be done, the direction is clear:
going forward, Rails applications will include Dockerfiles.

For a large number of people that will move the task of learning Dockerfiles from something that needs to be done someday to something that is important to have at least a working knowledge of relatively soon.

There is a lot of good docs out there.  A good place to start is with
[Rails on Docker](https://fly.io/ruby-dispatch/rails-on-docker/) which
will walk you through the current Rails template.

Fly Rails cookbooks are for those that wish to explore further.  In each, you
will start with a minimal Dockerfile that focuses on one topic.  And you wil be
introduced to a small number of new alternatives, exploring different tradeoffs
or use cases.

While this tutorial is anchored by focusing on deploying Ruby on Rails on
fly.io, the concepts apply to other frameworks and other cloud providers. 

While you are welcome to explore these cookbooks in any
order, if the concept of multi-stage docker builds is
new to you starting with the first cookbook will make
understading the rest easier. 

If you are comfortable skpping the first cookbook, all cookbooks start with an
empty directory and a seed `Dockerfile`.  Run `fly launch` to create an
application, and then proceed from there, running `fly deploy` after you make
changes.  The recipies the follow contain fragments that can be added
to multiple cookbooks.

For best results, you are encouraged to try out each step.  To do so, you will need to [Log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).  Nothing you do in this tutorial will exceed the [Free Allowances](https://fly.io/docs/about/pricing/#free-allowances) provided.
These cookbooks can be more than mere educational materials.  Using throwaway applications is
often better than experimenting in production when you want to make configuration changes.
Starting a minimal application, using `flyctl ssh console` to shell into that machine and
explore and make changes, rerunning `fly deploy` to reset the machine when those experiments
fail and making changes to your `Dockerfile` and `fly.toml` when things work is an effective
way to validate an aproach before making changes to your application.  

Let's get started.

## Cookbooks

  * [Minimal](./minimal) - full ruby, slim ruby, multi-stage build
  * [Databases](./databases) - sqlite3, postgresql, mysql
  * [Node](./node) - support for esbuild, rollup, webpack
  * [API](./api) - api only rails servers with web front end

## Recipes

  * [Sources](./sources) - adding sources from outside of your `Dockerfile`.
  * [Optimizing builds](./build) - ordering, splitting, staging, and caching.
  * [Optimizing deployments](./deploy) - jemmalloc, yjit, swap.

A Rails generator incorporating these techniques can be found at
[dockerfile-rails](https://github.com/rubys/dockerfile-rails), and
is being proposed as the generator to be included by default in
Rails 7.1.
