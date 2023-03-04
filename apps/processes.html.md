---
title: Run Multiple Process Groups in an App
objective: 
layout: docs
nav: firecracker
order: 90
---

Process groups are a way to manage separate tasks under the umbrella of a single Fly App. You can maintain a single code base, and everything gets deployed in a single release, but different processes run on their own Machines&mdash;which means they don't compete with each other for VM resources, and they can be scaled individually.

When you deploy a Fly App, you start up one or more Fly Machines from a single Docker image; all the VMs have the same things installed. But Machines in different process groups run different commands at boot.

## The default process group

There's a default process group named `"app"`. If you launch a Fly App without explicitly setting up process groups, the first Machine will be assigned to this group. It'll run whatever process the Docker image specifies.

## Configure process groups

Process groups are defined in [`processes` section](https://fly.io/docs/reference/configuration/#the-processes-section) of `fly.toml`.

For each process group, specify a name and a command to be run at startup: 

        ```toml
        [processes]
        app = "nginx -g 'daemon off;'"
        worker = "tail -F /dev/null"
        ```

This example is purely illustrative!

## Deploy the app

Changes to `fly.toml` are applied on the next deployment of the Fly App (including on `fly launch` if the app doesn't exist yet).

If the app has never been deployed, one Machine will be created for each process group on the first deployment.

## Services and process groups

Often only one process group will need services defined. The default app configuration with services applies to the default `"app"` process.

If more than one process group wants Fly Proxy to be able to route to it, define a `services` section in the app configuration for each.
  
This means any Machines that should be accessible from the public internet, plus any process using a Flycast address to get Fly Proxy features. 

Fly Proxy doesn't know about process groups: it will send requests to any machine with a matching port. If more than one process group needs to accept connections via the proxy, have each one handle connections on different external ports. 
  


Run `fly deploy`. These changes will not be applied to any Machines until the next `fly deploy`. **I'm pretty sure if you edit `fly.toml` during `fly launch`, before saying `y` to `deploy now?` it has no effect on the first deployment. The config is already composed for the deployment and `fly.toml` is not read again.**


## Scale a process group horizontally

3. Add a Machine for each additional command/entrypoint you want a group for, by `fly m clone`-ing the "app" Machine, adding the name of the new group with the `--process-group` option

  ```cmd
  fly machine clone --process-group worker 21781973f03e89
  ```

  The above adds metadata to the new machine identifying it as belonging to the `worker` process group, and updates its command, services, and health checks according to that process group as they're set up in the app's current configuration. If that config needs any changes, you change them in `fly.toml` and apply them with `fly deploy`.


`fly machine clone` can then be used to build out multiple instances within a process group, or to clone a machine and put it in a different process group:

```
fly machine clone --region gru 21781973f03e89
fly machine clone --process-group worker 21781973f03e89
```

## Scale a process group vertically

To change the VM size for an entire process group, update each machine that belongs to it. 

* fly m list
* fly m update


## Change the process group of an existing Machine
  
(right now, if we want to move a Machine from one process group to another, we have to use `fly m update --metadata fly_process_group=app` I think, because `m update` doesn't have the `--process-group` option, and furthermore, while `fly m clone` gets the config of the original Machine, `fly m update` only changes what you tell it to, so you have to run `fly deploy` after changing the metadata.)

[Processes](https://fly.io/docs/reference/configuration/#the-processes-section) continue to be supported in fly.toml. The big difference with apps v2 is you need to specify which machines are assigned to which processes.

`fly deploy` will update each machine based on its process group, applying the services, cmd, and checks belonging to that group.

Use `fly machine update` to assign a process group to a machine with:

```
fly machine update --metadata fly_process_group=app 21781973f03e89
fly machine update --metadata fly_process_group=app 9e784925ad9683
fly machine update --metadata fly_process_group=worker 148ed21a031189
fly deploy
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Deploying dry-pond-1475 app with rolling strategy
  Machine 21781973f03e89 [app] update finished: success
  Machine 148ed21a031189 [worker] update finished: success
  Machine 9e784925ad9683 [app] update finished: success
  Finished deploying
```

## Process groups and legacy (Nomad) apps

<div class="callout">The `processes` feature is in [preview](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316). Let us know in the <a href="https://community.fly.io" style="text-decoration: underline;">Fly.io community forum</a> if you run into issues when deploying.

Known issues:
* Running multiple processes in this way is not compatible with autoscaling.
* Unexpected behavior with regions may arise if you use a `[processes]` block and then delete it.
</div>

After adding process groups to your app's `fly.toml` and deploying, scale them up with per-process commands. For example:

```
$ fly scale count web=2 worker=2
```

### Per-process commands

Some legacy `fly` commands accept a process name as an argument. The following examples shows which:

* Change VM counts: `fly scale count web=2 worker=1`
* Change VM size: `fly scale vm shared-cpu-1x --group worker`
* Change regions: `fly regions set iad --group worker`

For a bit more context on the `processes` feature, you can read our [community announcement](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316/).