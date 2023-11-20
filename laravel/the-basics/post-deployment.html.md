---
title: Post Deployment
layout: framework_docs
objective: Interact with a deployed Laravel application.
order: 3
---

Once you have your Laravel application up and running in Fly.io, it helps to know how to execute commands on it and review events happening in your application.

## _Console Access_
To interact with your Laravel application in Fly.io, you can ssh into a running instance through the [`Fly SSH Console`](/docs/flyctl/ssh-console/):
```cmd
fly ssh console
```
```output
Connecting to top1.nearest.of.frosty-glitter-7650.internal... complete
# 
```
Once you gain access to your application's console, you can run commands like you would in your local environment, like listing your Laravel folder structure:

```cmd
cd /var/www/html
ls -l
```
```output
Dockerfile  artisan        composer.lock  docker             package.json       public     storage             vendor
README.md   bootstrap      config         lang               phpunit.xml        resources  tailwind.config.js  vite.config.js
app         composer.json  database       package-lock.json  postcss.config.js  routes     tests
```
<p></p>

## _Logs_

Hopefully you have configured some neat, helpful [logs](https://laravel.com/docs/9.x/logging) to keep track of the events happening in your Laravel application. 
So another way to inspect what your application's been up to, is to check its application logs. There are several options:

### Fly.io's logging service

By default, Fly.io updates Laravel's logging channel to `"stderr"` through the `[env]` configuration found in `fly.toml`:

```toml
[env]
  APP_ENV = "production"
  LOG_CHANNEL = "stderr"
  LOG_LEVEL = "info"
  LOG_STDERR_FORMATTER = "Monolog\\Formatter\\JsonFormatter"
```
This `"stderr"` configuration prints your application logs into the console, where the Fly.io service is able to listen and capture logs from. 

In order to **view your logs** captured by the Fly.io service, you can either:

1. Visit your application's monitoring section from your Fly.io dashboard like so: `"https://fly.io/apps/<app-name>/monitoring"`
2. Or run the [flyctl logs](/docs/flyctl/logs/) command:

```cmd
fly logs
```
```output
2022-09-23T12:05:07Z app[8ebaa037] ams [info]{"message":"reached test","context":{},"level":200,"level_name":"INFO","channel":"production","datetime":"2022-09-23T12:05:07.200105+00:00","extra":{}}
```

<div class="callout">
Take note however that Fly.io logs are kept only for **2 days**, before they're all wiped out! 
</div>

### _Volumed Log File_

#### Laravel Log File

If you would like to persist your application logs for a longer duration, you can instead opt to save the logs in a log file by configuring `"single"`, `"daily"`, or `"stack"` as the **LOG_CHANNEL**. 

So update your `fly.toml`:
```toml
[env]
  APP_ENV = "production"
  LOG_CHANNEL = "stack"
  LOG_LEVEL = "info"
  LOG_STDERR_FORMATTER = "Monolog\\Formatter\\JsonFormatter"
```
If you've opted to configure `"stack"` as your **LOG_CHANNEL** make sure its `channels` configuration found in `config/logging.php` includes `"single"` or `"daily"`: 
```php
 'stack' => [
    'driver' => 'stack',
    'channels' => ['single'],
    'ignore_exceptions' => false,
  ],
```

Note: You can even add `"stderr"` in the stack's channels list to view your logs through Fly.io.

<aside class="callout">
  Then, through the Fly SSH Console, you can access the logs in your application!
</aside>

#### Adding Volume

Deployment wipes out all log files! In order to persist your Laravel log files, you'll need to add a [volume](/docs/volumes/) to persist your log folder's state.


1) First let's create a Volume:

```cmd
fly volumes create my_log_vol --region ams --size 10 #GB
```

- You can replace the volume name `my_log_vol` with any name of your preference.
- You can specify your region code through the --region attribute
- You can specify your volume's size in GB through the --size attribute

2) Revise `fly.toml` to mount that volume in your `/var/www/html/storage/logs` folder:

```toml
[mounts]
  source="my_log_vol"
  destination="/var/www/html/storage/logs"
```

3) Finally, deploy the changes!
```cmd
fly deploy
```

<aside class="callout">
  Hopefully now, regardless of how many more deployments you make from here, your logs will persist!
</aside>





