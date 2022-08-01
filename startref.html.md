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
