---
title: Dockerfiles
layout: framework_docs
objective: Get started by generating a Dockerfile used to build and deploy your application.
order: 0
---

The recommended way to deploy Bun, Deno, and Node.js applications is via
[Dockerfiles](https://docs.docker.com/engine/reference/builder/).  You can
provide your own Dockerfile or you can let Fly.io's
[dockerfile generator](https://github.com/fly-apps/dockerfile-node#overview)
produce one for you.

Launching applications on Fly can be as simple as running:

```cmd
fly launch
```

In most cases you won't ever need to edit the Dockerfile `fly launch` provides for you directly.  Instead you will be
able to use one or more of the many [options](https://github.com/fly-apps/dockerfile-node#options)
to make changes.  For example:

```cmd
npx @flydotio/dockerfile --add=dnsutils
```
