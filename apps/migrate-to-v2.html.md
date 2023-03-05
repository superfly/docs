---
title: Migrate a Machines App to Apps V2
objective: 
layout: docs
nav: firecracker
toc: false
order: 20
---

The first time you run `fly deploy` on an older Machines App&mdash;an app created using `fly create --machines` or `fly machine run`&mdash;it will migrate that app to the Fly Apps Platform and unify the configuration for all the app's existing Machines. The Machines belonging to an app at the time of its migration to the V2 Apps platform, and any Machines created by `fly clone`ing these Machines, will be managed by `fly deploy` from then on.

**Note/Warning:** This will overwrite the config for all these machines, based on the values set in `fly.toml` and the existing config on the machines. As an example, the services and environment values will come from `fly.toml`, replacing whatever was present before. Any Fly Volume mounts will not change, though `fly deploy` may change the mount path if the `destination` path under the `[mounts]` section in `fly.toml` is different than what’s currently on a Machine.

We don’t currently support migrating apps from Nomad (Apps V1) to the Fly Apps V2 Platform.
