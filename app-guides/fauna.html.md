---
title: Fauna and Fly
layout: docs
sitemap: false
nav: firecracker
categories:
  - database
---

[Fauna](https://fauna.com/) is a distributed relational database with a document data model, and delivered as an API. Databases created in Fauna automatically get three geographically distributed replicas with active-active writes and ACID compliance, making it a powerful complement to Fly.io in serving low latency reads and writes for dynamic global applications.

## Starter kit

We've provided [this starter kit](https://github.com/fauna-labs/express-ts-fly-io-starter) to help you launch, as quickly as possible, a Fly App that uses Fauna as the database backend. Before you start, read the short section below to learn how Fauna and Fly.io makes for a great combination when building low latency, dynamic global applications.  

## Region Groups

A Fauna Region Group refers to the locality footprint of where the replicas are located, and allows you to control where your data resides, making it possible to comply with data locality legislation, such as the General Data Protection Regulation ([GDPR](https://gdpr-info.eu/)).

![Fauna Region Group](docs/images/fauna_region_groups.png)

When you create a database in Fauna, you choose which Region Group you want the database created in. When you query the database, your request is automatically routed to the closest replica (within the Region Group) based on latency. This functionality comes out-of-the-box without any special configuration or deployment strategy.

## Scale your deployment to match the Fauna footprint

Currently, Fauna provides 2 choices of Regions Groups, US and EU. The table below lists the Fly regions that are closest to the Fauna replicas of each respective Region Group:

| Fauna Region Group | Deploy on Fly Regions |
|--------------------|-----------------------|
| EU                 | lhr, arn, fra         |
| US                 | sjc, ord, iad         |

To take full advantage of Fauna's distributed footprint, you should deploy your app on 3 Fly.io regions as well, and as close as possible to the Region Groups' replicas. Follow the starter kit's [README](https://github.com/fauna-labs/express-ts-fly-io-starter#scale-your-deployment-to-match-the-fauna-footprint) for details on how that's easily configured.
