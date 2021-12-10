---
title: Viewing an App on Fly
layout: docs
sitemap: false
nav: hands_on
toc: false
---

Now the application has been deployed, let's find out more about its deployment. The command `flyctl status` will give you all the essential details.

```cmd
flyctl status
```
```output
App
  Name     = hellofly
  Owner    = dj
  Version  = 0
  Status   = running
  Hostname = hellofly.fly.dev

Allocations
ID       VERSION REGION DESIRED STATUS  HEALTH CHECKS      RESTARTS CREATED
987e3ac2 0       fra    run     running 1 total, 1 passing 0        58s ago
$
```

As you can see, the application has been deployed with a DNS hostname of hellofly.fly.dev. Your deployment's name will, of course be different. We can also see that one instace of the app is now running in the fra (Frankfurt) region. Next, we connect to it.

[Next: Connecting to Your App](/docs/hands-on/connecting-to-an-app/)

