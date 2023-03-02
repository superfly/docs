---
title: Going to Production
layout: framework_docs
toc: false
order: 1
subnav_glob: docs/going-to-production/*.html.*
related_pages:
  - /docs/going-to-production/the-basics
  - /docs/going-to-production/monitoring
status: beta
---

You have a serious project or service and you're looking for guidance on how to
setup a good production environment on Fly.io.

There are many facets of an application and what is considered production-ready
can vary from one framework to another. This serves as an outline and guide to
additional resources.

## First Things First

Any application intended for production use should do the following things first.

1. Setup a [High Availability DB server](/docs/postgres/advanced-guides/high-availability-and-global-replication/) - Prevents interruption of service when machines or VMs are restarted.
2. Run [2+ app servers](/docs/reference/scaling/) - Prevents interruption of service when machines or VMs are restarted.
3. Sign up for a [Plan](/plans) to get email support

With the foundation pieces in place, there are additional things to consider.
