---
title: Launching a New App on Fly.io
layout: docs
sitemap: false
nav: firecracker
toc: false
---

<div >

Most of the time, to create a new app on Fly.io, you'll use `fly launch`. (link to hands-on or something.) `fly launch` is an all-in-one tool that automates as much as possible between writing your source code and deployment on Fly.io, setting you up with a running app with sensible defaults you can build on.


## The main parts of this process

Once you've written your source code using the tools of your choice, it becomes an app on Fly through, broadly, the following steps:

### Registering a new app

An "app" exists as an entry in our app database. If we run `fly apps create --name my-app`, an entry will be created under your organization, with the name `my-app`&#42;. It will have a default configuration, which you can look at using `fly config display -a my-app`, and download into a local `fly.toml` using `fly config save -a my-app`.

&#42;Well, it would, except that the app name `my-app` is pretty much guaranteed not to be available.

### Specifying where its image comes from

An app deployed on Fly has to be packaged into an OCI image so we can turn it into a Firecracker VM workload. This is one of the key advantages of An appropriate prebuilt image can be specified, or one can be built during the deploy process -- either from a Dockerfile or using a buildpack (or a nixpack).

(write about prebuilt, buildpacks, Dockerfile -- nixpacks are odd one out, I think, because they're in deploy, not launch. Haven't figured out the flow for that, I guess that doesn't affect what fly.toml says build is like)



### Creating app secrets

### Creating volumes and/or a Postgres database associated with the app

### Configuring the app

(everything in fly.toml to get your project running the way you want)
Includes mount points for volumes provisioned. 

### Deploying the app

* specifying the initial deployment region
* 





The language- or framework- specific launchers incorporated into `fly launch` may also do fancy things like copy files and run commands in order to prepare the project for deployment, set build arguments