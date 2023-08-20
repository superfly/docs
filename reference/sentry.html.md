---
title: Error Tracking by Sentry
layout: docs
sitemap: false
nav: firecracker
---

[Sentry](https://sentry.io) is an [open-source](https://github.com/getsentry) hosted service for real-time error tracking and performance monitoring for almost every runtime or framework out there. Beyond these core features, Sentry offers alerting, release tracking, source code integration and much more.

We've partnered with Sentry to give your Fly.io organization a year's worth of [Team Plan](https://sentry.io/pricing) credits. This plan includes, monthly:

* 50,000 errors
* 100k [performance transactions](https://docs.sentry.io/product/performance/transaction-summary/?original_referrer=https%3A%2F%2Fduckduckgo.com%2F#what-is-a-transaction)
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

Learn how to setup your application with the Sentry SDK for your runtime in their extensive [documentation](https://docs.sentry.io/).

For the following frameworks/runtimes, we'll auto-instrument your app at launch time:

* Ruby on Rails

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


