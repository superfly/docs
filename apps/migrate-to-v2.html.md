---
title: Migrate an Existing App to Apps V2
objective: 
layout: framework_docs
order: 20
---

If you already have an app with Machines, running `fly deploy` on it will convert it to an Apps V2 App. You’ll be prompted to do the migration.

We don’t currently support migrating apps from Nomad to Machines. We’ll announce when that’s available.

**Note/Warning** this will overwrite the config for all these machines, based on the values set in `fly.toml` and the existing config on the machines. As an example, the services and environment values will come from `fly.toml` replacing whatever was present before. Any mounts will not change, though `fly deploy` may change the mount path if the `destination` path under the `[mounts]` section in `fly.toml` is different than what’s currently on a Machine.