---
title: Signing up for Fly
layout: docs
sitemap: false
nav: hands_on
toc: false
---

If it’s your first time using Fly, you’ll need to sign up for an account. To do so, run:

```cmd
flyctl auth signup
```

This will take you to the sign-up page where you can either:

* **Sign-up with email**: Enter your name, email and password.

* **Sign-up with github**: If you have a GitHub account, you can use that to sign up. Look out for the confirmatory email we'll send you which will give you a link to set a password; you'll need a password set so we can actively verify that it is you for some Fly operations.

You will also be prompted for credit card payment information, required for charges outside the free tier on Fly. See [Pricing](/docs/about/pricing) for more details on what is included in the free tier. If you do not enter a details here, you will be unable to create a new application on Fly until you add a credit card to your account.

Whichever route you take you will be signed up, signed in, and returned to your command line, ready to use Fly.

[Next: Creating a Fly App](/docs/hands-on/create-app/)
