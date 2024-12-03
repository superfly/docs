---
title: "Git Branch Preview Environments on Github"
layout: docs
nav: firecracker
categories:
  - ci
  - github
  - guide
  - review apps
  - cd
redirect_from: /docs/app-guides/review-apps-guide/
---

Review apps are a great way to preview new features, changes, and bug fixes. This guide will teach you how to automatically generate ephemeral "review apps" on Fly.io for each pull request (PR) using GitHub Actions. This approach can be applied to other Git services and source code versioning software that supports branching and hooks.

## Quick Start

If you've worked with GitHub Actions before and want to jump right in, here are the steps to take:

1. Create a new repository secret on your GitHub repository called `FLY_API_TOKEN` and provide it with the returned value of `fly tokens org <ORG NAME>`
1. Create a new workflow in your project at `.github/workflows/fly-review.yml` and add the following [YAML code](https://gist.github.com/anniebabannie/3cb800f2a890a6f3ed3167c09a0234dd).
1. Commit and push the changes containing your GitHub workflow.

And that's it! Any new pull requests will trigger the creation of review apps for your application.

By default, review apps will be available at `https://pr-<PR number>-<repository owner>-<repository name>.fly.dev`.

The workflow described above will spin up a **single application** without other resources; if data stores, multiple Fly Apps, or other resources are required, see [Customizing your workflow](#customize-your-workflow).


For more details about each step, follow the guide below.

## Setting up review apps on Fly.io

### Set your Fly API token

Your GitHub Action will need a Fly API token to deploy and manage new review apps on Fly.io. You can get this token using the following [flyctl](/docs/flyctl/install/) command:

```cmd
fly tokens org <ORG NAME>
```

This token is specific to a single Fly.io organization and is valid for applications belonging the that organization.

Next, let's save our API token as a secret in our GitHub repository. Visit the Settings tab in your repository, then Secrets and variables → Actions. Alternatively, you can visit `https://github.com/<username or org>/<repository>/settings/secrets/actions`. There, create a new **Repository Secret** called `FLY_API_TOKEN` with the value of your token.

### Create your GitHub Action

Next, let's create a new GitHub Action by creating a new YAML file in your app's repository for our workflow:

```cmd
touch .github/workflows/fly-review.yml
```

Then add the following to your new `fly-review.yml` file:

```yaml
name: Deploy Review App
on:
  # Run this workflow on every PR event. Existing review apps will be updated when the PR is updated.
  pull_request:
    types: [opened, reopened, synchronize, closed]

env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
  # Set these to your Fly.io organization and preferred region.
  FLY_REGION: iad
  FLY_ORG: personal

jobs:
  review_app:
    runs-on: ubuntu-latest
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    # Only run one deployment at a time per PR.
    concurrency:
      group: pr-${{ github.event.number }}

    # Deploying apps with this "review" environment allows the URL for the app to be displayed in the PR UI.
    # Feel free to change the name of this environment.
    environment:
      name: review
      # The script in the `deploy` sets the URL output for each review app.
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Get code
        uses: actions/checkout@v4

      - name: Deploy PR app to Fly.io
        id: deploy
        uses: superfly/fly-pr-review-apps@1.2.1
```

In the `deploy` step, `superfly/fly-pr-review` contains the custom Action with a shell script that creates and deploys your review apps. If you're curious, check out [entrypoint.sh](https://github.com/superfly/fly-pr-review-apps/blob/main/entrypoint.sh) for full details on how the script works.

### Commit and push your workflow

Finally, commit and push your changes to your GitHub repository. Once pushed, any new PRs will spin up a review app for you to preview your code on Fly.io.

## Customize your workflow

Often our applications do not operate in isolation and require other resources to function. The sample workflow mentioned above spins up a stand-alone Fly App, but you can customize your `fly-review.yml` GitHub workflow to create additional Fly Apps and resources, such as a Redis, Memcached, etc. You can find examples of these in the [README](https://github.com/superfly/fly-pr-review-apps/tree/main) for `superfly/fly-pr-review-apps`.

### Customize with inputs

The `superfly/fly-pr-review-apps` custom GitHub Action also provides a number of **inputs** that can be added to tweak behavior. See the [README](https://github.com/superfly/fly-pr-review-apps/tree/main) for the complete list.

These inputs can be added to the `deploy` step in your workflow using the `with` key, like so:

```yaml
# fly-review.yml
# ...
    steps:
      # ...
      - name: Deploy PR app to Fly.io
        id: deploy
        uses: superfly/fly-pr-review-apps@1.2.0
        with:
          name: my-app-name-pr-${{ github.event.number }}
          config: fly.review.toml
```

### Defining resource specs

You probably won't need the same specifications for the Fly Machines used by review apps as you do for your production app. There are two ways to override the resources used in review apps.

**1. Specifying a different `config` file:** By default, review apps will use the `fly.toml` in your application root, but you can create a separate TOML file with different specs using the `config` input, like so:

```yaml
# fly-review.yml
# ...
    steps:
      # ...
      - name: Deploy PR app to Fly.io
        id: deploy
        uses: superfly/fly-pr-review-apps@1.2.0
        with:
          config: fly.review.toml
```

**2. Setting specs in GitHub Action inputs:** Alternatively, you can set the specs for the Fly Machines used by your review apps using the following inputs:

- `vmsize`
- `cpu`
- `cpukind`
- `memory`
- `ha`

### Default secrets and environment variables

We recommend setting default values for any secrets or environment variables your review apps require so you don't have to set them individually. You can do this by defining each secret as either a **repository secret** _or_ an **environment secret** in your GitHub repo. If using environment secrets, these should be set on the environment used in your workflow, such as `review`.

Once you have your secrets and environment variables set in GitHub, add each of them to your `fly-review.yml` workflow, separated by a space, like so:

```yaml
# fly-review.yml
# ...
    steps:
      # ...
      - name: Deploy PR app to Fly.io
        id: deploy
        uses: superfly/fly-pr-review-apps@1.2.0
        with:
          secrets: FOOBAR=${{ secrets.FOOBAR }} SOME_API_KEY=${{ secrets.SOME_API_KEY}}
```
