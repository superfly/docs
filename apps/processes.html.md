---
title: Run Multiple Process Groups in an App
objective: 
layout: docs
nav: firecracker
order: 90
---

**WIP**


Sometimes it's useful to break down an App's work into processes that run on separate Machines; the classic example is an App with a front end that users interact with directly, with one or more background tasks that can be placed on their own Machines and scaled differently.

On Fly.io, you can accomplish this by defining [`Processes`](https://fly.io/docs/reference/configuration/#the-processes-section) for the App in `fly.toml`. Each process type runs a different command at Machine boot.

To configure an App with separate Machines running different commands: 

1. Launch the App. This will get one Machine running according to the Dockerfile, `fly launch` flags, and/or language/framework scanner output that happen during `fly launch`. The process running in this Machine is the default "app" process. 

2. Edit the app configuration in `fly.toml` to specify

  1. process names and the command to be run on boot for each, e.g.

        ```toml
        [processes]
        app = "nginx -g 'daemon off;'"
        worker = "tail -F /dev/null"
        ```

  2. a `services` section for each process that needs Fly Proxy to be able to route to it. This means apps accessible from the public internet as well as any app using a Flycast address to get Fly Proxy features. Often, that will only be one process. If more than one process needs to accept connections via the proxy, they have to use different "external" ports. Fly Proxy doesn't know the difference between Machines within the App, aside from their service definitions. It will send traffic to any machine with a matching port.
  
  You may have noticed that the default services configuration is for a process called "app"!

Run `fly deploy`. These changes will not be applied to any Machines until the next `fly deploy`. **I'm pretty sure if you edit `fly.toml` during `fly launch`, before saying `y` to `deploy now?` it has no effect on the first deployment. The config is already composed for the deployment and `fly.toml` is not read again.**

3. Add a Machine for each additional command/entrypoint you want a group for, by `fly m clone`-ing the "app" Machine, adding the name of the new group with the `--process-group` option

  ```cmd
  fly machine clone --process-group worker 21781973f03e89
  ```

  The above adds metadata to the new machine identifying it as belonging to the `worker` process group, and updates its command, services, and health checks according to that process group as they're set up in the app's current configuration. If that config needs any changes, you change them in `fly.toml` and apply them with `fly deploy`.

  

  So 
  1. Launch and deploy -> one Machine, process="app" by default
  2. Add processes to `fly.toml` and deploy again to update the app's config on the platform.
  3. `fly m clone --process-group` a Machine for each process group you defined in `fly.toml` -- done, if we wanted one Machine per process?

  Or

  1. Launch and deploy, getting the processes section into the config before `fly launch` gets to the deployment stage. This could be either because you prepare your own `fly.toml` before running `fly launch`, or because a scanner adds the processes config, which also gets written to the local `fly.toml`. On first deployment, `fly launch` sets up a single Machine for the default process, whose startup command is the Docker ENTRYPOINT. This process is called `app` (unless otherwise specified? OR is there always an `app` process on top of the ones defined in `fly.toml`?)
  2. `fly m clone --process-group` a Machine for each process group you defined in `fly.toml` -- done, if we wanted one Machine per process?

(right now, if we want to move a Machine from one process group to another, we have to use `fly m update --metadata fly_process_group=app` I think, because `m update` doesn't have the `--process-group` option, and furthermore, while `fly m clone` gets the config of the original Machine, `fly m update` only changes what you tell it to, so you have to run `fly deploy` after changing the metadata.)


[Processes](https://fly.io/docs/reference/configuration/#the-processes-section) continue to be supported in fly.toml. The big difference with apps v2 is you need to specify which machines are assigned to which processes.

`fly deploy` will update each machine based on its process group, applying only the services, cmd, and checks for that process.

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

Make sure to run `fly deploy` after updating these groups to ensure each machine gets the appropriate services, checks, and cmd. These are the key pieces of the fly.toml that configure the processes, with the one service using the `"app"` process group:

```
[processes]
  app = "nginx -g 'daemon off;'"
  worker = "tail -F /dev/null" # not a very useful worker!

[[services]]
  processes = ["app"]
```

`fly machine clone` can then be used to build out multiple instances within a process group, or to clone a machine and put it in a different process group:

```
fly machine clone --region gru 21781973f03e89
fly machine clone --process-group worker 21781973f03e89
```
