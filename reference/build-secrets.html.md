---
title: Build Secrets
layout: docs
sitemap: false
nav: firecracker
---

You can set [secrets](/docs/reference/secrets/) for your applications, but these are only available at _run-time_. They aren't available when building your Docker image without a little extra work.

To make a secret available at build time,  we'll use [Docker secrets](https://docs.docker.com/develop/develop-images/build_enhancements/).

It's a 2-step process:

1. Mount a secret into your `Dockerfile`
1. Provide the value for that secret when running `fly deploy`

## Mounting Secrets

Mounting a secret into your `Dockerfile` is done within a `RUN` statement:

```dockerfile
# Note: You can mount multiple secrets
RUN --mount=type=secret,id=MY_SUPER_SECRET \
    MY_SUPER_SECRET="$(cat /run/secrets/MY_SUPER_SECRET)" some_command \
    && more_commands_maybe
```

This creates a new file when running `docker build`. Secrets are stored in athe `/run/secrets` directory. The file name is the `id` you passed when mounting the secret. The content of that file contains the value of the secret.

The `--mount` directive is not a shell command, so there's no need to add `&&` after it as you commonly see when chaining commands.

## Secret Values

You need to provide the values of the mounted secrets when running `fly deploy`:

```bash
# Note: You can pass multiple secrets if you need
fly deploy \
    --build-secret MY_SUPER_SECRET=some_value
```

## Testing Build Secrets Locally

If you want to test your Docker build locally (before deploying to Fly.io), the commands to do so would look something like this:

```bash
echo -n "secret_value" > mysecret.txt

docker build ---secret id=MY_SUPER_SECRET,src=mysecret.txt .
```
