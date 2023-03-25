---
title: Delete an App on Fly.io
objective: 
layout: docs
nav: firecracker
order: 110
---

You can scale an App right down to zero Machines if you like. But if you're done with an App forever, you can delete it using `fly destroy <app-name>`. 

Once you destroy an App, you can no longer access any part of it, and you'll no longer be charged for any part of it either. This includes Machines, Volumes, IP addresses, Secrets, Docker images, and so on. Here's a potential footgun: *once you delete a Volume, you can't access its snapshots.* So if you want data off an app's persistent storage, get the data before you delete the app.