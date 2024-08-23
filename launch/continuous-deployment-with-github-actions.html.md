---
title: "Continuous Deployment with Fly.io and GitHub Actions"
layout: docs
nav: apps
redirect_from: /docs/app-guides/continuous-deployment-with-github-actions/
categories:
  - ci
  - github
  - guide
---

<img src="/static/images/continuous-deployment.webp" alt="A man writing code on a vintage desktop computer" class="rounded-xl">

This guide works through setting up your app for continuous deployment to Fly.io from the app's GitHub repository. You might also like our blueprint on [deploying review apps with GitHub Actions](/docs/blueprints/review-apps-guide/).

You'll start with an example application called [go-example](https://github.com/fly-apps/go-example+external). It's a simple, lightweight app that displays the Fly.io region that served the request.

The first section is a speed-run through the steps to make the go-example app automatically deploy to Fly.io from GitHub. The next section loops back for a [longer look at each step](#a-longer-look-at-the-deployment-process).

## Speed-run your way to continuous deployment

1. Fork the [go-example](https://github.com/fly-apps/go-example+external) repository to your GitHub account.
2. Clone the new repository to your local machine.
3. Run `fly launch --no-deploy` from within the project source directory to create a new app and a `fly.toml` configuration file. 
4. Type `y` to when prompted to tweak settings and enter a name for the app. Adjust other settings, such as region, as needed. Then click **Confirm Settings**.
5. Still in the project source directory, get a Fly API deploy token by running `fly tokens create deploy -x 999999h`. Copy the output, including the `FlyV1` and space at the beginning.
6. Go to your newly-created repository on GitHub and select **Settings**.
7. Under **Secrets and variables**, select **Actions**, and then create a new repository secret called `FLY_API_TOKEN` with the value of the token from step 5.
8. Back in your project source directory, create `.github/workflows/fly.yml` with these contents:
    
    ```yaml
    name: Fly Deploy
    on:
      push:
        branches:
          - master    # change to main if needed
    jobs:
      deploy:
        name: Deploy app
        runs-on: ubuntu-latest
        concurrency: deploy-group    # optional: ensure only one action runs at a time
        steps:
          - uses: actions/checkout@v4
          - uses: superfly/flyctl-actions/setup-flyctl@master
          - run: flyctl deploy --remote-only
            env:
              FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    ```

      <div class="note icon">
      **Note:** The `go-example`’s default branch is `master`. If you’re using a different app, yours might be `main`. Change the `branches` value in the `fly.yml` file accordingly.
      </div>

9. Commit your changes and push them up to GitHub. You should be pushing two new files: `fly.toml`, the [Fly Launch](/docs/launch/) configuration file, and `fly.yml`, the GitHub action file.
  
Then the magic happens - The push triggers a deploy, and from now on whenever you push a change, the app will automatically be redeployed.

If you want to watch the process take place, head to the repository and select the **Actions** tab, where you can view live logs of the commands running.

## A longer look at the deployment process

### `fly.toml` and the repository

**Step 1** is a simple GitHub Fork; there's not a lot to say about that except that you need to do it, because you want control of the repository that you're deploying from.

**Step 2** is just cloning the repository to your local system so that you can edit and push changes to it.

**Steps 3 and 4** create a new app on Fly.io and a `fly.toml` configuration file to go into the repository.

<div class="callout">
A note about `fly.toml` in repositories: Usually, when Fly.io ships examples, we avoid putting the `fly.toml` file in the repository by including `fly.toml` in the `.gitignore` file. And users should be creating their own `fly.toml` with the `fly launch` command. When using GitHub Actions though, you want your `fly.toml` in the repository so that the action can use it in the deployment process.
</div>

### API tokens

**Step 5** is about getting an API token. You can generate a deploy token to use to authorize a specific application. That's what `flyctl tokens create deploy -x 999999h` gives you. Remember to copy the whole token from the output, including the `FlyV1` and space at the beginning.
For a more powerful token that can manage multiple applications, run `flyctl auth token`.

**Steps 6 and 7** make your new token available to GitHub Actions that run against your repository. You'll add the token as a secret in the repository's settings. Under the **Settings** tab, go to **Secrets and variables** and select **Actions**. Click on the green "New repository secret" button, enter the name as `FLY_API_TOKEN`, and copy the token as the secret.

If you'd prefer an environment secret instead, then you need to list the environment you selected in your deploy step.  For example:

```yaml
deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    environment: production
```

### Building the workflow and deployment

**Step 8** is the heart of the process, where you put in place a workflow. Now, GitHub has a UI which allows you to select and edit workflows, but you can also modify them as part of the repository. So you create `.github/workflows/fly.yml` - you'll likely want to `mkdir -p .github/workflows` to quickly create the directories - and load up the file with a GitHub Action recipe.

GitHub Action recipe, line by line:

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
      concurrency: deploy-group
```

An action is made up of named jobs, in this case one job to deploy the application. The jobs run on a virtual machine. This section gives the "deploy" job the name "Deploy app" and tells GitHub Actions to run it on a virtual machine with the latest version of Ubuntu on it. Optionally, use the `concurrency` key with a custom group name to ensure that only one action runs at a time for that group. 

The next part is to set up the steps needed to complete this job.

```yaml
      steps:
        - uses: actions/checkout@v4
```

The first step is one of the built in Actions steps. The step `uses` the [`checkout@v4` action](https://github.com/marketplace/actions/checkout+external) which checks out the repository into a directory on the virtual machine. You're now ready to deploy.

```yaml
        - uses: superfly/flyctl-actions/setup-flyctl@master
        - run: flyctl deploy --remote-only
```

This step `uses` the [superfly/flyctl-actions action](https://github.com/marketplace/actions/github-action-for-flyctl+external). This is a GitHub action created by Fly.io which wraps around the `flyctl` command. The wrapper is invoked with the `deploy` argument which will take over the process of building and moving the application to the Fly.io infrastructure. It uses the settings from the `fly.toml` file to guide it and uses the `FLY_API_TOKEN` to authorize its access to the Fly.io GraphQL API.

```yaml
          env:
            FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

This pulls the API token from GitHub's secrets engine and puts it into the environmental variables passed to the action.

**Step 9** pushes your two new files to the repository: `fly.toml`, the app configuration file, and `fly.yml`, the GitHub action file. The push triggers your first automatic deploy. The GitHub action now triggers a redeploy each time you push changes to your repo.

## Conclusion and further reading

And that's the deployment process. You can, of course, leverage the GitHub Actions environment to manage more intricate deployments, interact with other applications&mdash;say to send Slack messages on completion&mdash;or whatever else you can dream up.

**Read:**

* [Blueprint: Deploy review apps with GitHub Actions](/docs/blueprints/review-apps-guide/)
* [Deploy Tokens](/docs/reference/deploy-tokens/)
* [GitHub Actions Documentation](https://docs.github.com/en/actions+external)

**See:**

* [GitHub Actions for flyctl](https://github.com/superfly/flyctl-actions+external)
