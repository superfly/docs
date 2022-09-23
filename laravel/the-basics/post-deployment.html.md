---
title: Post Deployment
layout: framework_docs
objective: Interact with a deployed Laravel application.
order: 2
---

Once you have your Laravel application up and running, it helps to know how to execute commands on it and review events happening in your application.

## Console Access
To interact with your Laravel application, you can ssh into the vm machine through the [`Fly SSH Console`](/docs/flyctl/ssh-console/):
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

## Logs

Hopefully you have configured some neat, helpful logs to keep track of the events happening in your Laravel application. 
So another way to inspect what your application's been up to, is to check its application logs. There are several options:

### Fly.io's logging service

By default, Fly.io updates Laravel's logging channel to "stderr" through the ```[env]``` configuration found in fly.toml:

```toml
[env]
  APP_ENV = "production"
  LOG_CHANNEL = "stderr"
  LOG_LEVEL = "info"
  LOG_STDERR_FORMATTER = "Monolog\\Formatter\\JsonFormatter"
```
This ```"stderr"``` configuration prints your application logs into the console, where the fly service is able to listen and capture logs from. 

In order to view your logs captured by the fly service, you can:
<ol>
<li>Visit your application's monitoring section from your fly dashboard likeso: ```https://fly.io/apps/<app-name>/monitoring```</li>
<li>Run the command:</li>
</ol>
```cmd
fly logs
```
```output
2022-09-23T12:05:07Z app[8ebaa037] ams [info]{"message":"reached test","context":{},"level":200,"level_name":"INFO","channel":"production","datetime":"2022-09-23T12:05:07.200105+00:00","extra":{}}
```



Take note however that Fly logs are kept only for 2 days, before they're all wiped out! 


### Volumed Log File

If you would like to persist your application logs for a longer duration, you can instead opt to save the logs in a log file by configuring ```"single"```, ```"daily"```, or ```"stack"``` as the LOG_CHANNEL. 

So update your ```fly.toml```:
```toml
[env]
  APP_ENV = "production"
  LOG_CHANNEL = "stack"
  LOG_LEVEL = "info"
  LOG_STDERR_FORMATTER = "Monolog\\Formatter\\JsonFormatter"
```
If you've opted to configure ```"stack"``` as your LOG_CHANNEL make sure its ```channels``` configuration found in ```config/logging.php``` includes ```"single"``` or ```"daily"```: 
```php
 'stack' => [
    'driver' => 'stack',
    'channels' => ['single'],
    'ignore_exceptions' => false,
  ],
```

Note: You can even add ```"stderr"``` in the stack's channels list to view your logs through Fly.io.

<aside class="callout">
  Then, through the Fly SSH Console, you can access the logs in your application!
</aside>

**Volume**

Deployment wipes out all log files! In order to persist your Laravel log files, we need to add a [volume](https://fly.io/docs/reference/volumes/) to persist your application's log folder's state.

<ol>
<li>First let's create a Volume:</li>
```cmd
fly create volume my_log_vol --region ams --size 10 #GB
```

<ul>
<li>-> You can replace the volume name ```my_log_vol``` with any name of your preference.</li>
<li>-> You can specify your region code through the --region attribute</li>
<li>-> You can specify your volume's size in GB through the --size attribute</li>
</ul>
<p></p>


<li>Next, we'll go right ahead to our ```fly.toml``` and mount that volume in our ```/var/www/html/storage/logs``` folder:</li>

```toml
[mounts]
  source="my_log_vol"
  destination="/var/www/html/storage/logs"
```

<li>Finally, deploy the changes!</li>
```cmd
fly deploy
```
</ol>
**Possible Errors**

-> Error not enough volumes named ```<volume_name>``` (1) to run ```(<n>)``` processes

This can mean that there are ```<n>``` processes configured in your fly.toml trying to use the volume!
A Volume can only be used by one at any given time, so please select the appropriate process to use the volume and re-configure your mount:

```toml
[mounts]
  source="log_data"
  destination="/var/www/html/storage/logs"
  processes=["app"]
```

<aside class="callout">
  Hopefully now, regardless of how many more deployments you make hereafter, your logs will persist!
</aside>


