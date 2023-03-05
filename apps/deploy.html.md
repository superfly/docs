---
title: Deploy a Release
layout: docs
nav: firecracker
titlecase: false
order: 30
---

`fly deploy` creates a new release of the App and updates the App's Machines as a group.

Whether you have an App up and running and it's time to update it, or you've run `fly launch` and need to tweak something to get it running properly, you can make your changes locally and deploy a new release by running `fly deploy` from the root directory of your project, where any app source, project config, `fly.toml`, and Dockerfile are located. 

If there's a `fly.toml`, it will look there for configuration and the name of the app to operate on. There are [a number of options](/docs/flyctl/deploy/) you can use with the `fly deploy` command.

<div class="callout">
If you run `fly deploy` on an older Machines App&mdash;an App created using `fly create --machines` or `fly machine run`&mdash;you will be prompted to confirm whether you want to [migrate the App to Apps V2](/docs/apps/migrate-to-v2/).
</div>

## Machines not managed by `fly deploy`

Machines created using `fly deploy` (or as part of a deployment during `fly launch`), or by `fly clone`ing such a Machine, carry a piece of metadata marking them as belonging to the Fly Apps V2 platform. These machines are updated as a group on all subsequent `fly deploy` commands, as are Machines that existed on a Machines App at the moment that it was migrated to Apps V2.

New Machines created within an App using `fly machine run` don't have the Apps V2 metadata, and are not automatically managed by `fly deploy`, so these can have their own configuration different from that of the App, and can even be based on a different Docker image.

## Volume mounts and `fly deploy`

If a Machine has a mounted [volume](/docs/reference/volumes/), `fly deploy` can't be used to mount a different one. You can change the mount point at which the volume's data is available in the Machine's file system, though. This is configured in the [`[mounts]` section](/docs/reference/configuration/#the-mounts-section) of `fly.toml`.

## `fly deploy` configuration in `fly.toml`

Configure the following deployment behavior in the [`[deploy]` section](/docs/reference/configuration/#the-deploy-section) of `fly.toml`.

### One-off commands on deployment
You can run a one-off release command in a temporary VM&mdash;using the successfully built release&mdash;before that release is deployed. This is good for, e.g., running database migrations.

### Deployment strategy
You can specify `rolling` deployment (wait for each Machine to be successfully deployed before starting the update of the next one), or `immediate` deployment (go ahead and bring all instances down for update at once).

Nomad only: Legacy apps can continue to use `canary` and `bluegreen` deployment strategies.

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

## Not all changes require a new App release

Not all changes require a fresh release. You can [add an IP address](/docs/reference/services/#ip-addresses) to an App, for example, without redeploying.

Adding a [secret](/docs/reference/secrets/) to the App does require a restart, so `fly secrets set` triggers a new deployment.
