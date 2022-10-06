---
title: Customizing Deployments
layout: framework_docs
objective: Customize how Fly deploys your Laravel application.
order: 2
---

The `fly launch` command sets you up with a useful starting point, but you can customize just about everything to meet your needs. Here's a few things that might be useful to know.

## Startup Scripts

The `fly launch` command generated a `.fly/scripts` directory. Any file in here ending in `.sh` will run (via `bash`) anytime your application is started.

These scripts are called from the Docker `ENTRYPOINT` script (`.fly/entrypoint.sh`) before anything else is ran.

By default, `fly launch` generates a startup script `.fly/scripts/caches.sh`, which runs various artisan cache commands such as `config:cache`, `route:cache`, and `view:cache`.

You can enable or disable those as you see fit, as well as add your own `.sh` scripts!

## Release Command

You may want to use the [`release_command`](/docs/reference/configuration/#the-deploy-section) to perform database migrations or other tasks. The release command is run in a temporary VM that is created just before your application is deployed and released. This potentially helps with zero-downtime deploys.

Note, however, that any Startup Script in `.fly/scripts` will also be run when a `release_command` is used.

If you need a startup script to do something (or NOT do something) during a release command, your scripts can detect the presence of the `RELEASE_COMMAND` environment variable.

```bash
if [ -z "$RELEASE_COMMAND" ]; then
    # We are NOT in a temporary VM, run as normal...
else
    # We are in the temporary VM created
    # for release commands...
fi
```

Note that [release commands](/docs/reference/configuration/#the-deploy-section) run in a temporary VM. Any file-based changes done in the release command (such as `artisan view:cache`) will be lost when the release command is completed. The subsequently deployed application is a totally different VM. Commands that result in file-based changes (such as `artisan view:cache`) is best run as a Startup Script.
