---
title: Production and Staging Isolation
layout: framework_docs
objective: How to separate a production environment from staging, testing, dev, whatever.
order: 2
status: beta
---

There are various reasons and approaches to isolating different environments. Regardless of the motivation, [Fly Organizations](/docs/flyctl/orgs/) may be a good way to isolate more sensitive environments.

## Fly Organizations

Read up on [Organizations in Fly.io](/docs/flyctl/orgs/). An org has members, separate billing controls, and separate private networks. For teams that want to separate production environments from staging and development, the &quot;org&quot; is a great starting point and draws a hard line separation.

When setting up a Fly.io account, by default, applications are deployed to a &quot;personal&quot; account. That works great for individuals but when you are ready to share access to apps among multiple people, use orgs.

## Production Fly Organization

Create an [Organization in Fly.io](/docs/flyctl/orgs/) for your team and apps. Creating an organization makes it easy to invite other developers, manage billing with a company credit card, and deploy apps to a shared environment.

Use the [Dashboard](https://fly.io/dashboard/) to manage your organizations, members and invites.

The `flyctl` CLI also supports organization operations.

- `fly orgs help`
- [Fly.io orgs command docs](/docs/flyctl/orgs/)

Invite your team members to the Organization.

```cmd
fly orgs invite …
```

## Networks in an Organization

Multiple apps can be deployed to an organization. Any applications deployed to the same organization are [accessible to each other in the private network](/docs/reference/private-networking/).

## Staging Organization

Create additional organizations for &quot;staging&quot; or &quot;testing&quot; environments to fully isolate them from the production environment.

```cmd
fly orgs create <my-org-staging>
```

Databases are applications as well. Create a new Postgres cluster in a staging organization for applications deployed in the organization. Multiple apps can share the Postgres server and the apps can create their own databases in a server in the staging org.

Depending on your needs and usage, a staging database cluster can be smaller than the production one as it likely receives less traffic.

Create a Postgres cluster in your staging org:

```cmd
fly postgres create
```

As a suggestion, if the production database is named `my-app-db`, the staging version could be named `my-app-db-stage`.
