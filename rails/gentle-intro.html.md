---
title: Gentle Introduction
layout: framework_docs_overview
toc: false
order: 1
---

In this guide we'll develop and deploy a Rails application that first
demonstrates a trivial view, then scaffolds a database table, and finally makes
use of [Turbo Streams](https://turbo.hotwired.dev/handbook/streams) to dynamically
update pages.

In order to start working with Fly you will need `flyctl`, our CLI app for managing apps on Fly. If you've already installed it, carry on. If not, hop over to [our installation guide](/docs/getting-started/installing-flyctl/). Once thats installed you'll want to [log in to Fly](/docs/getting-started/log-in-to-fly/).

<div class="callout">
Before proceeding, something to be aware of.  While Rails is [Optimized for Programmer happiness](https://rubyonrails.org/doctrine#optimize-for-programmer-happiness), it isn't particularly optimized for minimum RAM consumption. If you wish to deploy an app of any appreciable size or even make extensive use of features like `rails console`, you likely will hit RAM limits on your machine.  And when applications run out of memory, they tend to behave unpredictably as error recovery actions will often also fail due to lack of memory.

The command to be used to address this is:

```fly scale vm shared-cpu-1x --memory 512```

While this does take you beyond what is offered with the free offering, the current
cost of adding this additional memory to what otherwise would be a free machine runs about five cents a day, or about a buck and a half a month, or less than twenty dollars a year.
</div>

Once you have logged on, here are the three steps and a recap.  Proceed with the first one, then on to the next.
