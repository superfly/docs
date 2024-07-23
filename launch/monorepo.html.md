---
title: Monorepo and multi-environment deployments
layout: docs
nav: apps
redirect_from: /docs/reference/monorepo/
---

By default, `fly deploy` builds and deploys a `fly.toml` file, a `Dockerfile`, and source code from the current working directory. This is sufficient for deploying a single app, but you can also configure flyctl to build and deploy multiple apps from a monorepo or deploy an app to multiple targets.

## Paths

### Working directory

The first argument to `fly deploy` is the path to the working directory for your app's source code. For Dockerfile and Buildpack builds, this is the [build context](https://docs.docker.com/engine/reference/commandline/build/#usage) sent to the Docker daemon. It defaults to the current working directory. 

You can override this by providing a path:

```cmd
fly deploy ./path/to/app
```

### `fly.toml` path   

By default, `fly deploy` will look for a `fly.toml` in the working directory. You can override this using the `--config` option. 

```cmd
fly deploy --config ./path/to/fly.toml
```

### `Dockerfile` path

By default, `fly deploy` will look for a `Dockerfile` in the working directory. You can override this using the `--dockerfile` option. 

```cmd
fly deploy --dockerfile ./path/to/Dockerfile
```

## Multi-stage Build Target

By default, the final stage of a [multi-stage dockerfile](https://docs.docker.com/develop/develop-images/multistage-build) is exported as the deployed image. You can stop at a specific stage by using the `--build-target` option:

```
fly deploy --build-target web
fly deploy --build-target api
fly deploy --build-target worker
```

## Examples

**Use a different fly.toml file per environment**

```
fly deploy --config ./fly.production.toml
fly deploy --config ./fly.staging.toml
```

**Use a different Dockerfile per environment**

```
fly deploy --dockerfile ./Dockerfile.production
fly deploy --dockerfile ./Dockerfile.staging
```

**Deploy a subdirectory**

```cmd
fly deploy ./apps/api
```

**Share a multi-stage Dockerfile with several Fly Apps**

```cmd
fly deploy --config fly.api.toml --build-target api
```
