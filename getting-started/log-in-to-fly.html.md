---
title: Log in to Fly
layout: docs
sitemap: false
nav: firecracker
toc: false
---

If you haven't installed flyctl yet, you'll need it to work with Fly.io. Details on how to do that are available in [Install flyctl](/docs/hands-on/install-flyctl/).

## Already got a Fly.io account? Log in.

If you already have a Fly.io account, you can log in with flyctl by running:

```cmd
fly auth login
```

Your browser will open up with the Fly.io sign-in screen; enter your user name and password to sign in. If you signed up with GitHub, use the `Sign in with GitHub` button to sign in.

Microsoft WSL users may need to run the following command to make this work:

```cmd
ln -s /usr/bin/wslview /usr/local/bin/xdg-open
```

Now proceed to globally deploying Docker Images, Go Applications, Node Applications and more.

## First-Time or No Fly.io account? Sign up for Fly.io.

If you haven't got a Fly.io account, you'll need to create one by running:

```cmd
fly auth signup
```

This will open your browser on the sign-up page where you can either:

* **Sign-up With Email**: Enter your name, email and password.
* **Sign-up With GitHub**: If you have a GitHub account, you can use that to sign-up. Look out for the confirmatory email we'll send you which will give you a link to set a password; you'll need a password set so we can actively verify that it is you for some Fly.io operations.

You will also be prompted for credit card payment information, required for charges outside the free allowances on Fly.io. See [Pricing](/docs/about/pricing) for more details on that. If you do not enter details here, you will be unable to create an application on Fly.io until you add a credit card to your account.

Now proceed to globally deploying Docker Images, Go Applications, Node Applications and more.

## Next Steps

* Deploying with:
  * [Node](/docs/getting-started/node/) - Nodejs and Express
  * [Go](/docs/getting-started/golang/) - Go and the Gin/Gonic web framework
  * [Ruby](/docs/getting-started/ruby/) - Ruby and Sinatra
  * [Deno](/docs/getting-started/deno/) - Deno and Dinatra
  * [Elixir](/docs/elixir/getting-started/) - Elixir, Phoenix, and Postgres
  * [Static Web Server](/docs/getting-started/static/) - HTML and a compact web server.
* And there's more information in [Working with Fly Apps](/docs/getting-started/working-with-fly-apps/)
* When it doesn't go right, check out our [Troubleshooting Deployments](/docs/getting-started/troubleshooting/) page.

