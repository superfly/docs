---
title: Queues and Cron
layout: framework_docs
objective: Run queue workers and Laravel's scheduler via cron
order: 2
---

You may need to run Laravel's scheduler (via cron) or queue workers.

The Official Fly.io Way™ to do this is to use [processes](https://fly.io/docs/reference/configuration/#the-processes-section).

This allows you to segment your application into "groups". Each "group" can run an instance pf your code base with a specific use case (web server, cron tasks, queue worker).

The groups can be scaled separately, letting you do things like scale up your queue workers separately from app handling web requests.

If you used `fly launch` to create your Laravel application, than the container is setup and ready for you to do this out of the box.

## Scheduler (cron)

We can start the `cron` daemon, which is pre-configured to run `/usr/bin/php /var/www/html/artisan schedule:run` by Fly.io if you used the `fly launch` command to setup your application.

To enable this, edit your `fly.toml` file and add a `[processes]` section:

```toml
[processes]
  app = ""
  cron = "cron -f"
```

The `app = ""` is needed to create a process group for your application serving web requests.

We added `cron = "cron -f"` so that another process group will be created. This will run `cron -f` as the command (Docker's `CMD`) that is used when starting the application instance.

## Queue Worker

Similar to the cron daemon, we can start an instance of our queue worker by adding another process. In this example we are keeping the `app` and `cron` process groups.
In additon to those, we're adding a `worker` group.

```toml
[processes]
  app = ""
  cron = "cron -f"
  worker = "php artisan queue:work"
```

Note that you may want to expan on that command. For example, you may want to run `php artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600` to use the `sqs` driver and determine other behaviors.

Due to the Docker configuration, these commands are run relative to the Laravel project root, which is `/var/www/html` by default.

## Internals

There's a few bits to explain about the above.

### Commands vs Entrypoint

Internally, the things defined in the `[processes]` section are commands to run when the application instance is run. 

In Docker terminology, these are the Commands (`CMD`) being sent to the Entrypoint (`ENTRYPOINT`) as defined in the Dockerfile used to create the container image that Fly.io converst to a VM.

That's why the `app` process group has a command of an empty string! We want the Entrypoint script to run without passing it any additional commands. The Entrypoint script will then run it's default behavior of starting Nginx/PHP-FPM to serve web requests.

### Services

The `[[services]]` section of the `fly.toml` should contain the line `processes = ["app"]`, telling Fly to apply the service config to the application VM serving web requests. That will expose public ports and set health checks as you would want for the public-facing application.

The queue and cron application instances don't need to expose public ports and don't support tcp-based health checks.

### Scaling

You can scale the process groups out separately. For example, this will create 2 `app` instances (load balanced automatically) and 4 queue worker instances.

```bash
fly scale count app=2 worker=4
```

Check [the docs on processes](https://fly.io/docs/reference/configuration/#the-processes-section) for more examples on scaling separately (e.g. scaling server size and regions per process group).
