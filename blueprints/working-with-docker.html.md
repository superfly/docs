---
title: Working with Docker on Fly.io
layout: docs
nav: guides
author: kcmartin
date: 2025-12-12
---

<div class="callout">
**Fly.io runs apps close to your users by turning Docker images into VMs running in our global network. This is a practical guide for using Docker effectively on Fly.io.**
</div>

## Overview

If you've deployed an app with `fly launch`, you've already worked with Docker on Fly.io. Behind the scenes, Fly.io builds every deployed app as a Docker image. But here's the twist: Fly.io doesn't run Docker containers. It uses Docker images as a packaging format. Once deployed, your app runs inside a lightweight VM booted from an unpacked image. This post explains what that means, how to work with images and tags, and how to speed up deployments by prebuilding images.

Fly now also supports multi-container Machines. If you're looking for more information and use cases, check out [this forum post](https://community.fly.io/t/using-containers-with-flyctl/24729) and [this guide](/docs/machines/guides-examples/multi-container-machines/).

## Why you should care

Understanding how Docker images work on Fly.io unlocks faster deployments, better image reuse, and more control over your app lifecycle. If you're running large builds, deploying the same app to multiple Fly apps, or trying to debug tricky release issues, Docker image fluency pays off.

## How Docker images work on Fly.io

When you deploy to Fly.io, we take your Docker image and unpack it into a root filesystem for a virtual machine. That’s it. No Docker daemon. No containers. Just your app running inside a lightweight VM.

At boot, each Fly.io machine runs a minimal init process that sets up the environment and kicks off whatever you’ve configured in your Dockerfile’s `ENTRYPOINT` and `CMD`. When your app exits, the VM shuts down.

The filesystem is ephemeral. If your app writes files, installs packages, or modifies anything at runtime, those changes vanish when the machine stops. On the next boot, it’s back to the clean image. Want to keep data around? Mount a [volume](/docs/reference/volumes/).

## Prebuilding for faster deploys

By default, `fly deploy` builds and deploys in one step. That can be slow if your Dockerfile does a lot of work. If you're deploying often, it can help to split build from release:

```bash
fly deploy --build-only --push
```

This builds your image and pushes it to the registry, but doesn't deploy it.

When you're ready, deploy that prebuilt image with:

```bash
fly deploy --image registry.fly.io/myapp:your-tag-here
```

This shaves valuable seconds (or minutes) off deployment time, and lets you treat builds and releases as separate steps.

## Managing image tags

When you run `fly deploy`, we build a Docker image and push it to Fly.io's private registry. That image gets a tag like `deployment-20231208-123456`.

To deploy that same image again, or to another app in your org, you can reference it explicitly:

```bash
fly deploy --image registry.fly.io/myapp:deployment-20231208-123456
```

Want friendlier tags? Use the `--image-label` flag:

```bash
fly deploy --image-label my-cool-feature-abc123
```

You can then re-deploy it later with `--image` as shown above. This is especially handy for canary deploys or promoting the same image to staging and production.

Want to manage images manually? Authenticate your Docker client with:

```bash
fly auth docker
```

This lets you tag, push, and pull images using standard Docker commands.

## Troubleshooting common Docker image issues

- **My app is writing data, but it’s gone after restart!**<br>
That’s expected. Fly.io Machines reset their root filesystem each time they start. Use [volumes](/docs/reference/volumes/) for persistence.
- **Why is my deploy slow?**<br>
Split build and deploy steps: run `fly deploy --build-only --push`, then `fly deploy --image` to skip rebuilding every time.
- **I’m getting weird build errors.**<br>
Use `fly deploy --build-local` to build with your local Docker daemon. It's often easier to debug than remote builds. Or just use plain old Docker: `docker build -t myapp .` to build locally and `docker run` to test the image before deploying.
- **My image builds fine but fails at runtime.**<br>
Check your `ENTRYPOINT` and `CMD`. Your app runs as PID 1 in a VM, not in a Docker container. Use `fly logs` to investigate. You can also `docker run` the image locally to spot runtime issues before deploying.
- **My image isn’t deploying correctly to another app.**<br>
Make sure both apps are in the same Fly.io org, and reference the full tag from the Fly registry.
- **My app crashes or misbehaves on startup. What’s going on?**<br> 
Fly.io doesn’t run readiness checks before starting your app by default. If your app depends on something like a database or external service, you need to make sure it waits until that service is ready before it starts doing work. Add retries or startup logic to handle this gracefully. Logs are your friends - run `fly logs` on a separate console to see what the app does or says at startup.
- **It works locally, but not in production.**<br>
That probably means “it runs on my machine,” not “the image I’m deploying runs correctly.” Build the image locally with `docker build` and test it with `docker run`. That’s usually the fastest way to spot missing files, bad assumptions, or environment mismatches. Also, pin your base images, audit your `.dockerignore`, and make sure everything your app needs is actually included in the image.

## Tips for optimizing your Dockerfile

A few well-placed changes to your Dockerfile can dramatically improve build speed, runtime performance, and security:

- **Use multi-stage builds.** Compile code and install build-only dependencies in one stage, then copy only what's needed into a smaller final image.
- **Choose minimal base images.** Use Alpine distroless, or slim variants of Debian/Ubuntu to reduce image size and attack surface. Slim images often provide a good middle ground between minimalism and compatibility.
- **Leverage layer caching.** Put the least frequently changing steps (like system packages) early in the file.
- **Combine `RUN` steps.** Use `&&` to chain commands and reduce image layers.
- **Clean up after installs.** Remove package caches and temp files in the same `RUN` block.
- **Use `.dockerignore`.** Keep your build context clean: exclude `node_modules`, `.git`, logs, etc.
- **Pin image versions.** Don’t rely on `latest`; specify exact versions to keep builds consistent.
- **Avoid hardcoded secrets.** For _runtime_ [secrets](/docs/apps/secrets/), use `fly secrets`. It’s built for exactly this, and injects secrets securely into your app’s environment. For _build-time_ secrets (like private package tokens), use [build secrets](/docs/apps/build-secrets/) to avoid leaking them into your final image.
- **Run as non-root.** Use `USER` to limit container privileges.
- **Scan for vulnerabilities.** Tools like Trivy, Docker Scout, and others help keep your images safe. You can also try `fly registry vulns -a <app>` for a quick CVE scan of your deployed image (just note that it’s still experimental).

These tips and practices can make your images smaller, safer, and more predictable to deploy.

## Related reading

- [**Deploy with a Dockerfile**](/docs/languages-and-frameworks/dockerfile/) Find out how `fly launch` and `fly deploy` work when you're starting from a Dockerfile.
- [**Managing Docker images with the Fly.io registry**](/docs/blueprints/using-the-fly-docker-registry/) Understand how image storage, tagging, and reuse work in Fly.io’s private registry.
- [**Using base images for faster deploys**](/docs/blueprints/using-base-images-for-faster-deployments/) Learn how shared base images can shave time off your CI/CD loop.
- [**Optimizing your Dockerfile**](https://docs.docker.com/build-cloud/optimization/) Advice straight from Docker on structuring builds for speed and reusability.
- [**Customizing your Dockerfile for Laravel**](/docs/laravel/advanced-guides/customizing-dockerfile/) A Laravel-specific deep dive, but useful even if you’re not using Laravel.
