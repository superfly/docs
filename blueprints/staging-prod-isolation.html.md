---
title: Staging and production isolation
layout: docs
nav: firecracker
---

You have your own good reasons for wanting to isolate your production environment from your test or staging environments. When you want to limit access to production to the smallest possible group, you can get dependable isolation by using multiple organizations. Organizations are isolated from one another at a low level by our private networking architecture.

All Fly.io accounts start with a "personal" organization. You can create as many organizations as you need, not just for different environments, but also for different projects or clients.

Before you create a new organization, here's what you need to know:

- All organizations have their own [private network](/docs/networking/private-networking/) by default. An organization can have multiple apps and those apps can communicate with each other securely over the org's private network.
- As mentioned, we bill organizations separately. You'll need to enter a payment method and you'll be invoiced per organization at the end of each billing cycle.
- Since they're billed separately, each organization will be on its own [plan](https://fly.io/plans).
- You'll invite or remove members in each organization separately.

Adjust the pattern to fit your needs. Here's an example:

- personal org: the org you started with, and the one you keep for personal projects
- staging org: <project>-staging, for development and testing
- production org: <project>-production, for your production app

## Create organizations

You can create new organizations and invite members from the [dashboard]((https://fly.io/dashboard/)) or using [`fly orgs` flyctl commands](/docs/flyctl/orgs/).

