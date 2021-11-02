---
title: "Continuous Deployment with Fly and GitHub Actions"
layout: docs
sitemap: false
nav: firecracker
author: dj
categories:
  - ci
  - github
  - guide
priority: 10
date: 2020-06-20
---

<figure class="flex ai:center jc:center w:full r:lg overflow:off mb:4">
  <img class="m:0" src="/public/images/continuous-deployment.jpg" alt="A man writing code on a vintage desktop computer" class="w:full h:full fit:cover">
</figure>

So you want to have your Fly application being continuously deployed from its GitHub repository. Let's work through setting up an application for just that.

We'll start with an application from one of our other examples, [go-example](https://github.com/fly-apps/go-example). It's a simple lightweight app, built with a Dockerfile.

We'll speed-run through the steps needed to make this automatically deploy to Fly from GitHub and then we'll loop back for a longer look at some of the steps. 

## Speed-run your way to continuous deployment

1.  Fork [`go-example`](https://github.com/fly-apps/go-example) to your own GitHub repository.
2.  Get a Fly API token with `flyctl auth token`.
3.  Go to your newly created repository on GitHub and select Settings.
4.  Go to Secrets and create a secret called `FLY_API_TOKEN` with the value of the token from step 2
5.  Clone the repository to your local machine to edit it
6.  Edit .gitignore and remove fly.toml - fly.toml will need to be pushed into the repository to allow deployment to happen.
7.  Run `flyctl apps create` to create a fly.toml file.
8.  Create `.github/workflows/main.yml` with these contents
    ```yaml
    name: Fly Deploy
    on: [push]
    env:
      FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    jobs:
      deploy:
          name: Deploy app
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v2
            - uses: superfly/flyctl-actions@1.1
              with:
                args: "deploy"
    ```      
    
9.  Commit your changes and push them up to GitHub.
10. This is where the magic happens - The push will have triggered a deploy and from now on whenever you push a change, the app will automatically be redeployed.

If you want to watch the process take place, head to the Repository and select the **Actions** tab where you can view live logs of the commands running.

## A longer look at the deployment process

**Step 1**, is a a simple GitHub Fork; there's not a lot to say about that except that you need to do it because you want control of the repository that you are deploying from.

### API Tokens and deployment

**Step 2** is all about getting an API token. Once you are logged in with `flyctl` you can request its API token to use to authorize applications. That's what `flyctl auth token` gives you.

**Step 3 and 4**: Now you have a token you need to make it available to GitHub Actions that run against your repository. For that, there's secrets in the repository's settings. Pop our secret under the `FLY_API_TOKEN` name and we can move on.

### fly.toml and the Repository

**Step 5** is just cloning the repository to your local system so you can edit and push changes to it.

**Step 6** is an interesting step - when we ship examples, we avoid putting the `fly.toml` file in the repository by including `fly.toml` in the `.gitignore` file. Users should be creating their own with `fly apps create`. When using GitHub Actions though, we want `fly.toml` in the repository so the action can use it in the deployment process. 

So, we pull `fly.toml` out of  the `.gitignore`. Which then allows us to perform Step 7.

**Step 7**: Creating a fly.toml file to go into the repository.

### Building the workflow

**Step 8** is the heart of the process, where we put in place a workflow. Now, GitHub has a UI which allows you to select and edit workflows, but you can also modify them as part of the repository. So we create `.github/workflows/main.yml` - you'll likely want to `mkdir -p .github/workflows` to quickly create the directories - and load up the file with a GitHub Action recipe. We'll go through it line by line now:

```yaml
name: Fly Deploy
```

This sets the displayed name for the action.

```yaml
on: [push]
```

When should this action be run. There's lots of options but in this case, in response to any `push` to the repository.

```yaml
env:
  FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Remember our API token from earlier? Well, here is where we pull it from GitHub's secrets engine and put it into the environmental variables passed to the action.

```yaml
jobs:
  deploy:
      name: Deploy app
      runs-on: ubuntu-latest
```

So an action is made up of named jobs, in this case one to deploy the application. The jobs run on a virtual machine. Here we are giving the "deploy" job the name "Deploy app" and telling GitHub Actions to run it on a virtual machine with the latest version of Ubuntu on it. The next part is to set up the steps needed to complete this job.

```yaml
      steps:
        - uses: actions/checkout@v2
```

The first step is one of the built in Actions steps. The step `uses` the `checkout@v2` action which checks out the repository into a directory on the virtual machine. We are now ready to deploy.

```yaml
        - uses: superfly/flyctl-actions@1.1
          with:
            args: "deploy"
```

This step `uses` the superfly/flyctl-actions action. This is a GitHub action created by Fly which wraps around the `flyctl` command. The wrapper is invoked with the `deploy` argument which will take over the process of building and moving the application to the Fly infrastructure. It uses the settings from the `fly.toml` file to guide it and uses the `FLY_API_TOKEN` to authorize its access to the Fly API.

## Conclusion and further reading

And that's the deployment process. You can, of course, leverage the GitHub Actions environment to manage more intricate deployments, interact with other applications - say to send Slack messages on completion - or whatever else you can dream of.

**Read:**

* [GitHub Actions Documentation](https://help.github.com/en/actions)

**See:**

* [GitHub Actions for flyctl](https://github.com/superfly/flyctl-actions)





