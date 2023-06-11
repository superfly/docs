---
title: "Using Inertia-SSR"
layout: framework_docs
objective: See how to run Inertia SSR Laravel Apps, with just a few tweaks to the Laravel configuration.
order: 5
---

Need to run your Laravel Fly App along with a Vue, React, or Svelte Frontend? That's going to be a piece of cake with [Inertia](https://inertiajs.com/)! With [Inertia](https://inertiajs.com/), you'll be able to keep your server side logic in monolithic Laravel land, but still render your client side pages with your preferred ([Inertia-supported](https://inertiajs.com/#:~:text=We%20currently%20have-,three%20official,-client%2Dside%20adapters)) frontend framework or library. 

What's more, you can pre-render HTML pages on your server with [Inertia's Server Side Rendering](https://inertiajs.com/server-side-rendering) support. This will help in improving initial page load of your SPA Laravel app, and help your website be more SEO-friendly.


Once you've completed the [Server-side Rendering setup](https://inertiajs.com/server-side-rendering) for your local app, dive in below to deploy your server-side rendered, Laravel Inertia-SPA at Fly.io!

## Dockerfile Changes
Inertia SSR requires a background [Node process](https://inertiajs.com/server-side-rendering#:~:text=Node%20must%20be%20available) that will render requested html pages. 

The Laravel fly-scanner already generates a Dockerfile that makes use of a Node image. So we can simply revise that Dockerfile to copy over the Node image's node binaries, with your app's generated node_modules to the final fly-laravel image:

```dockerfile
FROM base

+  COPY --from=node_modules_go_brrr /usr/local/bin/node /usr/local/bin/node
+  COPY --from=node_modules_go_brrr /app/node_modules /var/www/html/node_modules
```

## Running SSR as A Process
After getting your Docker environment setup for Inertia SSR to work, you'll need to run the SSR Server as a [background process](https://inertiajs.com/server-side-rendering#:~:text=server%20as%20a-,background%20process,-%2C%20typically%20using%20a). Here at Fly.io, you can easily run a separate VM to run this SSR server instead of a monitoring tool like Supervisor( cool right?! ). Update your `fly.toml` file to include an `ssr` process group:
```toml
[processes]
  app=""
  ssr="php /var/www/html/artisan inertia:start-ssr"
```

Now that you have more than one process group for your Fly.io app, you'll have to make sure that the [`[http_service]`](/docs/reference/configuration/#the-http_service-section) is properly mapped to your `app` process. Update your `fly.toml`'s `http_service` section with the `app` process:
```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
+  processes = ["app"]
```

With that, do a quick `fly deploy` and your good to go!