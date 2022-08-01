---
title: "Getting Started"
layout: docs
sitemap: false
nav: firecracker
---

<figure>
  <img src="/public/images/docs-guide.jpg" srcset="/public/images/docs-guide@2x.jpg 2x" alt="">
</figure>



<div style="display: grid; gap: 1px; grid-template-columns: repeat(auto-fit, 11em);">
   <div class="px-4 py-4 bg-violet-500 text-white opacity-75">
  <a href="/docs/getting-started/launching/">Use a Fly Launcher to create an app from your source code</a>
  </div>

 
</div>

<br>





This section of the Fly docs is all about getting you up and running quickly.

[Installing Flyctl](/docs/getting-started/installing-flyctl) will take you through the, few, steps you need to perform to get the Fly command line available. Don't forget to [create an account and login](/docs/getting-started/log-in-to-fly/) too.

Once that is done, you're ready to take on the Getting Started language and application guides.

Need to do something about the hands-on section

[Rough start on a "Creating a new app" reference or getting started or hands-on entry.](/docs/startref/)


If you have an app running on Heroku, you may prefer to dip your toes in by cloning it to Fly.io with our [Turboku](https://fly.io/launch/heroku) web launcher. Read about it in the [New Turboku launch post](https://fly.io/blog/new-turboku/).

## Language Guides

Each one of the language guides will take you through creating a simple application, building it with Fly's own builtin builders and deploying it.

* [Node](/docs/getting-started/node/) - Nodejs and Express
* [Go](/docs/getting-started/golang/) - Go and the Gin/Gonic web framework
* [Ruby](/docs/getting-started/ruby/) - Ruby and Sinatra
* [Deno](/docs/getting-started/deno/) - Deno and Dinatra
* [Elixir](/docs/getting-started/elixir/) - Elixir, Phoenix, and Postgres

## Application Guides

The application guides show how you can use Fly to deploy existing applications, with no building needed, to get web servers and other services online quickly.

* [Static Web Server](/docs/getting-started/static/) - Serves any and all content in the project directory from a compact web server.

## Deeper into Fly

The last part of this section widens your Fly knowledge. There is a tour through the commands you'll need to work with Fly apps through their entire lifecycle and a troubleshooting section for those occasional moments when things don't go as expected.

* [Working with Fly apps](/docs/getting-started/working-with-fly-apps/) covers
  * Finding out about your app - the `info` and `status` commands
  * Viewing app logs
  * Managing secrets for an app
  * Adding hostnames and creating certificates 
* [Troubleshooting Deployments](/docs/getting-started/troubleshooting/) covers
  * Port settings and checking them
  * Reviewing deployment logs
  * Checking your app's host binding



