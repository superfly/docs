---
title: Build Secrets
layout: docs
nav: apps
redirect_from: /docs/reference/build-secrets/
---

You can set [secrets](/docs/apps/secrets/) for your applications, but these are only available at _run-time_. They aren't available when building your Docker image without a little extra work.

To make a secret available at build time,  we'll use [Docker secrets](https://docs.docker.com/develop/develop-images/build_enhancements/).

It's a 2-step process:

1. Mount a secret into your `Dockerfile`
1. Provide the value for that secret when running `fly deploy`

## Mounting secrets

Mount a secret into your `Dockerfile` within a `RUN` statement:

```dockerfile
# Note: You can mount multiple secrets
RUN --mount=type=secret,id=MY_SUPER_SECRET \
    MY_SUPER_SECRET="$(cat /run/secrets/MY_SUPER_SECRET)" some_command \
    && more_commands_maybe
```

This creates a new file when running `docker build`. Secrets are stored in the `/run/secrets` directory. The file name is the `id` you passed when mounting the secret. The content of that file contains the value of the secret.

The `--mount` directive is not a shell command, so there's no need to add `&&` after it as you commonly see when chaining commands.

## Secret values

You need to provide the values of the mounted secrets when running `fly deploy`:

```bash
# Note: You can pass multiple secrets if you need
fly deploy \
    --build-secret MY_SUPER_SECRET=some_value
```

## Testing build secrets locally

If you want to test your Docker build locally (before deploying to Fly.io), the commands to do so would look something like this:

```bash
echo -n "secret_value" > mysecret.txt

docker build --secret id=MY_SUPER_SECRET,src=mysecret.txt .
```

## Automate the inclusion of build secrets using an ephemeral Machine

The above requires you to have access to the values of secrets and to
provide those values on the command line. If this poses a problem, an
alternative may be to create an ephemeral Machine using the `fly console`
command to do the deployment.

An example Dockerfile you can use for that purpose:

```dockerfile
# syntax = docker/dockerfile:1

FROM flyio/flyctl:latest as flyio
FROM debian:bullseye-slim

RUN apt-get update; apt-get install -y ca-certificates jq

COPY <<"EOF" /srv/deploy.sh
#!/bin/bash
deploy=(flyctl deploy)
touch /srv/.secrets

while read -r secret; do
  echo "export ${secret}=${!secret}" >> /srv/.secrets
  deploy+=(--build-secret "${secret}=${!secret}")
done < <(flyctl secrets list --json | jq -r ".[].Name")

deploy+=(--build-secret "ALL_SECRETS=$(base64 --wrap=0 /srv/.secrets)")
${deploy[@]}
EOF

RUN chmod +x /srv/deploy.sh

COPY --from=flyio /flyctl /usr/bin

WORKDIR /build
COPY . .
```

The `deploy.sh` script contained within this Dockerfile will provide each secret individually as well as package up a script to set all secrets at once.  You can set all build secrets at once in your Dockerfile using:

```dockerfile
RUN --mount=type=secret,id=ALL_SECRETS \
    eval "$(base64 -d /run/secrets/ALL_SECRETS)" && \
    some_command
```

Assuming your builder Dockerfile is named `Dockerfile.builder`, you can launch the emphemeral machine using the following command:

```cmd
flyctl console --dockerfile Dockerfile.builder -C "/srv/deploy.sh" --env=FLY_API_TOKEN=$(fly auth token)
```
