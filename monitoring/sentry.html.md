---
title: Application Monitoring by Sentry
layout: docs
nav: firecracker
redirect_from: /docs/reference/sentry/
date: 2025-07-21
---

[Sentry](https://sentry.io/) is a developer-first application monitoring platform that helps you identify and fix software problems before they impact your users. Through our partnership with Sentry, each of your Fly organizations can claim a year’s worth of [Team Plan](https://sentry.io/pricing) credits.

## Set up Sentry for your Fly.io app

In your project source directory, run the following command:

```
fly ext sentry create
```

This command will:

- Create a Sentry account using your Fly.io user email
- Create a Sentry organization linked to your Fly.io organization
- Set the `SENTRY_DSN` secret in your app

Once this is complete, your app will have the `SENTRY_DSN` environment variable available at runtime. Most Sentry SDKs will automatically pick this up and begin sending events.

You can open the Sentry dashboard for your app by running:

```
fly ext sentry dashboard
```

## Instrument your application

To start sending events to Sentry, you’ll need to instrument your app with the relevant SDK. See [Sentry's documentation for supported platforms](https://docs.sentry.io/platforms/).

## Sentry Plan details

Your organization receives one year of Sentry’s Team plan, which includes monthly:

- 50k errors
- 100k [performance units](https://sentry.io/changelog/2023-5-9-introducing-performance-units/)
- 500 [session replays](https://sentry.zendesk.com/hc/en-us/articles/27282849806235-How-are-Replays-charged-Is-it-based-on-when-I-hit-play)
- 1GB [attachments](https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/attachments/)

If you need more than these allowances, sign in to your Sentry account and review upgrade options in the **Settings > Usage & Billing > Subscription** section.

<div class="important">
If you upgrade to a paid plan, you will not be able to return to the Fly.io‑sponsored promotional plan.
</div>

## After the one-year plan ends

At the end of the promotional period, your Sentry organization will no longer have access to the sponsored Team plan. You have two options:

### 1. Let the plan expire

- Your organization will be downgraded to the free Developer plan
- Monitoring will continue, but with lower plan limits
- Events sent that exceed the quota will be dropped
- Existing events and logs remain accessible for up to 30 days, based on Sentry's data retention policy

For more information, see [https://sentry.zendesk.com/hc/en-us/articles/27118913621019](https://sentry.zendesk.com/hc/en-us/articles/27118913621019).

### 2. Upgrade to a paid Sentry plan

- You can maintain access to higher quotas and additional features
- You can enable new SSO options (Google, GitHub, etc.)
- You can optionally disable Fly.io SSO

## Updating SSO and login methods

Sentry organizations created via the Fly.io integration use Fly.io SSO by default. After your plan ends (or if you upgrade), you can switch to standard login:

1. Go to **Organization Settings > Auth Settings** in Sentry
1. Click **Disable Fly.io Auth**
1. Sentry will email each organization member to set a password for their account

This allows you to log in with email and password, and to enable other SSO providers depending on your Sentry subscription level.

For details, see [https://sentry.zendesk.com/hc/en-us/articles/24206530196251](https://sentry.zendesk.com/hc/en-us/articles/24206530196251).

## Do I need to migrate anything after my plan expires?

No migration steps are needed. Your existing Sentry organization, project, data, alerts, and SDK configuration remain intact.

When your plan changes:

- Sentry will retain historical data according to the new plan’s retention limits
- The `SENTRY_DSN` will continue working unless you explicitly remove or rotate it
- The Sentry SDK will continue to send events, but any events that exceed quota will be dropped

For more details, see [https://sentry.zendesk.com/hc/en-us/articles/36501551064219](https://sentry.zendesk.com/hc/en-us/articles/36501551064219).






