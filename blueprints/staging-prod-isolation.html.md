---
title: Staging and production isolation
layout: docs
nav: firecracker
redirect_from: /docs/going-to-production/the-basics/production-staging-isolation/
---

You want to isolate your production environment from your test or staging environments by limiting production access to the smallest possible group. You can get dependable isolation by using multiple organizations. Organization access is invitation-only and orgs are isolated from one another at a low level by our private networking architecture: every organization has its own [private network](/docs/networking/private-networking/) by default.

All Fly.io accounts start with a "personal" organization. You can create as many organizations as you need, not just for different environments, but also for different projects or clients.

Before you create a new organization, here's what you need to know:

- We bill organizations separately and each org has its own [plan](https://fly.io/plans). When you create the new org, you need to enter a payment method and choose a plan. You'll be invoiced per organization at the end of each billing cycle.
- You invite or remove members in each organization separately.
- An organization can have multiple apps and those apps can communicate with each other securely over the org's private network.

Adjust the pattern to fit your needs. For example:

- personal organization: the org you started with, and the one you keep for personal projects
- staging organization: `<project>-staging` used for development and testing
- production organization: `<project>-production` used for your production app

## Work with multiple organizations

It's best if you use one Fly.io account to manage all your organizations, so you can access them without logging in and out. App names are unique across the Fly.io platform, so your staging and production apps will have different names and their own `fly.toml` files for configuration.

### Manage organizations in your dashboard

To create a new org from the [dashboard]((https://fly.io/dashboard/)), select **Create new organization** from the **Organization** dropdown.

To view or send invites to members, use the **Organization** dropdown to choose an org, then go to **Team**.

### Manage organizations with flyctl

To create new organizations and invite or remove members, use [`fly orgs` flyctl commands](/docs/flyctl/orgs/).

When you have more than one org, flyctl prompts you to choose an organization when required. You can run commands on a specific app in any org using the `--app` option if you aren't in the app's project source directory in your terminal.

## Other kinds of isolation and access control

- When you only need app isolation within an org, you can use [custom private networks](https://community.fly.io/t/fly-ssh-with-custom-network/19296) to isolate apps from one another by creating an app with `fly apps create` and the `--network` option. More on this feature coming soon.
- When you want user or 3rd-party access control, you can use [deploy](https://community.fly.io/t/deploy-tokens/11895) and [org-scoped tokens](https://community.fly.io/t/org-scoped-tokens/13194) to limit access to apps or orgs.
