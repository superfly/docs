---
title: Deploy Changes to an App
objective: 
layout: docs
nav: firecracker
nav: firecracker
order: 30
---

You deploy a new release of your App by running `fly deploy` from the root directory of your project. `fly deploy` looks there for a `fly.toml` file and uses this, and any options you passed with `fly deploy`, to update the App and its Machines.

If you run `fly deploy` on an existing Machines App&mdash;an App with Machines VMs in it created using `fly create --machines` or `fly machine run`, you will be prompted to confirm whether you want to migrate the app to Apps V2.

Machines created using `fly deploy`, or by `fly clone`ing such a Machine, will be updated as a group on all subsequent `fly deploy` commands, as will Machines that existed on a Machines App when it was [migrated to the V2 Apps platform](/docs/apps/migrate-to-v2/).



Whether you have an App up and running, or you've launched and something wasn't quite right on the first deployment, you can make your changes locally to your source, Dockerfile or App config, and apply them to a new release with `fly deploy`.

```cmd
fly deploy
```
```out
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Deploying dry-pond-1475 app with rolling strategy
  Machine 21781973f03e89 update finished: success
  Finished deploying
```

You can run a one-off release command in a temporary VM - using the successfully built release - before that release is deployed. This is good for, e.g., running database migrations.

Release commands and deployment strategy (rolling or immediate) are specified in the [`[deploy]` section](/docs/reference/configuration/#the-deploy-section) of `fly.toml`.

Not all changes require a fresh release. You can add an IP address to an app, for example, without redeploying.

Adding a secret to the app does require a restart, so `fly secrets set` triggers a new deployment.