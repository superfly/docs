---
title: Manage Persistent Storage on a Fly App
objective: 
layout: docs
nav: firecracker
order: 40
---

If your `fly.toml` has a `[mounts]` section on launch, `fly launch` will create a volume to go with the App's first Machine. Subsequent volumes will have to be created individually with `fly volume create` and attached to cloned machines with `fly machine update --volume`.


OR:

Volumes need to be created and manually attached to machines. The `source` setting in the `[mounts]` section is no longer supported in `fly.toml`. There is no enforcement around volume names.

Attach volumes with the Machines API for now. We’re working on making this easier with `fly machine update` and `fly machine clone`.

Once attached, the `destination` setting in fly.toml will be used to update the destination of the volumes. For example, the volumes will be mounted at `/my/new/directory` with this fly.toml config after running `fly deploy`:

```
[mounts]
destination = "/my/new/directory"
```
