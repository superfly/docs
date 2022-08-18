---
title: Cron and Queues
layout: framework_docs
objective: Run queue workers and Laravel's scheduler via cron
order: 2
---

You may need to run Laravel's scheduler (via cron) or queue workers.

The best way is to use the [processes](https://fly.io/docs/reference/configuration/#the-processes-section) configuration.

This allows you to segment your application into "groups". Each "group" can run an instance pf your code base with a specific use case (web server, cron tasks, queue worker).

> If you used `fly launch` to create your Laravel application, all of this should work with further modification to the Docker setup.

## Scheduler (cron)

We can start the `cron` daemon, which is pre-configured to run `php artisan schedule:run`.

To enable this, edit your `fly.toml` file and add a `[processes]` section:

```toml
[processes]
  app = ""
  cron = "cron -f"
```

The line `app = ""` is needed (with an empty string!) to keep a process group for your application serving web requests.

We created an additional process group `cron = "cron -f"`. This tells the VM to run the cron daemon rather than start the web server.

## Queue Worker

We can start an instance of our queue worker by adding another process. In this example, we'll add a `worker` process group in addition to `app` and `cron` processes.

```toml
[processes]
  app = ""
  cron = "cron -f"
  worker = "php artisan queue:work"
```

Note that you may want to expand on the `queue:work` command. For example, you could run `php artisan queue:work sqs --sleep=3 --tries=3 --max-time=3600` to use the `sqs` driver and determine other behaviors.

## Extra Credit

There's a few bits to explain about the above.

### Command vs Entrypoint

Internally, the things defined in the `[processes]` section are commands to run when the application instance is run. 

In Docker terminology, these are the Commands (`CMD`) being sent to the Entrypoint (`ENTRYPOINT`) as defined in the `Dockerfile`.

That's why the `app` process group has a command of an empty string! We want the Entrypoint script to run without passing it any additional commands. The Entrypoint script will then perform it's default behavior of starting Nginx/PHP-FPM to serve web requests.

The commands we defined are run relative to the Laravel project root, which is `/var/www/html` by default. This is configured in the `Dockerfile` used to setup the application.

Lastly, don't forget that Fly.io builds a Docker image, and then converts that to a micro-VM run on Fly's hardware.

### Services

The `[[services]]` section of the `fly.toml` should already contain the line `processes = ["app"]`, telling Fly to apply the service config to the application VM serving web requests. That will expose public ports and set health checks as you would want for the public-facing application.

```toml
[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"] # see! it's here!
  protocol = "tcp"
  script_checks = []
  # and so on ...
```

The queue and cron application instances don't need to expose public ports and don't support tcp-based health checks. Thus, we do not define any `services` for them.

### Scaling

You can scale the process groups out separately. For example, this will create 2 `app` instances (load balanced automatically) and 4 queue worker instances.

```bash
fly scale count app=2 worker=4
```

Check [the docs on processes](https://fly.io/docs/reference/configuration/#the-processes-section) for more examples on scaling separately (e.g. scaling server size and regions per process group).
