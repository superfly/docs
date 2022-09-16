---
title: Terraform
layout: framework_docs
objective: This guide shows you how to deploy your Rails app on Fly Machines using Terraform
status: alpha
---

This is a technology preview.  Do not run it in production.  Current limitations include no volumes and no databases.  It also only works
on non-node Rails 7 applications.

Looking for feedback on everything: technical correctness,
developer experience, what feature should be focused on next...

See also the [RFC: Terraforming Rails on fly.io](https://community.fly.io/t/rfc-terraforming-rails-on-fly-io/7133) and
[Getting started with Terraform and Machines ](https://fly.io/docs/app-guides/terraform-iac-getting-started/).

## Prerequisites

Go ahead and [download](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform if you haven't yet.

## Create a Rails project

```cmd
rails new welcome; cd welcome
```

Now use your favorite editor to make a one line change to `config/routes.rb`:

``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

   # Defines the root path route ("/")
-  # root "articles#index"
+  root "rails/welcome#index"
 end
 ```

 Install `fly.io-rails` gem:

 ```cmd
 bundle add fly.io-rails
 ```

Source to this gem is on [GitHub](https://github.com/rubys/fly.io-rails).  If
adopted, it will move to the superfly organization.


## Generate terraform configuration

```cmd
bin/rails generate terraform
```

The terraform generator supports a number of options, for now it is worth letting them all default.  For completeness, the current list of options supported is:

  * `--name` - application name. If not specified, a name will be generated for you.
  * `--org` - the fly organization. Defaults to `personal`.
  * `--region` - one or more regions to deploy this app.  If not specified, fly wil pick one for you based on your location.

  More options can and should be added.  See
  [Fly terraform provider documentation](https://registry.terraform.io/providers/fly-apps/fly/latest/docs/resources/machine#optional) for ideas.

## Open WireGuard tunnel

In its own terminal (or in the background; the point is that we want to keep this running) run

```cmd
flyctl machines api-proxy
 ```
 
This will proxy a local port over [user-mode WireGuard](https://fly.io/blog/our-user-mode-wireguard-year/) to the internal Machines API endpoint, so Terraform on your machine can access it.

**Question**: should this be launched transparently in the background
by the next command and taken down once the command completes?

## Deploy the application

```cmd
bin/rails deploy
```

What this will do is:
  * Build your docker image using a remote builder
  * Push your image to the fly repository
  * Update `main.tf` with the name of the new image
  * Run `terraform apply -auto-approve`

Once this completes -- whether it works or not, and there are plenty of
things that can go wrong -- feel free to modify `main.tf` and
rerun `terraform` commands directly.  You can even `terraform destroy` and
`rm terraform.tfstate` and start over.  What's important is `main.tf` already
reflects the name of the latest image.

Also, because a minimal `fly.toml` file was generated, you can use commands like `fly open`,
`fly ssh console` and `fly logs`.

## Next Challenge

In order to support a database, we are going to need to insert a _release_
step into the deploy process in order to run a `db:migrate`.  This will
require a transient machine that has `DATABASE_URL` set in the environment.
In order to support sqlite3, it will also need the ability to mount a volume.

Problem 1: [Create and Start a Machine](https://fly.io/docs/reference/machines/#create-and-start-a-machine) doesn't describe how to set an ENTRYPOINT, but undoubtedly supports such an option.

Problem 2: 

Starting a machine via `fly machine run` with an `--entrypoint` doesn't appear to work.

```cmd
fly machine run --entrypoint '/app/bin/rails db:migrate' registry.fly.io/cool-wildflower-4055:deployment-01GD22MAGTMPTA5XY46R8GSTCB
```

Results in:

```
Searching for image 'registry.fly.io/cool-wildflower-4055:deployment-01GD22MAGTMPTA5XY46R8GSTCB' remotely...
image found: img_8y6w4zx3g17p7rn3
Image: registry.fly.io/cool-wildflower-4055:deployment-01GD22MAGTMPTA5XY46R8GSTCB
Image size: 118 MB
Success! A machine has been successfully launched, waiting for it to be started
 Machine ID: 9080517f159287
 Instance ID: 01GD2Y0GFDSBDM7X96JRHPEVE0
 State: created
Machine started, you can connect via the following private ip
  fdaa:0:804b:a7b:9d34:3e09:ab84:2
```

Looking at the logs:

```
2022-09-16T10:37:25Z app[73d8dd69f73089] dfw [info]I, [2022-09-16T10:37:25.964573 #514]  INFO -- : [f98299ba-979f-441f-91ca-fb38fc44054a] Started OPTIONS "/ipc$" for 137.66.18.106 at 2022-09-16 10:37:25 +0000
2022-09-16T10:37:25Z app[73d8dd69f73089] dfw [info]F, [2022-09-16T10:37:25.965096 #514] FATAL -- : [f98299ba-979f-441f-91ca-fb38fc44054a]
2022-09-16T10:37:25Z app[73d8dd69f73089] dfw [info][f98299ba-979f-441f-91ca-fb38fc44054a] ActionController::RoutingError (No route matches [OPTIONS] "/ipc$"):
2022-09-16T10:37:25Z app[73d8dd69f73089] dfw [info][f98299ba-979f-441f-91ca-fb38fc44054a]
2022-09-16T10:37:48Z runner[9080517f159287] iad [info]Reserved resources for machine '9080517f159287'
2022-09-16T10:37:48Z runner[9080517f159287] iad [info]Pulling container image
2022-09-16T10:37:49Z runner[9080517f159287] iad [info]Unpacking image
2022-09-16T10:37:59Z runner[9080517f159287] iad [info]Configuring firecracker
2022-09-16T10:38:00Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:03Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:04Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:07Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:09Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:12Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:14Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:16Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:18Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:21Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:24Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:27Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:30Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:33Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:37Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:39Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:43Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:46Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:49Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:52Z runner[9080517f159287] iad [info]machine did not have a restart policy, defaulting to restart
2022-09-16T10:38:55Z app[9080517f159287] iad [info]invalid option: -o
2022-09-16T10:38:58Z runner[9080517f159287] iad [info]machine has reached its max restart count (10)
```

Ideally there would be the ability to wait for the machine to complete, and for log messages to be shown to the developer in real time.

Annotating flyctl with `fmt.printf` shows the following JSON (prettified) was
posted, revealing an `init` parameter:

```json
{
  "appId": "cool-wildflower-4055",                    
  "config": {                                         
    "env": null,                                      
    "init": {                                         
      "exec": null,                                   
      "entrypoint": [                            
        "/app/bin/rails",                        
        "db:migrate"                             
      ],                                         
      "cmd": null,                               
      "tty": false                               
    },                                           
    "image": "registry.fly.io/cool-wildflower-4055:deployment-01GD22MAGTMPTA5XY46R8GSTCB",                                       
    "metadata": null,
    "restart": {
      "policy": ""
    },
    "guest": {
      "cpu_kind": "shared",
      "cpus": 1,
      "memory_mb": 256
    },
    "metrics": null
  }
}
```

This is immediately followed by a GET:

```
/3287313b6d9485/wait?instance_id=01GD347WQXZMCJBWFEKMV9HGG4&timeout=30&state=started
```

Where the path starts with the Machine Id.

### Update:

Looks like this works, taking advantage of `SERVER_COMMAND` in the `Dockerfile`:

```cmd
fly machine run --env 'SERVER_COMMAND=/app/bin/rails db:migrate' registry.fly.io/cool-wildflower-4055:deployment-01GD22MAGTMPTA5XY46R8GSTCB
```

