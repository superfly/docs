---
title: Cookbooks
layout: framework_docs
order: 4
status: alpha
---

It is official.  Rails 7.1 will have
[default dockerfiles](https://github.com/rails/rails/commit/4f3af4a67f227ed7998fed570b9aa671e1b74117).  While there is much
[polishing](https://community.fly.io/t/preparations-for-rails-7-1/9512) to be done, the direction is clear:
going forward, Rails applications will include Dockerfiles.

For a large number of people that will move the task of learning Dockerfiles from something that needs to be done someday to something that is important to have at least a working knowledge of relatively soon.

There is a lot of good docs out there, ranging from
[deep dives](https://docs.docker.com/get-started/overview/) to
[prepackaged solutions](https://evilmartians.com/chronicles/ruby-on-whales-docker-for-ruby-rails-development).

Fly Rails cookbooks aspire to be different.  In each, you will start with a minimal Dockerfile that focuses on one topic.  And you wil be introduced to a small number of new alternatives, exploring different tradeoffs or
use cases.

While this tutorial is anchored by focusing on deploying Ruby on Rails on
fly.io, the concepts apply to other frameworks and other cloud providers. 

For best results, you are encouraged to try out each step.  To do so, you will need to [Log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).  Nothing you do in this tutorial will exceed the [Free Allowances](https://fly.io/docs/about/pricing/#free-allowances) provided.

While you are welcome to explore these cookbooks in any
order, if the concept of multi-stage docker builds is
new to you starting with the first cookbook will make
understading the rest easier. 

Let's get started.

## Cookbooks

  * [Minimal Rails Application](./minimial.html.md)