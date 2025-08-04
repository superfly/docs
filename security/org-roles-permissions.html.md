---
title: Organization Roles and Permissions
layout: docs
nav: firecracker
author: kcmartin
date: 2025-08-04
---

## Organization Role Types

Fly.io organizations (orgs) have two roles: **Member** and **Admin**. These roles determine what users can do within your org, from deploying apps to managing billing.

### Member

Most people on your team will be Members. They can do everything you'd expect a developer or engineer to need:

- Create and destroy apps
- Deploy new versions
- Manage secrets, volumes, and machines
- View logs and metrics
- Access the org's private network

What they _can’t_ do: change anything about the org itself. No inviting or removing users, no billing access, no deleting the org.

### Admin

Admins have all the permissions of Members, plus a few critical ones:

- Invite and remove users
- View and update billing info
- Permanently delete the organization

Use the admin role sparingly. Admins can burn the place down—on purpose or by accident.

**Note**: For billing and user permission details for our extension partners (e.g. Tigris, Sentry, etc.) please check with the vendor directly.

### Quick Comparison

| Capability | Member | Admin |
| --- | --- | --- |
| Deploy & manage apps | ✓ | ✓ |
| Invite/remove users | X | ✓ |
| Manage billing | X | ✓ |
| Delete the org | X | ✓ |

## Strategies for Safer Access Control

Fly.io keeps roles simple on purpose: you get Admins and Members. But that doesn’t mean you’re stuck with a binary choice between “can delete the org” and “can’t deploy apps.” Here are a couple of ways teams carve out safer access patterns using the tools we already support.

### 1. Split Environments into Separate Organizations

Fly.io organizations are free to create, and there's no technical limit to how many you can have. One thing to note, each organization needs a payment method or a linked billing organization.  You can read more about linked organizations and billing [here](/docs/about/billing/#unified-billing).

Let’s say you run a multiplayer game platform. You might set up:

- `arcadia-dev` where every engineer is an Admin, free to deploy test builds, tweak game servers, and experiment with new features.
- `arcadia-prod` where only ops and senior engineers have Admin rights, and everyone else is a Member.

This setup avoids the classic “accidental prod deploy” scenario. Admins still get full control where it matters, but you’re not handing out the keys to production just so someone can push a staging build.

### 2. Use Read-Only Tokens for Observability-Only Roles

Sometimes people need to see things without touching them. Maybe your support team wants to look at logs to troubleshoot customer issues. Maybe your SREs want to hook into Grafana or another dashboard tool.

You don’t need to make those people Members. Instead, generate a read-only API token:

`flyctl tokens create readonly`

This token can authenticate to Fly.io, but not make any changes. To use it properly, the user should be **logged out** (`fly auth logout`) and run commands with the token set via `FLY_API_TOKEN`. For maximum safety, don’t make these users Members of the org at all. If they are, they could still run `fly auth login` and get full access through their user account, bypassing the token’s restrictions. It’s a great way to integrate observability tools or give your team visibility without risk. You can read more about uses for `fly tokens create` on the [reference page](/docs/flyctl/tokens-create/).

## Summing up

Fly.io keeps roles simple on purpose, but you still have the tools to shape access around how your team actually works. Keep the number of Admins small, make sure Members have only the access they need, and lock down everything else by default.

## Related Reading

- [Moving an application between orgs](/docs/apps/move-app-org/)
- [Handing over an application](/docs/apps/app-handover-guide/)
- [Read-only tokens reference](/docs/flyctl/tokens-create-readonly/)
- [Staging and production isolation](/docs/blueprints/staging-prod-isolation/)

