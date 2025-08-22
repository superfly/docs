---
title: Rollback Guide
layout: docs
nav: firecracker
author: kcmartin
date: 2025-08-22
---

## Why rollback?

Fly.io runs your apps close to your users, in VMs you can spin up and tear down in seconds. But what if you spin up something broken? If a deploy goes wrong, it’s easy to roll back: just tell Fly to redeploy a previous image. There’s no special `rollback` command because you don’t need one. Rollbacks use the same deploy mechanism you already know.

If you know which image was working before, you can deploy it again. You just need to know where to find the image, and how to tell Fly to use it. The trick is: you’re rolling back the _VM image_, not the database. If you ran migrations in that bad deploy, you’ll have to undo those separately in your application or migration code. Fly isn’t going to time-travel your data.

---

## How to rollback

### Step 1: See what you’ve shipped

Fly keeps a history of your releases, including the exact container image each one used. Run:

```bash
fly releases --app myapp --image
```

You’ll see a list of past releases with timestamps and image tags:

```
v42   2025-08-12T16:21Z   registry.fly.io/myapp:deployment-01HXXXXX
v41   2025-08-10T09:14Z   registry.fly.io/myapp:deployment-01HYYYYY
```

Pick the one before things went sideways.

---

### Step 2: Deploy that exact image

Let’s say `v41` was fine. You can redeploy its image directly:

```bash
fly deploy --image registry.fly.io/myapp:deployment-01HYYYYY
```

That’s it — no rebuild, no code checkout, just telling Fly to boot the older VM image. This works as long as the image is still in the Fly registry.

---

### Tip: Stop living in `deployment-01HXXXXX` hell:  use human-readable tags

The default auto-generated tags work for machines, not humans. You can make your life easier by tagging builds with something you’ll recognize later — a git commit hash, a version number, or even just `before-i-broke-prod`.

When you deploy, pass `--image-label` to set a tag:

```bash
fly deploy --image-label v1.2.3
```

That command:

1. Builds your app
1. Tags the image as `v1.2.3`
1. Deploys it

Rolling back later becomes:

```bash
fly deploy --image registry.fly.io/myapp:v1.2.3
```

---

## How long does Fly keep your images? 

Right now, Fly doesn’t promise to store app images forever. If an image hasn’t been deployed for a while, it might be pruned from our registry to free up space. If you need a “guaranteed forever” rollback target, push your image to a public container registry (like Docker Hub, GHCR, or ECR) and deploy from there. See [Using the Fly Docker Registry](https://fly.io/docs/blueprints/using-the-fly-docker-registry/#to-deploy-a-public-image-from-docker-hub-or-another-public-registry) for details.

---

## Things to watch out for

Rollbacks are simple in Fly, but they aren’t magic. A few details are worth keeping in mind:

- **Database schema drift** → If a deploy ran destructive migrations (dropping a column, renaming a table), rolling back the app image might not help. Plan migrations so they’re safe both forward and backward.
- **Image retention** → Images don’t live forever in Fly’s registry. For long-term rollback insurance, push builds to your own container registry.
- **Config, Secrets and `fly.toml`** → Rollbacks don’t undo config changes. When you deploy an older image, Fly still uses your current `fly.toml`, along with whatever env vars and secrets are set now. If a past deploy depended on an older config, you’ll need to update those settings manually when rolling back.
- **Autoscaling** → If your app scaled up during the bad release (say traffic spiked and Fly added more machines), those extra machines don’t vanish the instant you roll back. They’ll hang around until autoscaling decides to scale them down. This is expected behavior and your rollback still worked; you just have more machines than usual for a while. Read more about [metrics-based autoscaling](https://fly.io/docs/launch/autoscale-by-metric/).
- **Monitoring** → Always confirm a rollback stabilized things with logs , probes (`fly logs`, `fly status,` Grafana metrics), not just the success message from `fly deploy`.
- **Regions** → By default, rollbacks redeploy globally. If you run in multiple regions (say `iad`, `lhr`, `syd`), you might test a rollback in just one region before rolling back everywhere. You can do this with the `--region` flag:

```bash
fly deploy --image registry.fly.io/myapp:v1.2.3 --region iad
```
---

## Tip: Faster rollbacks with deploy strategies

By default, Fly uses `rolling` deploys: new machines come up before old ones shut down. That’s safe for upgrades, but if you know the current release is bad, you may want a quicker cutover.

### All-at-once rollback:

```bash
fly deploy --image registry.fly.io/myapp:v1.2.3 --strategy immediate
```

This stops old machines and boots the rollback image as quickly as possible.



### Controlled speedup:

```bash
fly deploy --image registry.fly.io/myapp:v1.2.3 --max-unavailable 0.5
```

This lets you take down up to half your machines at once, moving faster than a cautious rolling deploy while avoiding a full stop.

Use `--strategy immediate` when speed matters more than downtime, and `--max-unavailable` when you want a hedge between safety and speed.

---

## Summing up

Rolling back on Fly is basically just _deploying an older image_. Once you’ve got the muscle memory for `fly releases --image` and `fly deploy --image`, it’s a quick, predictable way to recover from bad deploys. And if you start tagging images with human-readable labels, you’ll have an easier time remembering which one to trust when production is on fire.
