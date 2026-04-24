---
title: Integrating flyctl
layout: docs
nav: flyctl
author: kcmartin
date: 2026-04-24
---

flyctl is designed to work in scripted and automated environments. You can use it in CI/CD pipelines, deployment scripts, and custom tooling with the same commands you run locally.

## Authentication for automation

### FLY_API_TOKEN

Set the `FLY_API_TOKEN` environment variable to authenticate flyctl without interactive login:

```bash
export FLY_API_TOKEN="your-token-here"
```

When this variable is set, flyctl skips all interactive auth prompts and uses the token for every command. It takes precedence over any credentials from a prior `fly auth login`. flyctl also honors `FLY_ACCESS_TOKEN` as an alternative name for the same value --- either works.

If you're testing a token env var locally on a machine where you're also logged in to flyctl, run `fly auth logout` first. The env var wins for each command, but mixing it with a cached login session can cause confusing behavior: `fly auth whoami` shows a token identity rather than your user, and scope-limited tokens silently filter output from commands like `fly apps list` instead of erroring. In CI, this isn't an issue --- there's no cached login.

### Token types

Use the narrowest scope that works for your use case.

**Deploy token (single app)** --- the default choice for CI deploys:

```bash
fly tokens create deploy -a my-app -x 720h
```

This token can only deploy and manage the specified app. The `-x` flag sets expiry; `720h` is 30 days. Without `-x`, tokens default to 20 years.

**Org deploy token** --- for multi-app pipelines or org-wide automation:

```bash
fly tokens create org -o my-org -x 720h
```

Can manage any app in the organization. Use this when a single pipeline deploys multiple apps.

**SSH token** --- SSH access to a single app's machines:

```bash
fly tokens create ssh -a my-app -x 24h
```

**Machine exec token** --- restricted to running a specific command:

```bash
fly tokens create machine-exec -a my-app --command "/app/migrate" -x 1h
```

The token can only execute the specified command. Good for one-off tasks like database migrations in CI. The short form of `--command` is `-C` (uppercase).

**Read-only org token** --- for automation that only needs to read state:

```bash
fly tokens create readonly -o my-org -x 720h
```

Scoped to the entire org (like `fly tokens create org`) but can't create, deploy, or modify anything. Good for monitoring scripts, status dashboards, or any workflow that only consumes data from the Fly API.

### Token management

List active tokens:

```bash
fly tokens list
```

Revoke one or more tokens by ID (get IDs from `fly tokens list`):

```bash
fly tokens revoke <token-id>
```

### Least-privilege guidance

- Use deploy tokens for CI. They can't access other apps or org-level resources.
- Use read-only tokens (`fly tokens create readonly`) for any automation that only needs to read state --- monitoring, status checks, reporting. They can't deploy or modify resources, so they're safe to distribute more widely than deploy tokens.
- Set expiry times. Short-lived tokens (`-x 24h`, `-x 720h`) limit the blast radius of a leaked secret.
- Rotate tokens on a schedule. Revoke old ones; create new ones.
- Never use `fly auth token` in CI --- it returns your full personal token with access to everything. This command is deprecated and hidden from flyctl's help output; use `fly tokens create` instead.

### FLY_APP

Set `FLY_APP` to specify the target app without passing `-a` on every command:

```bash
export FLY_APP="my-app"
fly status   # targets my-app
fly deploy   # deploys my-app
```

This is useful in CI where the app name comes from a pipeline variable or matrix.

## GitHub Actions

For a full walkthrough of setting up continuous deployment, see [Continuous deployment with GitHub Actions](/docs/launch/continuous-deployment-with-github-actions/).

