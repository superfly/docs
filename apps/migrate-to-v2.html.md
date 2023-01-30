---
title: Migrate a Machines App to Apps V2
objective: 
layout: docs
nav: firecracker
order: 20
---

The first time you run `fly deploy` on an App with Machines running under it (if you created the App with `fly machine run` or `fly apps create --machines`), you will be prompted to convert it to an Apps V2 App.

<div class="callout">
**Note/Warning**: this will overwrite the config for all these machines, based on the values set in `fly.toml` and the existing config on the machines. As an example, the services and environment values will come from `fly.toml`, replacing whatever was present before. Any mounts will not change, though `fly deploy` may change the mount path if the `destination` path under the `[mounts]` section in `fly.toml` is different than what’s currently on a Machine.
</div>

We don’t currently support migrating apps from Nomad (Apps V1) to Machines (Apps V2).

The Machines belonging to an App when it's migrated to the V2 Apps platform, and any Machines created by `fly clone`ing these Machines, will be managed by `fly deploy` from then on.
