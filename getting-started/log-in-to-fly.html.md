---
title: Log in to Fly
layout: docs
sitemap: false
nav: firecracker
toc: false
---

If you haven't installed flyctl yet, you'll need it to work with Fly. Details on how to do that are available in [Installing Flyctl](/docs/getting-started/installing-flyctl.html).

## Already got a Fly account? Log in to Fly

If you already have a Fly account, you can log in with Flyctl by running:

```cmd
flyctl auth login
```

Your browser will open up with the Fly sign-in screen, enter your user name and password to sign-in. If you signed up with GitHub, use the `Sign-in with GitHub` button to sign in.

Now proceed to globally deploying Docker Images, Go Applications, Node Applications and more.

## First-Time or No Fly account? Sign up for Fly.

If you haven't got a Fly account or it's your first time on Fly, you'll need to get an account by running:

```cmd
flyctl auth signup
```

This will open your browser on the sign-up page where you can either:

* **Sign-up With Email**: Enter your name, email and password.
* **Sign-up With GitHub**: If you have a GitHub account, you can use that to sign-up. Look out for the confirmatory email we'll send you which will give you a link to set a password; you'll need a password set so we can actively verify that it is you for some Fly operations.

You will also be prompted for credit card payment information, required for charges outside the free plan on Fly. See [Pricing](/docs/about/pricing) for more details on that. If you do not enter a details here, you will be unable to create a new application on Fly until you add a credit card to your account.

Now proceed to globally deploying Docker Images, Go Applications, Node Applications and more.

## Next Steps

* Deploying with:
  * [Node](/docs/getting-started/node/) - Nodejs and Express
  * [Go](/docs/getting-started/golang/) - Go and the Gin/Gonic web framework
  * [Ruby](/docs/getting-started/ruby/) - Ruby and Sinatra
  * [Deno](/docs/getting-started/deno/) - Deno and Dinatra
  * [Elixir](/docs/elixir/getting-started/) - Elixir, Phoenix, and Postgres
  * [Static Web Server](/docs/getting-started/static/) - HTML and a compact web server.
* And there's more information in [Working with Fly apps](/docs/getting-started/working-with-fly-apps/)
* When it doesn't go right, checkout our [Troubleshooting Deloyments](/docs/getting-started/troubleshooting/) page.

