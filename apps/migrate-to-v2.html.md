---
title: Migrate an Existing Fly App to Apps V2
objective: 
layout: docs
nav: firecracker
toc: true
order: 20
---

## A V1 (Nomad) App

We don't _yet_ have an automated tool to convert an existing "V1" (managed by Nomad) Fly App to [Apps V2](/docs/reference/apps/) (running on Fly Machines). If you're raring to go, here are some steps you can use to create a new V2 app modeled on a fairly simple existing V1 app. 

The idea is to get the new app up and running satisfactorily, keeping your old one running until you're comfortable to migrate DNS to the new Machines-based app.

### Create a new app with the V2 (Machines) platform

```cmd
fly apps create --machines --name <my-app-v2> -o <my-org>
```

### Put the new app name into the `fly.toml` config file

Edit `fly.toml` in place, or make a duplicate of your app's source directory to use for the new app.

Replace the app name with the new app name. If your new app is literally called `my-app-v2`, that line looks like this:

```toml
app = "my-app-v2"
```

### Set the app's primary region

Still in `fly.toml`, add a `primary_region` option, which `fly deploy` in Apps V2 uses to determine where to create new Machines, as well as to set the `PRIMARY_REGION` environment variable within the Machines it deploys. Replace `ord` with the three-letter code for your [Fly Region](/docs/reference/regions/) of choice.

```toml
primary_region = "ord"
```

**Note:** Apps V2 does **not** make use of region groups or `fly regions` commands. [Use `fly machine clone --region`](/docs/apps/scale-count/) to create Machines in specific regions.

### ​Copy any secrets you need from your existing app

Find out which secrets you need to recreate with 

```cmd
fly secrets list -a <my-old-app>
```

A quick way to see those secrets is 

```cmd
fly ssh console -C env -a <my-old-app>
```

Set secrets on the new app to match with `fly secrets set`. For example: 

```cmd
fly secrets set DATABASE_URL=<database-url-from-old-app> REDIS_URL=<redis-url-from-old-app>
``` 

in the new app's working directory.

Here's a shell script to combine the above steps, using the ability of [`fly secrets import`](/docs/flyctl/secrets-import/) to import key=value pairs from stdin:

```sh
#!/bin/sh
#
# Clone secrets from one Fly app to another

TEMPFILE=`mktemp`
trap "rm -rf $TEMPFILE" EXIT

SECRET_KEYS=`fly secrets list -a $1 | tail -n +2 | cut -f1 -d" "`
fly ssh console -a $1 -C env | tr -d '\r' > $TEMPFILE

for key in $SECRET_KEYS; do
  PATTERN="${PATTERN}\|${key}"
done

grep $PATTERN $TEMPFILE | fly secrets import -a $2
```

### A note on Fly Volumes

If your app uses Fly Volumes, you'll have to [provision a volume](/docs/apps/volume-storage) for the first Machine to be deployed. Volumes cannot be transferred between apps, you may need to copy data down from the old app, or create the new volume from a snapshot.

[Horizontal scaling](docs/apps/scale-count) of Machines is done using `fly m clone`, which will provision a new volume for the new Machine but will not copy any data into it; it's up to your app to do data replication between instances, if needed.

### Deploy your new V2 app

```cmd
fly deploy
```

(If the app has HTTP/HTTPS services configured on standard ports, the first deployment will provision a dedicated public IPv6 and a shared public IPv4 address for it.)

Check that your app is running correctly. You can see information about your deployment in 

```cmd
fly status
```

[More ways to get info about an app, its Machines, and its status](/docs/apps/info/)

### Make sure the Machines' Restart Policy Suits Your App

Fly Machines have a restart policy as part of their configuration, determining whether the Machine should restart when its main process exits, or just enter the `stopped` state. 

There are three possible policies: `no`, `always`, and `on-fail`.

The default policy configured by `fly deploy` is equivalent to `on-fail`: flyd will try restarting a Machine up to 10 times if it exits with a non-zero exit code.

There is a temporary gotcha with this policy, however: right now, when a host reboots, this is not recognised as a failure, and so Machines enter the `stopped` state when the host comes up, instead of being restarted. Machines with services configured will tend to be woken by Fly Proxy in the course of its load-balancing activities, but Machines _without_ services will stay stopped until you start them. 

We recommend updating such Machines to use the `always` restart policy, to ensure that they come back up after a host reboot: 

```cmd
fly machine update --restart always <machine-id>
```

See [more about restart policies here](https://community.fly.io/t/issues-with-machines-restart-policy/11943/25).


### Scale your deployed Machine(s)
First deployment spins up a Machine with a single shared CPU core and 256MB RAM. If your app needs more oomph, [scale it](/docs/apps/scale-machine) with `fly m update`.

### Scale out

**For a production app, you should have at least two VMs provisioned for each process. Unlike Nomad, [flyd](/blog/carving-the-scheduler-out-of-our-orchestrator/) does not attempt to move VMs if their host hardware fails.** Having VMs in multiple regions improves availability in the case of regional outages. Databases likely want redundancy within a region for failover purposes.

To scale your app horizontally, you can clone an existing VM:

```cmd
fly m clone --select
```

If you need to deploy in another region, also clone, but into another region:

```cmd
fly m clone --select --region ams
```

### Add and check certs; switch DNS

If you have [domains/certs](/docs/app-guides/custom-domains-with-fly/) attached to your app, you'll want to add them here again:

```cmd
fly certs add <my-custom-domain.com>
```

The output will show you the IP allocated for your app, or you can use `fly ips list`.

Check that any certificates have been issued:

```cmd
fly certs check
```

```cmd
dig txt _acme-challenge.mydomain.com +short
```

Finally, point your DNS to the new IP allocated for your app.

### Delete the old V1 app

Once you've switched over to the new V2 app and you're confident you don't need the V1 app anymore, [delete it](/docs/apps/delete/).


## A non-platform Machines App

The Fly Apps V2 platform allows you to manage Fly Machines with app-wide configuration and coordinated releases, using `fly launch` and `fly deploy`. If you have a non-Apps-V2 Machine app&mdash;created using `fly create --machines` or `fly machine run`&mdash;you may or may not want to migrate it onto the Apps V2 platform in order to gain `fly deploy` functionality. 

<div class="callout">
**This is an important point: `fly deploy` unifies all the Machines it manages to use a single Docker image and a single configuration.** As an example, the services and environment variables will come from `fly.toml` on the next deployment, replacing whatever was present before.
</div>

Thus, migrating a Machines Fly App to the Apps V2 platform is fairly straightforward **if all the Machines belonging to the app are running the same image with the same configuration.**

From your project's root directory (where you'll be deploying it from, and where `fly.toml` should live):

```
$ fly config save -a appname # to get a fly.toml from a machine's config
$ fly machine update --metadata fly_platform_version=v2 9080eee5a1d518 # do this for each machine 
$ fly deploy
```

**For an app with Machines running different images,** it's more awkward. There's a good chance you'd be better off starting with a fresh V2 app, and adding any special Machines with `fly machine run` after it's deployed.

`fly config save` doesn't expect there to be a difference between Machines, so it's not currently possible to select a specific Machine to pull a new app config from. In this case, the process would look more like:

* get or create a `fly.toml` to match the config you want `fly deploy` to apply to its Machines
* run `fly machine update --metadata fly_platform_version=v2 <machine-id>` **only on any Machines that you want `fly deploy` to manage.**
* `fly deploy`

This deployment now updates the adopted Machines with the app-wide image and configuration. 