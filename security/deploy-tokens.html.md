---
title: Deploy Tokens
layout: docs
nav: firecracker
redirect_from: /docs/reference/deploy-tokens/
---

Whether you're [deploying your app with GitHub Actions](/docs/app-guides/continuous-deployment-with-github-actions/) or running your own CD service, it's best to avoid configuring deployment infrastructure with all-powerful tokens. Deploy tokens can be used with [flyctl](/docs/flyctl/) to manage a single application and its resources.

To get started, generate a deploy token on the Tokens tab of your app dashboard. Alternatively, run `fly tokens create deploy` to generate an app deploy token from the command line. Instruct flyctl to use your new token by setting it in the `FLY_API_TOKEN` environment variable.

```cmd
FLY_API_TOKEN=$(fly tokens create deploy) fly deploy
```

Whereas API tokens (`fly auth token`) can manage all of your organizations' apps, deploy tokens are limited to a single application. Some organization-wide features like managing WireGuard tunnels are integral to deployments and are also accessible to deploy tokens.