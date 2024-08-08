---
title: Staging environments with GitHub actions
layout: framework_docs
order: 1
objective: How to create staging environments on the Fly.io with GitHub actions.
related_pages:
  - /docs/django/getting-started/
  - /docs/flyctl/
  - /docs/postgres/
  - /docs/reference/configuration/
---

Creating staging environments for testing changes to our apps can be a challenge. This
guide shows how to use GitHub actions to smoothly create a separate staging
environment for each pull request using the
[`fly-pr-review-apps`](https://github.com/marketplace/actions/pr-review-apps-on-fly-io+external)
action, which will create and deploy our Django project with changes from the specific
pull request. It will also destroy it when it's no longer needed, such as after closing
or merging a pull request. The entire staging process enclosed in one GitHub action, so
we don't have to worry about anything else (**NoOps**).

## Basic flow

[GitHub action](https://github.com/features/actions+external) workflows are defined by YAML files
in the `.github/workflows/` directory of our repository. Let's add a new flow that will
create and deploy staging environment for each pull request. But first we need to create
a new repository secret called `FLY_API_TOKEN` to use for authentication. Go to a GitHub
repository page and open:

 _Settings (tab) → Security → Secrets and variables → Actions → Repository secrets → New repository secret_

next, create a new secret called `FLY_API_TOKEN` with a value from:

```cmd
fly tokens org <ORG NAME>
```

<section class="callout">
It's also possible to create a token from the organization dashboard, under the "Tokens" tab.
</section>

Now, we're ready to add a new flow. This is how we can define it in the
`.github/workflows/fly_pr_preview.yml` file:

```yaml
# .github/workflows/fly_pr_preview.yml

name: Start preview app

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened, closed]

concurrency:
  group: ${{ github.workflow }}-pr-${{ github.event.number }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

jobs:
  preview-app:
    if: contains(github.event.pull_request.labels.*.name, 'PR preview app')
    runs-on: ubuntu-latest
    name: Preview app
    environment:
      name: pr-${{ github.event.number }}
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Deploy preview app
        uses: superfly/fly-pr-review-apps@1.2.0
        id: deploy
        with:
          region: waw
          org: personal
```

It's time to split our configuration up into its component parts:

- `on → pull_request → types`: specifies [events](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request+external)
  on which a new staging project will be deployed:

```yaml
pull_request:
  types: [labeled, synchronize, opened, reopened, closed]
```

- `concurrency`: prevents concurrent deploys for the same PR (Pull Request). The `group`
  name contains a PR number and workflow name to create a separate group for each
  workflow and PR:

```yaml
concurrency:
  group: ${{ github.workflow }}-pr-${{ github.event.number }}
  cancel-in-progress: true
```

- `env`: makes the `FLY_API_TOKEN` secret available to use for authentication:

```yaml
env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

- `jobs → preview-app → if`: skips deploy on PRs without the
  <span class="bg-indigo-500 rounded text-white px-1 py-1">_PR preview app_</span>
  label. Both for safety reasons and to avoid creating a staging environments when no
  needed:

```yaml
if: contains(github.event.pull_request.labels.*.name, 'PR preview app')
```

- `jobs → preview-app → environment`: describes the deployment target to show up in a
  pull request UI. `steps.deploy.outputs.url` is filled by the
  `superfly/fly-pr-review-apps` and will contain the URL of a deployed staging project:

```yaml
environment:
  name: pr-${{ github.event.number }}
  url: ${{ steps.deploy.outputs.url }}
```

- `jobs → preview-app → steps → with`: specifies all inputs that we want to pass to our
  flow. You can check available options in the
  [README](https://github.com/superfly/fly-pr-review-apps#inputs+external). We pass the Fly.io
  [region](https://fly.io/docs/reference/regions/#fly-io-regions) and organization as a
  starting point:

```yaml
with:
  region: waw
  org: personal
```

The action configured in this way will deploy an app with the name created according to
the following pattern:

<div class="text-center justify-center items-center">
`pr-{{ PR number }}-{{ repository owner }}-{{ repository name }}`
</div>
to the: `https://{{ app name }}.fly.dev`, e.g.

<div class="text-center justify-center items-center">
`https://pr-9-felixxm-fly-pr-preview-example.fly.dev/`
</div>

(for PR number 9 in the repository called `pr-preview-example`).

## Using Postgres cluster

Using a dedicated staging database is a good practice for test environments. This gives
us more control and appropriate separation from the production environment which
eliminates a potential data leak vector.

If you don't have a [Postgres cluster](https://fly.io/docs/postgres/) specifically for
testing purposes you can create one with [`fly postgres create`](https://fly.io/docs/flyctl/postgres-create/):

```cmd
fly postgres create --name pg-fly-pr-staging-preview
```

Once created, we can specify it in our action (`jobs → preview-app → steps → with`)
using the `postgres` input:

```yaml
# .github/workflows/fly_pr_preview.yml

name: Start preview app

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened, closed]

concurrency:
  group: ${{ github.workflow }}-pr-${{ github.event.number }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

jobs:
  preview-app:
    if: contains(github.event.pull_request.labels.*.name, 'PR preview app')
    runs-on: ubuntu-latest
    name: Preview app
    environment:
      name: pr-${{ github.event.number }}
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Deploy preview app
        uses: superfly/fly-pr-review-apps@1.2.0
        id: deploy
        with:
          postgres: pg-fly-pr-staging-preview  # ← Added
          region: waw
          org: personal
```

With that in place, our staging Postgres cluster will be automatically attached to the
test app, which will make a `DATABASE_URL` environment variable available in the test
VM.

## Additional release steps

For performing additional release steps when deploying our staging environment, we can
use a custom [Fly.io TOML configuration file](https://fly.io/docs/reference/configuration/)
dedicated for staging with a release script
[to run before a deployment](https://fly.io/docs/reference/configuration/#run-one-off-commands-before-releasing-a-deployment).
First, make a copy of an existing configuration:

```cmd
mkdir staging
```
```cmd
cp fly.toml staging/fly_staging.toml
```

Next, create a script (`staging/post_deploy.sh`) to prepare our staging database:

```bash
# staging/post_deploy.sh
#!/usr/bin/env bash

# Migrate database.
python /code/manage.py migrate
# Load fixtures with test data.
python /code/manage.py loaddata /code/staging/test_groups.json
```

Finally, we need to add `release_command` to the TOML configuration calling our script:

```toml
# staging/fly_staging.toml

console_command = "/code/manage.py shell"

[build]

[env]
  PORT = "8000"

[deploy]
  release_command = "sh ./staging/post_deploy.sh" # ← Added.

...
```

and specify the custom TOML configuration in our action
(`jobs → preview-app → steps → with`) using the `config` input:

```yaml
# .github/workflows/fly_pr_preview.yml

name: Start preview app

on:
  pull_request:
    types: [labeled, synchronize, opened, reopened, closed]

concurrency:
  group: ${{ github.workflow }}-pr-${{ github.event.number }}
  cancel-in-progress: true

permissions:
  contents: read

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

jobs:
  preview-app:
    if: contains(github.event.pull_request.labels.*.name, 'PR preview app')
    runs-on: ubuntu-latest
    name: Preview app
    environment:
      name: pr-${{ github.event.number }}
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Deploy preview app
        uses: superfly/fly-pr-review-apps@1.2.0
        id: deploy
        with:
          config: staging/fly_staging.toml  # ← Added
          postgres: pg-fly-pr-staging-preview
          region: waw
          org: personal
```

With this small effort we have staging database created on Fly.io!

🚨 Be aware that `release_command` is run on a temporary VM and cannot modify the
local storage or state. It's fine to run database operations but not to perform release
steps that attempt to modify a local storage, e.g. collecting static files. Such steps
should be added to the `Dockerfile`. For example, if we want to collect static files,
then add the `collectstatic` management command to the `Dockerfile`:

```docker
ARG PYTHON_VERSION=3.10-slim-bullseye

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code

WORKDIR /code

COPY requirements.txt /tmp/requirements.txt
RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/
COPY . /code

# ↓ Added ↓
RUN set -ex && \
    python /code/manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "hello_pr_preview_example.wsgi"]
```
