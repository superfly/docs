---
title: Customizing Deployments
layout: framework_docs
objective: Customize how Fly deploys your Laravel application.
order: 6
---

The `fly launch` command sets you up with a useful starting point, but you can customize just about everything to meet your needs. Here's a few things that might be useful to know.

## User Scripts

The `fly launch` command generated a `.fly/scripts` directory. Any file in here ending in `.sh` will run anytime your application is started (via `bash`).

These scripts are checked for in the `ENTRYPOINT` script before anything else is ran.

By default, `fly launch` generates the script `.fly/scripts/caches.sh`, which runs various artisan cache commands such as `config:cache`, `route:cache`, and `view:cache`.

You can enable or disable those as you see fit, as well as add your own `.sh` scripts!

## Release Command

You may want to use the [`release_command`](/docs/reference/configuration/#the-deploy-section) to perform database migrations or other tasks. 

These types of tasks could be a `.sh` user-script, or `release_command` defined in your `fly.toml` file - it's up to you and your use case.

If you need a script to do something (or NOT do something) during a release command, your scripts can detect the presence of the `RELEASE_COMMAND` environment variable.

```bash
if [ -z "$RELEASE_COMMAND" ]; then
    # We are NOT in a temporary VM, run as normal...
else
    # We are in the temporary VM created
    # for release commands...
fi
```
