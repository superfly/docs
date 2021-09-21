---
title: Builders and Fly
layout: docs
sitemap: false
nav: firecracker
---

## _What Is a Builder?_

When you deploy an app on Fly, the app has to be assembled into a deployable image. That's the job that builders take on.

There are three kinds of Fly builders - dockerfile, buildpacks, and image.

### Dockerfile

The dockerfile builder is the default builder, invoked when there is a `Dockerfile` and there are no build settings in the `fly.toml` file. It looks for a `Dockerfile` in the current directory and uses that to construct the deployable image. If you are familiar with Docker, you'll be at home with this option.

This is the most flexible of the options, but with that flexibility comes the need to write Dockerfiles and the associated quirks of the Docker build system. Which is why we have further build options on Fly that simplify the process.

### Buildpacks

Platforms like Heroku use the idea of a buildpack, a building process that's run entirely in its own container, to construct their deployable images. These buildpacks are then bundled into a "builder" stack with an operating system and can be called upon to build an app. The buildpack idea has been standardized with [Cloud Native Buildpacks](https://buildpacks.io/). Buildpacks use several tests to detect if they can build the application and if they can, then proceed to run the scripts needed to create an image.

A library of standardized buildpacks are available from [Paketo Buildpacks](https://paketo.io/) and it's from this library, Heroku's Heroku18 buildpack, and Fly's own buildpack (for Deno), that you can select from in Flyctl. If you want to use an unlisted buildpack, you can specify it by name using the 
`buildpacks` setting in `fly.toml`.

The deploy process works the same way with buildpacks.

### Image

Finally, if you already have a Docker image in a repository and just want to deploy that, you can skip the building process and go straight to the deploy with the image build option.
