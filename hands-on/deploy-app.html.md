---
title: Deploying an App to Fly
layout: docs
sitemap: false
nav: hands_on
toc: false
---

We are now ready to deploy our containerized app to the Fly platform. At the command line, just run:

```cmd
flyctl deploy
```

This will lookup our `fly.toml` file, and get the app name `hellofly` from there. Then `flyctl` will start the process of deploying our application to the Fly platform. Flyctl will return you to the command line when it's done.

[Next: Viewing Your App on Fly](/docs/hands-on/view-app/)
