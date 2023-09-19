---
title: Application Monitoring by Sentry
layout: docs
sitemap: false
nav: firecracker
---

[Sentry](https://sentry.io) is a developer-first application monitoring platform that helps you identify and fix software problems before they impact your users. Get real time alerts on production errors and performance issues, capture video-like reproductions of user interactions, and avoid regressions with test coverage insights in your stack trace. 

We partnered with Sentry to give your Fly.io organization a year's worth of [Team Plan](https://sentry.io/pricing) credits. This plan includes, monthly:

* 50k errors
* 100k [performance units](https://docs.sentry.io/product/performance/transaction-summary/?original_referrer=https%3A%2F%2Fduckduckgo.com%2F#what-is-a-transaction)
* 500 [session replays](https://docs.sentry.io/product/session-replay)
* 1GB [attachments](https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/attachments/)

If you need more than this, sign in to your account and review upgrade options in the [billing section](https://flyio.sentry.io/settings/billing/overview/).

## Account and project provisioning


Newly-deployed applications provision a new Sentry project automatically. You can also provision Sentry projects for existing apps.

The first time a Sentry project is provisioned in your Fly.io organization, we will:

* Create a Sentry account using your Fly.io email address
* Create a Sentry organization mapped to your Fly.io organization

Finally, `SENTRY_DSN` will be set as a secret available in your application runtime environment. This value should be picked up automatically by the Sentry SDK.

## Instrumenting your application with the Sentry SDK

For the following frameworks/runtimes, we'll auto-instrument your app at launch time. Auto-instrumentation is helpful to catch boot errors right out of the gate, when you first deploy your application.

### Ruby on Rails

If `flyctl launch` detects your app as a Rails app, we will:

* Install the [Ruby Sentry SDK](https://github.com/getsentry/sentry-ruby) rubygem
* Add an initializer for automatic exception handling and performance tracing


Sentry can also instrument specific libraries like Sidekiq, Delayed Job, Resque, and more. Check the [Sentry Ruby documentation](https://docs.sentry.io/platforms/ruby/) for more information.

### Other runtimes and frameworks

Learn how to set up your application with the Sentry SDK for your runtime in their extensive [documentation](https://docs.sentry.io/).

## Open the Sentry project dashboard for an application

Use this command to open the dashboard for the Sentry project associated with the current application.

```cmd
flyctl apps errors
```

## Create a Sentry project for an existing app

For applications that don't have a Sentry project setup, use the following command to create one manually.

```cmd
flyctl ext sentry create
```


