---
title: Monorepo and Multi-Environment Deployments
layout: docs
sitemap: false
nav: firecracker
---

By default, `flyctl deploy` builds and deploys a `fly.toml` file, a `Dockerfile`, and sourcecode from the current working directory. This is sufficient for deploying a single app, but you can also configure `flyctl` to build and deploy multiple apps from a monorepo or deploy an app to multiple targets.

## _Paths_

### Working Directory

The first argument to `flyctl deploy` is the path to the working directory for your app's source code. For Dockerfile and Buildpack builds, this is the [build context](https://docs.docker.com/engine/reference/commandline/build/#usage) sent to the Docker daemon. It defaults to the current working directory. 

You can override this by providing a path:

```
$ flyctl deploy ./path/to/app
```

### `fly.toml` path   

By default, `flyctl deploy` will look for a `fly.toml` in the working directory. You can override this using the `--config` flag. 

```
flyctl deploy --config ./path/to/fly.toml
```

### `Dockerfile` path

By default, `flyctl deploy` will look for a `Dockerfile` in the working directory. You can override this using the `--dockerfile` flag. 

```
flyctl deploy --dockerfile ./path/to/Dockerfile
```

## _Multi-stage Build Target_

By default, the final stage of a [multi-stage dockerfile](https://docs.docker.com/develop/develop-images/multistage-build) is exported as the deployed image. You can stop at a specific stage by using the `--build-target` flag

```
flyctl deploy --build-target web
flyctl deploy --build-target api
flyctl deploy --build-target worker
```

## _Examples_

**Use a different fly.toml file per environment**

```
flyctl deploy --config ./fly.production.toml
flyctl deploy --config ./fly.staging.toml
```

**Use a different Dockerfile per environment**

```
flyctl deploy --Dockerfile ./Dockerfile.production
flyctl deploy --Dockerfile ./Dockerfile.staging
```

**Deploy a subdirectory**

```
flyctl deploy ./apps/api
```

**Share a multi-stage Dockerfile with several fly apps**

```
flyctl deploy --config fly.api.toml --build-target api
```
