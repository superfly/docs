---
title: "Continuous Deployment with Fly.io and GitHub Actions"
layout: docs
sitemap: false
nav: firecracker
categories:
  - ci
  - github
  - guide
priority: 10
date: 2020-06-20
---

<img src="/static/images/continuous-deployment.webp" alt="A man writing code on a vintage desktop computer" class="rounded-xl">

So you want your application continuously deployed to Fly.io from its GitHub repository. Let's work through setting up an application for just that.

We'll start with an application from one of our other examples, [go-example](https://github.com/fly-apps/go-example). It's a simple lightweight app, built with a Dockerfile.

We'll speed-run through the steps needed to make the go-example app automatically deploy to Fly.io from GitHub and then we'll loop back for a longer look at some of the steps.

## Speed-run your way to continuous deployment

1.  Fork the [go-example](https://github.com/fly-apps/go-example) repository to your GitHub account.
2.  Clone the new repository to your local machine.
3.  Run `fly launch` from within the app's root directory to create a new app and a `fly.toml` configuration file. Say `N` to adding databases and `N` to deploy now.
4.  Still in the app's root directory, get a Fly API deploy token by running `fly tokens create deploy -x 999999h`. Copy the output.
5.  Go to your newly-created repository on GitHub and select **Settings**.
6.  Under **Secrets and variables**, select **Actions**, and then create a new repository secret called `FLY_API_TOKEN` with the value of the token from step 4.
7.  Back in your app's root directory, create `.github/workflows/fly.yml` with these contents:
    ```yaml
    name: Fly Deploy
    on:
      push:
        branches:
          - master
    jobs:
      deploy:
        name: Deploy app
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: superfly/flyctl-actions/setup-flyctl@master
          - run: flyctl deploy --remote-only
            env:
              FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    ```

    Note that the `go-example`’s default branch is currently `master`. If you’re using a different app, yours might be `main`. Change the `fly.yml` file accordingly.

8.  Commit your changes and push them up to GitHub. You should be pushing two new files: `fly.toml`, the Fly App configuration file, and `fly.yml`, the GitHub action file.
  
Then the magic happens - The push triggers a deploy, and from now on whenever you push a change, the app will automatically be redeployed.

If you want to watch the process take place, head to the repository and select the **Actions** tab, where you can view live logs of the commands running.

## A longer look at the deployment process

### fly.toml and the Repository

**Step 1** is a simple GitHub Fork; there's not a lot to say about that except that you need to do it, because you want control of the repository that you're deploying from.

**Step 2** is just cloning the repository to your local system so that you can edit and push changes to it.

**Step 3** creates a `fly.toml` file to go into the repository.

<div class="callout">
A note about `fly.toml` in repositories: Usually, when we ship examples, we avoid putting the `fly.toml` file in the repository by including `fly.toml` in the `.gitignore` file. And users should be creating their own `fly.toml` with the `fly launch` command. When using GitHub Actions though, you want your `fly.toml` in the repository so that the action can use it in the deployment process.
</div>

### API Tokens

**Step 4** is about getting an API token. You can generate a deploy token to use to authorize a specific application. That's what `flyctl tokens create deploy -x 9999999h` gives you. For a more powerful token that can manage multiple applications, run `flyctl auth token`.

**Steps 5 and 6** make your new token available to GitHub Actions that run against your repository. You'll add the token as a secret in the repository's settings. Under the **Settings** tab, go to **Secrets and variables** and select **Actions**. Click on the green "New repository secret" button, enter the name as `FLY_API_TOKEN`, and copy the token as the secret.

If you'd prefer an environment secret instead, make sure you list the environment you selected in your deploy step.  For example:

```yaml
deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    environment: production
```

### Building the workflow

**Step 7** is the heart of the process, where we put in place a workflow. Now, GitHub has a UI which allows you to select and edit workflows, but you can also modify them as part of the repository. So we create `.github/workflows/fly.yml` - you'll likely want to `mkdir -p .github/workflows` to quickly create the directories - and load up the file with a GitHub Action recipe. We'll go through it line by line now:

```yaml
name: Fly Deploy
```

This sets the displayed name for the action.

```yaml
on:
  push:
    branches:
      - master
```

When should this action be run. There's lots of options but in this case, in response to any `push` to the repository's `master` branch. If your repository uses a default branch other than `master`, such as `main`, then you should change that here.

```yaml
jobs:
  deploy:
      name: Deploy app
      runs-on: ubuntu-latest
```

So an action is made up of named jobs, in this case one to deploy the application. The jobs run on a virtual machine. Here we are giving the "deploy" job the name "Deploy app" and telling GitHub Actions to run it on a virtual machine with the latest version of Ubuntu on it. The next part is to set up the steps needed to complete this job.

```yaml
      steps:
        - uses: actions/checkout@v3
```

The first step is one of the built in Actions steps. The step `uses` the `checkout@v3` action which checks out the repository into a directory on the virtual machine. We are now ready to deploy.

```yaml
        - uses: superfly/flyctl-actions/setup-flyctl@master
        - run: flyctl deploy --remote-only
```
This step `uses` the superfly/flyctl-actions action. This is a GitHub action created by Fly.io which wraps around the `flyctl` command. The wrapper is invoked with the `deploy` argument which will take over the process of building and moving the application to the Fly.io infrastructure. It uses the settings from the `fly.toml` file to guide it and uses the `FLY_API_TOKEN` to authorize its access to the Fly.io GraphQL API.

```yaml
          env:
            FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Here is where we pull the API token from GitHub's secrets engine and put it into the environmental variables passed to the action.

## Conclusion and further reading

And that's the deployment process. You can, of course, leverage the GitHub Actions environment to manage more intricate deployments, interact with other applications&mdash;say to send Slack messages on completion&mdash;or whatever else you can dream up.

**Read:**

* [Deploy Tokens](/docs/reference/deploy-tokens/)
* [GitHub Actions Documentation](https://docs.github.com/en/actions)

**See:**

* [GitHub Actions for flyctl](https://github.com/superfly/flyctl-actions)





