---
title: Deploy Tokens
layout: docs
sitemap: false
nav: firecracker
---

<div class="border border-violet-600 bg-violet-50 rounded-l p-4 my-4 text-base text-navy">
Deploy tokens are an experimental feature. They may be less reliable than traditional API tokens. Use them with caution and visit our <a href="https://community.fly.io">community forum</a> for help.
</div>

Whether you're [deploying your app with GitHub Actions](/docs/app-guides/continuous-deployment-with-github-actions/) or running your own CD service, it's best to avoid configuring deployment infrastructure with all-powerful tokens. Deploy tokens can be used with `flyctl` to manage a single application and its resources.

To get started, generate a deploy token on the Tokens tab of your app dashboard. Alternatively, run `flyctl tokens create deploy` to generate an app deploy token from the command line. Instruct `flyctl` to use your new token by setting it in the `FLY_API_TOKEN` environment variable.

```cmd
FLY_API_TOKEN=$(flyctl tokens create deploy) flyctl deploy
```

Whereas API tokens (`fly auth token`) can manage all of your organizations' apps, deploy tokens are limited to a single application. Some organization-wide features like managing Wireguard tunnels are integral to deployments and are also accessible to deploy tokens.