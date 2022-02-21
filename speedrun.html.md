---
title: Speedrun! Deploying to Fly!
layout: docs
sitemap: false
nav: firecracker
toc: false
---

You have an application you want to deploy on Fly? You're in the right place. 

## _Deploy your app in three steps_

1. [Install Flyctl](/docs/getting-started/installing-flyctl/) - you'll need it.
2. Create an account with `flyctl auth signup` or login with `flyctl auth login`.
3. Run `flyctl launch` - create, configure, and deploy a new application

That's all your need to do for most applications. The `launch` command prepares your project, optionally attaches a Postgres database, and then deploys. `launch` knows about these kinds of apps:

* [Phoenix](https://phoenixframework.org/)
* [Ruby on Rails](https://rubyonrails.org/)
* [Remix](https://remix.run/)
* [Django](https://www.djangoproject.com/)
* [RedwoodJS](https://redwoodjs.com/)

Launch also works with a Dockerfile. If you're running something else, just find a functional Dockerfile and you're good to go.

If launch fails, don't stress. This is a complicated process. Post the command output in the [community forum](https://community.fly.io) and get help!

## _Next steps_

1. Run `flyctl status` - show the status of the application instances.
2. Run `flyctl open` - open your browser and direct it to your app.

Would you like to know more? You should read up on [private networking](https://fly.io/docs/reference/private-networking/), [volumes](/docs/reference/volumes/), and [global Postgres](https://fly.io/docs/getting-started/multi-region-databases/).



<figure class="w:full mt:6">
  <img src="/public/images/speedrun.jpg" srcset="/public/images/speedrun@2x.jpg 2x" alt="">
</figure>
