---
title: Speedrun! Deploying to Fly!
layout: docs
sitemap: false
nav: firecracker
toc: false
---

You have an application you want to deploy on Fly? 
You already know your stuff? Specifically Docker? Good! 

If not, head to our [hands-on for Docker images](/docs/hands-on/start/) or guides for [Go](/docs/getting-started/golang/) and [Node](/docs/getting-started/node/) applications.

## _Start your speed run now_

1. [Install Flyctl](/docs/getting-started/installing-flyctl/) - you'll need it.
2. Sign up/Log in to Fly - run `flyctl auth signup` to create an account or `flyctl auth login` to log in.
3. Run `flyctl launch` - create, configure, and deploy a new application by inspecting your source code
4. Run `flyctl info` - show you the hostname where your app is deployed.
5. Run `flyctl open` - open your browser and direct it to your app.
6. Point your browser or other app at that hostname. **That's your app running globally.**

<figure class="w:full mt:6">
  <img src="/public/images/speedrun.jpg" srcset="/public/images/speedrun@2x.jpg 2x" alt="">
</figure>
