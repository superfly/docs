---
title: GitHub Actions - CICD
layout: framework_docs
objective: Configure continuous integration and development on your Laravel Fly App through GitHub. 
order: 7
---

Laravel applications are alive and bustling with feature updates and revisions. You'll want to add your Laravel Fly App in a GitHub repository for safe-versions-keeping, healthy-code-reviews, and good-old team-code management.

Once you've set up a repository for your Fly App, you can automate your team's deployment workflow with [GitHub Actions](https://docs.github.com/en/actions)---a really neat way to automate most things you'd manually do during and after code reviews!

## _Initialization_
In this section, you'll create a new Laravel application, configure and deploy it as a Fly App, and finally add it to a GitHub repository.

1) Start with a [clean slate](/docs/laravel/): create a new Laravel project and configure it as a deployable Fly app by using the `flyctl` launch command:

```cmd
# Initialize your Laravel project
composer create-project laravel/laravel fly-laravel
cd fly-laravel

# Auto generate your `fly.toml` configuration file: 
# Add in the ams region with --region
# Auto deploy using --now while your at it!
flyctl launch --region ams --now
```

2) Create a new github repository for your current Laravel Fly App. You can create one either through:

a. <b>GitHub Console</b> - Visiting your [create a new repository](https://github.com/new) page in your console

b. <b>GitHub CLI</b> - run the create repo command:
```cmd
gh repo create <repository-name> --public
```

3) Finally, initialize your Laravel Fly App's directory as part of a git repository, and point its remote to the recently created repository above</b>
```cmd
git init
git remote add origin git@github.com:<username>/<repository-name>.git
```

## _GitHub CI Action: Auto Deploy to Fly.io_
Once you have your Laravel application set up with a github repository, you can configure some GitHub Actions to auto deploy your changes. 

In this guide, you'll be using `Fly.io`'s very own [GitHub action template here](https://github.com/superfly/flyctl-actions) to help deploy your application.

1) Generate a `Fly token` with `fly auth token`

2) Then save your newly generated `FLY_API_TOKEN` in your github repository either through the GitHub Console or GitHub CLI:

a. <b>GitHub Console</b> - Open your repository's Settings tab, then add a secret named `FLY_API_TOKEN` under the Secrets section.

b. <b>GitHub CLI</b> - run the command below
```cmd
gh secret set FLY_API_TOKEN --repos <username>/<repository-name>
```
```output
? Paste your secret *******************************************

✓ Set Actions secret FLY_API_TOKEN for <username>/<repository-name>
```

3) Once you have your `FLY_API_TOKEN` safely stored as a secret in your github repository, proceed with creating a GitHub workflow yml file in `.github/workflows/main.yml`:

```cmd
mkdir -p .github/workflows
touch .github/workflows/main.yml
```
```yml
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
        - uses: superfly/flyctl-actions/setup-flyctl@master
        - run: flyctl deploy
```
Let's go through each line above, shall we?
<ul>
  <li><b>name: Fly Deploy</b> => This is the Workflow name</li>
  <li><b>on: [push]</b> => Any push action to the repository triggers the current workflow</li>
  <li><b>env: `FLY_API_TOKEN`</b> => Environment variable set for the GitHub Actions container</li>
  <li><b>jobs:</b> => This is the list of jobs to run for the workflow
    <ul>
      <li><b>name: Deploy app</b> => Each job would have a name</li>
      <li><b>runs-on: ubuntu-latest</b> => Each job would have an container environment we want to run its virtual machine on</li>
      <li><b>steps:</b> => Each job would have a list of steps, see below:
      <ul>
        <li><b>uses: actions/checkout@v2</b> => This is a pre-made GitHub Action. It allows checking out of your repository into the virtual machine spun up for the job</li>
        <li><b>uses: superfly/flyctl-actions/setup-flyctl@master</b> => This is one of Fly.io's pre-made GitHub action. It sets up `flyctl` in the virtual machine spun up for the job</li>
        <li><b>run: flyctl deploy</b> => Need I say more? </li>
      </ul>
      </li>
    </ul>
  </li>
</ul>

4) Save and push your changes with:
```cmd
git add .
git commit -m "Configure auto-deploy through GitHub Actions"
git push
```

5) Visit the Actions tab of your repository and see how your deployment fares!