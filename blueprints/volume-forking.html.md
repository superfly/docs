---
title: Using Fly Volume forks for faster startup times
layout: docs
nav: guides
author: kcmartin
date: 2025-09-12
---

<figure>
  <img src="/static/images/volume-forking.png" alt="Illustration by Annie Ruygt of a blimp and a Fly rocket flying side by side" class="w-full max-w-lg mx-auto">
</figure>

<div class="callout">
**This guide shows how to preload large files onto volumes using forking to improve startup performance. This is especially useful for apps with big model files, binaries, or databases.**
</div>

## Overview

If your app needs large local files like ML models, SQLite databases, or game assets, you're probably copying them into place at boot. Maybe you bake them into your image, or have your app download them on first run. This works, but it has downsides:

- **Slow startup times**: waiting for multi-GB  file downloads.
- **Wasted bandwidth**: each new machine pulls the same data.
- **Image bloat**: large files increase your OCI/Docker image size.

There's a better way. Write those files to a Fly Volume so they _persist_ after they've been downloaded. Fly Volumes support [forking](docs/volumes/volume-manage/#create-a-copy-of-a-volume-fork-a-volume), a fast, storage-efficient way to create new volumes preloaded with data, skipping downloads and startup delays.

---

## Why use this pattern?

You’re cloning machines and want them to boot fast, with all their large files already in place.

This isn’t about long-term persistence (though volumes can be used for that, too). It’s about getting cold-start performance close to warm-start, by skipping the “download half the internet” phase of your boot process.

It’s especially useful when:

- You’ve already run a setup step once and don’t want to repeat it.
- Your app reads large files but doesn’t modify them.
- You're scaling up on demand and startup time matters.

---

## How volume forking works

When you fork a volume:

- **Data is copied from the source volume**, block-for-block.
- **Forked volumes are usable immediately**, even while they are in the hydrating state, thanks to lazy fetching (a system where data blocks are only fetched from the source volume when your app actually tries to read them).

Your app can start reading files as soon as the fork succeeds. We start background replication right away, but behind the scenes we use a network block device to fetch blocks on demand. So startup is fast, and the data just shows up when your app asks for it.

One tradeoff: disk access might be a little slower while the replication is ongoing. But for many apps, this beats the startup delay of downloading or unpacking files.

---

## Example: cloning a machine with preloaded data

### 1. Make sure the source volume you want to fork is available

```
fly volumes list -a your-app
```

Pick the volume with the data you want to reuse.

### 2. Fork the volume

```
fly volumes fork vol_abc123 -a your-app
```

You’ll get output like this:

```
              ID: vol_new_id
            Name: volume_name
             App: your-app
          Region: yul
            Zone: b5a1
         Size GB: 20
       Encrypted: true
      Created at: 05 Sep 25 21:52 UTC
```

Note the `vol_new_id`.

### 3. Clone the machine and attach the forked volume

```
fly machine clone <machine_id> --attach-volume vol_new_id
```

Now your new machine starts with the same data in place—no need for your app to download or generate it again.

---

## What to know

- **Forks aren’t instant behind the scenes.** You can read from them immediately, but the full copy happens in the background. Disk I/O might be slower until replication finishes.
- **Data is a snapshot, not a live link.** Changes to the original after forking don’t show up in the copy (and vice versa).
- **You can fork cross‑region.** The `--region` flag allows you to target another region for the fork. If you skip it, the volume ends up in the same region by default.  Cross-region forks are expected to hydrate more slowly, since all data must be replicated over the network between regions.
- **Forks have storage costs.** As blocks are fetched or written, forked volumes grow. Keep an eye on storage usage costs if you fork a lot.

---

## (Optional) Automate it in CI

If you're scripting deploys or scaling machines dynamically, you can fold this pattern into a CI job or automation script.

Here’s a rough sketch:

```
# Step 1: Fork the seed volume
FORKED_VOL=$(fly volumes fork vol_abc123 -a your-app | grep ID | awk '{ print $2 }')

# Step 2: Clone the machine and attach the fork
fly machine clone <machine_id> --attach-volume $FORKED_VOL
```

This lets you create and attach preloaded volumes as part of your rollout process which is useful if you're standing up a new VM per job, or if you're scaling inference machines on demand.

This is totally optional. Most folks will do this manually, or only once per release. But if you're already scripting `fly machine` operations, this fits right in.

## Related reading

- [Fly Volumes overview](/docs/volumes/overview/)
- [Create and manage volumes](/docs/volumes/volume-manage/)
- [Volume states](/docs/volumes/volume-states/)
- `fly volumes fork` [reference](/docs/flyctl/volumes-fork/)

