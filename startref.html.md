---
title: Launching a new app on Fly.io
layout: docs
sitemap: false
nav: firecracker
toc: false
---

Let's look a little more generally into how you can turn source code into an app deployed on Fly.io.

We have two ways to initialize a new non-Machine app on Fly.io: `fly launch` (or `flyctl launch`: `fly` is an alias for `flyctl` to save those precious keystrokes), and `fly apps create`.

Most of our how-tos make use of `fly launch`. `fly launch` is an all-in-one tool that tries to automate as much as possible between writing your source code and deployment on Fly.io, setting you up with a running app with sensible defaults you can build on. If you want finer control over all the steps, you can start with `fly apps create`.

Both `fly launch` and `fly apps create` do some configuration for the new app. `fly apps create` only takes care of minimal configuration, and doesn't generate a `fly.toml` file (though you can always create `fly.toml` with `fly config save`).

## What is "app configuration"?

There's stuff that we, internally, call "configuration", and that's the stuff that can be set and expressed using a `fly.toml` file. There's also other stuff that can be reasonably classified as "configuration", like your regions list, the org the app belongs to, CPU or RAM scale, etc., etc. `fly apps create` only sets the Configuration configuration, and a minimal one at that. `fly launch` may do much more.

### What do scanners do?

Each launch scanner returns a struct full of information that `fly launch` uses to (a) populate the app configuration (things that fit in `fly.toml`), and (b) do other stuff, before deployment.





Oh! Oh! IPs are not allocated by `fly launch`. They appear if you deploy an app (possibly only if it has a services section?)



get you from naming an app right through to deployment. It can autodetect several languages or frameworks, or if it doesn't find one of these, but it does find a Dockerfile, it will use a preset configuration to set up the app and build the image. (all apps on Fly.io are made from OCI images, one way or another).

(Link to how different launchers work?)

* you point fly launch toward a file path (where code is and where fly.toml will be saved)

What fly launch does:
* set the app name
* set the org
* set the region for initial deployment
* creates an empty new app config (`flyctl.NewAppConfig()`)
* if it finds a `fly.toml`, reads it (`flyctl.LoadAppConfig(configFilePath)`) (asks if should use that config)
  * oh, if there's an app name in fly.toml, that implies the app has been created before. If it hasn't been deployed, should deploy existing. If it's deployed and has a healthy alloc, should not.
  * either way, it'll ask if we should use that `fly.toml`.



If you don't want all the bells and whistles that come with `fly launch`

Reasons you might not want to use `fly launch`:

* you want to configure your app yourself
* you 







How it becomes an app on Fly.io depends on two things, really. One is: what kind of app is it? And the other is: how do you want to do it?


Our CLI tool, `flyctl`, gives you a lot of control over configuration, building, and deployment of your apps. For many kinds of projects, you won't actually need to do much beyond type `fly launch` to have something deployed. 

There's `fly launch`

To address that first question: for many kinds of projects, we have a scanner that can se






You have an application you want to deploy on Fly? You're in the right place. 

## _Deploy your app in three steps_

1. [Install Flyctl](/docs/getting-started/installing-flyctl/) - you'll need it.
2. Create an account with `flyctl auth signup` or login with `flyctl auth login`.
3. Run `flyctl launch` - create, configure, and deploy a new application

That's all you'll need to do for most applications. The `launch` command prepares your project, optionally attaches a Postgres database, and then deploys. `launch` knows about these kinds of apps:

* [Django](https://www.djangoproject.com/)
* [Laravel](https://laravel.com)
* [NuxtJS](https://nuxtjs.org)
* [NextJS](https://nextjs.org)
* [Phoenix](https://phoenixframework.org/)
* [RedwoodJS](https://redwoodjs.com/)
* [Remix](https://remix.run/)
* [Ruby on Rails](https://rubyonrails.org/)

Launch also works with a Dockerfile. If you're running something else, just find a functional Dockerfile and you're good to go.

If launch fails, don't stress. This is a complicated process. Post the command output in the [community forum](https://community.fly.io) and get help!

## _Next steps_

1. Run `flyctl status` - show the status of the application instances.
2. Run `flyctl open` - open your browser and direct it to your app.

Would you like to know more? You should read up on [private networking](https://fly.io/docs/reference/private-networking/), [volumes](/docs/reference/volumes/), and [global Postgres](https://fly.io/docs/getting-started/multi-region-databases/).



<figure class="w:full mt:6">
  <img src="/public/images/speedrun.jpg" srcset="/public/images/speedrun@2x.jpg 2x" alt="">
</figure>
