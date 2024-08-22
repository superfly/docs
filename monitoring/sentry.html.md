---
title: Application Monitoring by Sentry
layout: docs
nav: firecracker
redirect_from: /docs/reference/sentry/
---

[Sentry](https://sentry.io) is a developer-first application monitoring platform that helps you identify and fix software problems before they impact your users. Through our partnerships with Sentry, each of your Fly organizations can claim a year's worth of [Team Plan](https://sentry.io/pricing) credits.

To configure your application to use Sentry, run this command from your Fly.io application directory.

```cmd
flyctl ext sentry create
```

Use this command to open the dashboard for the Sentry project associated with the current application.

```cmd
flyctl ext sentry dashboard
```

This will:

* Create a Sentry account using your Fly.io email address
* Create a Sentry organization mapped to your Fly.io organization
* Set `SENTRY_DSN` as a secret on your app


`SENTRY_DSN` is available as an environment variable. The Sentry SDK will detect and use it automatically.


## Sentry Plan details

This promotional plan includes, monthly:

* 50k errors
* 100k [performance units](https://docs.sentry.io/product/performance/transaction-summary/?original_referrer=https%3A%2F%2Fduckduckgo.com%2F#what-is-a-transaction)
* 500 [session replays](https://docs.sentry.io/product/session-replay)
* 1GB [attachments](https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/attachments/)

If you need more than this, sign in to your Sentry account and review upgrade options in the **Settings > Usage & Billing > Subscription** section.

Note that if you upgrade from this plan, you may not downgrade back to the promotional Team plan.

## Instrumenting your application with the Sentry SDK

Next, you should instrument your application to start sending exceptions and other events to Sentry.

### Ruby on Rails

Running `bin/rails generate dockerfile --sentry` will:

* Install the [Ruby Sentry SDK](https://github.com/getsentry/sentry-ruby) rubygem
* Add an initializer for automatic exception handling and performance tracing

Sentry can also instrument specific libraries like Sidekiq, Delayed Job, Resque, and more. Check the [Sentry Ruby documentation](https://docs.sentry.io/platforms/ruby/) for more information.

### Other runtimes and frameworks

Learn how to set up your application with the Sentry SDK for your runtime in their comprehensive [documentation](https://docs.sentry.io/).





