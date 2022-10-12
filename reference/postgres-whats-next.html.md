---
title: You've deployed Fly Postgres. Now what?
layout: docs
sitemap: false
nav: firecracker
---

Congrats! Your Postgres app is up and running on Fly.io. Now there are a few things you should know before moving forward.

`fly pg create` helped you setup a PostgresSQL database cluster, but you can bring your own; this is an automated Postgres application. This is not a managed database. If Postgres crashes because it ran out of memory or disk space, you'll need to do a little work to get it back.

Fly Postgres is a Fly app with flyctl sugar on top to help you bootstrap your much-needed database. It comes with most commonly used functionality (replication, failover, metrics, monitoring and daily snapshots), but you can extend it anytime if needed.

The app template is fully open source. Just fork [fly-apps/postgres-ha](https://github.com/fly-apps/postgres-ha) and add whatever meets your needs. Feel free to contribute it back too. One caveat, though, is that once you fork you won't be able to use `fly pg create` to bootstrap a cluster from your image. You can update your app with your new image using `fly deploy --image` right after, though.

Usual reasons to fork the fly app:

* Configuration tuning (pool sizes, connection limits, …)
* Adding Postgres extensions like Timescale and so on
* Adding PGBouncer to the mix

More things you need to know:

* We won't upgrade your Postgres cluster to a new version automatically. You can run `fly image update` to get the latest available point release
* We won't apply security patches to running clusters
* We automatically take snapshots every 24hs but you have to restore from them when needed
* We collect and expose relevant prometheus metrics but you have to setup Grafana or the likes to get monitoring dashboards and alerts.

Now, when you created your Postgres app, `flyctl` offered you the chance to create a single node cluster. That's good for development but a really bad idea on 99% production setups (unless you know what you are doing). So let me tell that again: Don't store your production data on a single node database! It will fail, badly, and your app has no chance of surviving a simple powerline failure.

Please make good use of Postgres replicas by running at least two instances. In case of node failures, a Fly Postgres cluster will automatically take the bad actor out of the picture and force a leader re-election on the healthy nodes.

Check the docs for more information: [High Availability](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#high-availability)

Looking for more? See how to:

* [Connect to Postgres](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#connecting-to-postgres)
* [Attach your app](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#attaching-an-app-to-a-postgres-app)
* [Monitor your Postgres cluster](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#monitoring)
* [Scale horizontally and vertically](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#scaling-the-postgres-cluster)
