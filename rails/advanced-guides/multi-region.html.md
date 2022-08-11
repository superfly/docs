---
title: Multi-region deployments
layout: framework_docs
---

Rails applications that are successful often end up with users from all parts of the world. Learn how to make them fast and responsive for everybody on the planet.

## The `fly-ruby` gem

The [fly-ruby gem](https://github.com/superfly/fly-ruby) provides a basic toolkit for making Rails applications across multiple regions. Read [Run Ordinary Rails Apps Globally](/blog/run-ordinary-rails-apps-globally/) to see how the gem can be used in a Rails application to make it work across multiple regions.

## Redis

Since many Rails applications depend on Redis for caching, background workers, and Action Cable, it's important to think through deploying Redis globally.

* https://fly.io/blog/last-mile-redis/

## Postgres

Postgres also requires consideration for global deployments.

* https://fly.io/docs/getting-started/multi-region-databases/