The basics: use the [`superfly/flyctl-actions/setup-flyctl`](https://github.com/superfly/flyctl-actions) action to install flyctl, store your token as a repository secret, and run commands.

### Standard deploy workflow

```yaml
name: Fly Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency: deploy-group
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Monorepo: deploy multiple apps

Use a matrix strategy to deploy several apps from one repository. Each app directory needs its own `fly.toml`.

```yaml
name: Deploy All Apps
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app:
          - dir: ./web
            name: my-web
          - dir: ./api
            name: my-api
          - dir: ./worker
            name: my-worker
    concurrency: deploy-${{ matrix.app.name }}
    defaults:
      run:
        working-directory: ${{ matrix.app.dir }}
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
          FLY_APP: ${{ matrix.app.name }}
```

### Staging-to-production promotion

Deploy to staging on every push. Deploy to production when you create a release.

```yaml
name: Deploy
on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  staging:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    concurrency: deploy-staging
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only -a my-app-staging
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  production:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest
    concurrency: deploy-production
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only -a my-app
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Running arbitrary flyctl commands

You aren't limited to `fly deploy`. Any flyctl command works in Actions:

```yaml
      - run: |
          flyctl machine list --json
          flyctl status
          flyctl machine restart ${{ vars.MACHINE_ID }}
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
          FLY_APP: my-app
```

## JSON output for scripting

Many flyctl commands support `--json` (or `-j`) for machine-readable output. Some commands return a single JSON object; others stream JSON-NL (one JSON object per line).

### Examples

Get machine IDs and states:

```bash
fly status --json | jq '.Machines[] | {id: .id, state: .state}'
```

List only running machines:

```bash
fly machines list --json | jq '.[] | select(.state == "started")'
```

Get the current image tag:

```bash
fly status --json | jq -r '.Machines[0].config.image'
```

Count machines by region:

```bash
fly machines list --json | jq 'group_by(.region) | map({region: .[0].region, count: length})'
```

Use JSON output in a script to wait for a deploy to settle:

```bash
fly status --json | jq -e '.Machines | all(.state == "started")' > /dev/null
```

The `-e` flag makes `jq` exit with a non-zero status if the expression evaluates to `false` or `null`, which works well in CI checks.

## Remote builds

By default, `fly deploy` builds your image remotely on Fly.io infrastructure. You don't need Docker installed locally.

### Build modes

**Remote build (default):**

```bash
fly deploy
```

The first build on a new [builder](/docs/reference/builders/) is slower because there's no layer cache. Subsequent builds reuse Docker layers and are significantly faster.

**Remote build with the Buildkit builder (experimental):**

```bash
fly deploy --buildkit
```

Deploys using the buildkit-based remote builder. Often faster than the default, but still experimental. If a build fails with `--buildkit`, try again without the flag before digging into the failure --- the classic remote builder is the supported path for now.

**Local build:**

```bash
fly deploy --local-only
```

Builds the image on your machine using your local Docker daemon, then pushes it to the Fly.io registry. Requires Docker to be installed and running.

**Pre-built image (skip building entirely):**

```bash
fly deploy --image registry.example.com/my-app:latest
```

Deploys an existing image directly. Useful when your CI pipeline already builds and pushes images to a registry.

### Notes on caching

- The first build on a new builder has no cache and takes longer.
- Subsequent builds reuse Docker layers. Structure your Dockerfile to maximize cache hits (dependencies before source code).
- If you consistently see slow builds, check the order of your Dockerfile. Copy dependency manifests, install them, *then* copy the rest of your source:

  ```dockerfile
  COPY package.json package-lock.json ./
  RUN npm install
  COPY . .
  ```

  If the install runs *after* you copy the full source, any source change invalidates the install layer's cache and forces a reinstall on every build, negating the benefit.
- Uncompressed images on standard Machines are limited to 8 GB, matching the maximum rootfs size. Larger images can't be deployed, so you'll need to reduce the image size.

## Other CI systems

The same patterns work in any CI system. The setup is always:

1. Install flyctl.
2. Set `FLY_API_TOKEN`.
3. Run flyctl commands.

### Install flyctl in CI

```bash
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"
```

This works on any Linux-based CI runner. The script detects the architecture and installs the latest release.

### Generic CI example

```bash
# Install
curl -L https://fly.io/install.sh | sh
export PATH="$HOME/.fly/bin:$PATH"

# Authenticate via environment
export FLY_API_TOKEN="$YOUR_CI_SECRET"

# Deploy
fly deploy --remote-only -a my-app
```

For GitLab CI, CircleCI, Jenkins, Buildkite, or any other system, the setup is the same. Store your token as a secret in your CI provider, export it as `FLY_API_TOKEN`, and run flyctl commands as you would locally.
