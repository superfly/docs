---
title: Migrate from Amazon
layout: navigable_docs
objective: Move your EC2 application servers, RDS postgres server, and Redis cache from Amazon Web Services to Fly.io
order: 2
---

This guide runs you through how to migrate a basic Rails application off of Amazon Web Services and onto Fly. It assumes you're running the following services on Amazon:

* Web application server on EC2
* Postgres database on RDS
* Redis in non-persistent mode
* Custom domain

If your application is running with more services, additional work may be needed to migrate your application off AWS.

## Migrating your app

The steps below run you through the process of migrating your Rails app from AWS to Fly.
