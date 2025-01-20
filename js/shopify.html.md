---
title: Shopify
layout: framework_docs
blog_path: /javascript-journal
order: 3
---

Fly.io has built in support for [Shopify Remix applications](https://shopify.dev/docs/apps/build): simply [scaffold](https://shopify.dev/docs/apps/build/scaffold-app), [build](https://shopify.dev/docs/apps/build/build?framework=remix), and [launch](https://fly.io/shopify).

As an example, the [Shopify tutorial app (qrcode)](https://shopify.dev/docs/apps/build/build?framework=remix) can be launched without any modification:

```
git clone https://github.com/Shopify/example-app--qr-code--remix qrcode
cd qrcode
shopify app config link
fly launch
```

## Configuration

`fly launch` parses the output of [shopify app env show](https://shopify.dev/docs/api/shopify-cli/app/app-env-show).

The value of `SHOPIFY_API_SECRET` will be set as a [fly secret](https://fly.io/docs/apps/secrets/).  The remainder will be placed into your `fly.toml`:

```toml
[env]
  PORT = '3000'
  SCOPES = 'write_products'
  SHOPIFY_API_KEY = '…'
  SHOPIFY_APP_URL = 'https://….fly.dev'
```

## Scaling

By default, all machines will automatically be configured to stop when not in use, and restart on the next request; this is fine for development purposes, but for production you will need to adjust this to meet [Shopify performance requirements](https://shopify.dev/docs/apps/launch/built-for-shopify/requirements#performance).

Depending on your requirements:

* [suspend](https://community.fly.io/t/autosuspend-is-here-machine-suspension-is-enabled-everywhere/20942) can generally reduce startup time from hundreds of milliseconds to a single digit number of milliseconds.  Some applications may experience time skew issues, and there are other limits, so this is not the default.
* Setting `min_machines_running` to 1 in the [http service section](https://fly.io/docs/reference/configuration/#the-http_service-section) of your `fly.toml` can make sure that there always is a started machine to process requests.
* setting `auto_stop_machines` to `off` in the [http service section](https://fly.io/docs/reference/configuration/#the-http_service-section) will prevent your machines from being stopped all together.

You can also [Scale Machine CPU and RAM](https://fly.io/docs/launch/scale-machine/), and  [Scale the number of machines](https://fly.io/docs/launch/scale-count/).

## Database

Shopify's template starts you off with SQLite using Prisma.  Of particular note:
  * By virtue of only running on a single machine, SQLlite3 apps will experience brief unavailabilty during deploys. For a typical application without any new migrations, this will be on the order of a few hundred milliseconds.
  * For PostgreSQL applications without any volumes, [rolling deploys](https://fly.io/docs/launch/deploy/#deployment-strategy) are the default, avoiding any downtime.

Additional information is available on [deploying Prisma apps on Fly.io](../prisma/).
