---
title: Databases
layout: framework_docs
objective: Notes and configurations on connecting with Databases
order: 5
---
No application is complete without a data store!

In this guide, you'll find configuration on different database applications and different approaches to connect them with your Laravel application in Fly.io.

You'll see here references on how you can set up a database instance through Fly.io along with other approaches that suit global distribution of data.
<p></p>

## _[Fly .internal Address](/docs/reference/private-networking/#fly-internal-addresses)_

In this guide, you'll be connecting your Laravel application with various database applications running in Fly.io. A very important concept in connecting Fly.io applications with each other is [Private Networking](/docs/reference/private-networking).

<aside class="callout">
How do you connect your Laravel application running in Fly.io with a database application running in Fly.io?
</aside> 

<b>The Answer: Connect using the database application's [Fly .internal Address](/docs/reference/private-networking/#fly-internal-addresses):</b>
<ol>
<li>Get the database application's app-name from its `fly.toml`</li>
<li>Generate the pattern for your database application's  Fly .internal Address: `"<app-name>.internal"`</li>
<li>Configure your Laravel application's `fly.toml` to connect with the Fly .internal Address retrieved above</li>
</ol>


## _MySQL in Fly.io_
You can start with a relational-database classic: [MySQL](https://www.mysql.com/). You can even run it as a Fly App! 

In this section, you'll:
  1. Get a reference on how to spin up a MySQL Fly App 
  2. Connect to your MySQL Fly App from a Laravel Fly App
  3. Connect to your MySQL Fly App from a local environment

### _Setup a MySQL Fly App_
Follow this [MySQL guide](/docs/app-guides/mysql-on-fly/) to get up and running with your MySQL application in Fly.io.


### _Connect from a Laravel Fly App_

1) First, you'll have to find out your MySQL application's Fly .internal Address: 

<b>Get MySQL application's Fly .internal Address</b>

Open your MySQL application's `fly.toml` as a reference, and from there get its [Fly .internal Address](/docs/laravel/the-basics/databases/#fly-internal-address). 
As an example, given a `fly.toml` configuration below, your MySQL Fly .internal Address should be `"mysql-app-name.internal"`:

```toml
app = "mysql-app-name"

[env]
  MYSQL_DATABASE = "<database-name>"
  MYSQL_USER =  "<database-user>"
```

2) Once you have your MySQL Fly .internal Address, go ahead and revise the `[env]` configuration in your Laravel application's `fly.toml` file to connect using the address:

```toml
[env]
  APP_ENV = "production"
  DB_CONNECTION = "mysql"
  DB_HOST = "<MYSQL Fly .internal Address>"
  DB_DATABASE= "<MYSQL_DATABASE>"
```

3) Then, set up the database username and password through [Fly Secrets](/docs/flyctl/secrets/):

```cmd
fly secrets set DB_USERNAME=<MYSQL_USER> DB_PASSWORD=<MYSQL_PASSWORD>
```

4) Finally deploy your changes with

```cmd
fly deploy 
```



### _Connect  from a local environment_

The MySQL instance you spun up in Fly.io &quot;[is closed to the public internet](/docs/reference/machines/#notes-on-networking)&quot;, and can only be accessed by another application found in your Fly.io organization's private network. You'll need a way to tunnel into the network, and finally connect to your MySQL instance.

<b>In this guide you'll tunnel to your MySQL instance through the use of `flyctl proxy`</b>

1) First, open your MySQL application's `fly.toml` and take note of the following:

```toml
app = "<mysql-app-name>"

[env]
  MYSQL_DATABASE = "<database-name>"
  MYSQL_USER =  "<database-user>"
```

2) Then use `flyctl proxy`  to tunnel to your MySQL application:

```cmd
flyctl proxy 3306 -a <mysql-app-name>
```

3) Finally, update your Laravel application's local .env file with the values from your MySQL `fly.toml` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<MYSQL_DATABASE>
DB_USERNAME=<MYSQL_USER>
DB_PASSWORD=<MYSQL_PASSWORD>
```



## _MySQL on PlanetScale_

PlanetScale is a serverless, MySQL database-compatible platform built for horizontally scaling data.

In this setup, you'll find a basic setup of PlanetScale and Fly.io connection. However, for a multi-region level up, checkout our [Multi-Region Laravel with PlanetScale](https://fly.io/laravel-bytes/multi-region-laravel-with-planetscale/) article.

Before you can connect your Laravel [application in Fly.io to a PlanetScale instance](/docs/app-guides/planetscale/), you'll have  to tread several steps first:

1. Setup a PlanetScale database instance
1. Get connection information from PlanetScale instance
1. Connect from Laravel application in Fly.io



### _Setup a PlanetScale database instance_

You can check out their quick-start guide [here](https://planetscale.com/docs/tutorials/planetscale-quick-start-guide), or follow along:
<ol>
<li>First make sure you have an account, and [login](https://auth.planetscale.com/sign-in?return_to=%2F)</li>
<li>You'll be redirected to your organization dashboard, where you'll be able to find a `"create a database"` link.</li>
<li>Click on the create link, and hopefully you'll get  a prompt to add in your preferred database name and region</li>
</ol>

![PlanetScale initialize database dialog](/docs/images/planetscale_laravel_new_db_dialog.png)

### _Get connection information from PlanetScale instance_

Once initialized, your database dashboard should have metrics and options like so:

![PlanetScale initialize database dashboard](/docs/images/planetscale_laravel_new_database.png)
<ol>
<li>Click on the Connect button at the top right, this should provide a box of information for connecting with your PlanetScale database.</li>
<li>First though, make sure to add a password,  by clicking on the &quot;New Password&quot; button at the upper right corner. This should show you a new password afterwards.</li>
<li>Next, select &quot;Laravel&quot; in the list labeled &quot;Connect with&quot;</li>
</ol>

![PlanetScale Laravel connection string](/docs/images/planetscale_laravel_connection_string.png)
Take note of the connection string provided and let's move on!

### _Connect from a Laravel Fly App_

1) Update the `[env]` configuration in Laravel application's `fly.toml` with details from the PlanetScale connection string 

```
[env]
  APP_ENV = "production"
  DB_CONNECTION = "mysql"
  DB_HOST = "<DB_HOST>"
  DB_DATABASE= "<DB_DATABASE>"
  MYSQL_ATTR_SSL_CA="/etc/ssl/certs/ca-certificates.crt"
```
[Take note that the value for MYSQL_ATTR_SSL_CA vary depending on the Docker container used. For the default docker container used by Fly.io, the above value is the path]

2) Next, set up the database username and password through [flyctl secrets](/docs/flyctl/secrets/):

```cmd
fly secrets set DB_USERNAME=<DB_USERNAME> DB_PASSWORD=<DB_PASSWORD>
```

3) Finally deploy your changes with:

```cmd
fly deploy 
```

## _Postgres in Fly.io_
We have a <i>[whole section](/docs/postgres/)</i> dedicated for [Postgres](https://www.postgresql.org/), we even have a `flyctl` integration to simplify the creation and management of your Postgres Fly Apps!

In this section you'll get to quickly:
1. Setup a Postgres Fly App
2. Connect From a Laravel Fly App by Attachment
3. Connect From a Laravel Fly App Manually
4. Connect From a Local Environment
5. Test Connection 

### _Setup a Postgres Fly App_
1) You can easily setup your Postgres in Fly.io by utilizing our `flyctl postgres create` command:

```cmd
fly postgres create
```

<small>Running the command should give you several prompts, one of which is a prompt for your resource allocation. Be sure to check out the appropriate [configuration plan](/docs/reference/postgres/#about-free-fly-postgres) based on your usecase.</small>


2) Soon after you should receive the auto-generated configuration for your Redis Fly App. Make sure to <b>keep them somewhere safe</b>, there will be no place to find them afterwards!
```output
Postgres cluster ktan-pg created
  Username:    postgres
  Password:    <redacted>
  Hostname:    ktan-pg.internal
  Proxy Port:  5432
  Postgres Port: 5433
```

### _Interacting with your Postgres Fly App_
Now that you have your Postgres Fly App running, how do you interact with it? Notice how there wasn't any `fly.toml` configuration file generated during the whole setup process above.

Fear not! You can interact with your Postgres Fly App using `flyctl postgres connect`. 

1) Connect with your Postgres Fly App using its App name. 

```cmd
flyctl postgres connect -a ktan-pg
```
```output
Connecting to ktan-pg.internal... complete
psql (14.4 (Debian 14.4-1.pgdg110+1))
Type "help" for help.

postgres=# 
```
<small>In case you've forgotten about your app name, but managed to save the output from the Postgres Fly App creation (which you should've!), then check the value of the `Hostname`. The App name would simply be every little character before ".internal".</small> 


2) Great, you're connected! Go ahead and complete your setup with a new database:
```postgres
create database <DB_NAME>;
```

3) Now if you check your database list, you should find the recent database created:
```sql
SELECT datname FROM pg_database;
```
```output
  datname  
-----------
 postgres
 testdb
 template1
 template0
(4 rows)
```

<aside class="callout">
There are tons of ways to interact with your Postgres Fly App! If you want to get a bird's eye view on your Postgres database list outside of the `flyctl postgres connect` command, simply run the command below instead.
</aside>
```cmd 
flyctl postgres db list -a <postgres-fly-app-name>
```

Once you have your running and <i>[configured](/docs/laravel/the-basics/databases/#interacting-with-your-postgres-fly-app)</i> Postgres Fly App, it's time to connect with your Laravel Fly App.

### _Connect From a Laravel Fly App by Attachment_
You can [Attach your Laravel Fly App to your Postgres Fly App](https://github.com/superfly/docs/blob/main/reference/postgres.html.md#attaching-an-app-to-a-postgres-app):

1) Run the attachment command below:
```cmd 
flyctl postgres attach --app <laravel-app-name> <postgres-app-name>
```
<ul>
<li>This should generate a database named after <laravel-app-name> in your Postgres Fly App</li> 
<li>This should generate an env variable `DATABASE_URL` containing a connection string in you Laravel fly app</li>
</ul>

2) Make sure the `fly.toml` of your Laravel Fly App uses postgres:

```toml
[env]
  APP_ENV = "production"
  DB_CONNECTION = "pgsql"
```
Postgres Connection would now be available to your Laravel Fly App using the auto generated `DATABSE_URL` from the attachment process.

### _Connect From a Laravel Fly App Manually_

If you decide not to use the `flyctl postgres attach` command above, and would want to connect to your Laravel Fly App in a manual, <i>grueling</i> step by step procedure, I hear you! 

You can follow along below:

1) Revise your Laravel Fly App's `fly.toml` file to connect with the `Hostname`( your Redis FLy App's .internal Address ) from the configuration output, and the `DB_Name` configured [above](/docs/laravel/the-basics/databases/#interacting-with-your-postgres-fly-app):
```toml
[env]
  APP_ENV = "production"
  DB_CONNECTION = "pgsql"
  DB_HOST = "<Hostname>"
  DB_DATABASE= "<DB_NAME>" 
  DB_PORT = 5432
```

2) Set your Laravel database `DB_USERNAME` and `DB_PASSWORD` with `fly secrets` based on the configuration output received during your Postgres Fly App creation:
```cmd
fly secrets set DB_USERNAME=<Username> DB_PASSWORD=<PASSWORD>
```

3) You've <i>finally</i> reached the last part. You can now rest easy and deploy:
```cmd
fly deploy
```

### _Connect From a Local Environment_
1) First tunnel to your Postgres Fly App using its app name through the `fly proxy` command
```cmd
fly proxy 5432 -a ktan-pg
```

2) Next setup your Laravel .env file to connect with the Postgres database:
```.env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=<DB_NAME>
DB_USERNAME=<Username>
DB_PASSWORD=<Password>
```

#### _Possible Errors_
<aside class="callout">
In case you get a quite-similar error below: 


<b>"ERROR: could not find driver pgsql"</b>

Make sure that your environment is configured properly with a pgsql driver!
</aside>

1) First up, check your php.ini file and make sure the driver for Postgres is available and <i>uncommented</i>:
```
extension=pgsql
```

2) Next, make sure you have the correct <b>php-pgsql</b> installed for your PHP version. Let's assume you have a PHP 8.1 running locally, then you must also have the compatible php8.1-pgsql in your environment.

### _Test Connection_
To test whether you are connected to your sparkling new Postgres Fly App, a simple `php artisan migrate` should let you know.

Once migration completes, you can check the tables migrated in your Postgres Fly App:

```
# Connect to your Postgres Fly App
$ fly postgres connect -a <postgres-app-name>

# Use the database created 
postgres=# \c <database_name_created>

You are now connected to database "<database_name_created>" as user "<user>".

# List your current database's tables
<database_name_created>=# \d
```




## _Redis in Fly.io_
[Redis](https://redis.io/) is a NoSQL database popularly used for cache storage, as a message broker, and even as primary database. Through this section you'll learn how to:
  <ol>
    <li>Setup using the Fly.io Redis Docker Image<li>
    <li>Setup using the Official Redis Docker Image</li>
  </ol>

### _Setup using the Fly.io Redis Docker Image_
1) First create a new directory and initialize it with `fly launch`, using [Fly.io's Redis Image](https://hub.docker.com/r/flyio/redis/tags) for the build:

```cmd
mkdir ktan-fly-redis
cd ktan-fly-redis

fly launch --image flyio/redis:6.2.6 --name ktan-fly-redis --region ams --no-deploy
```
<ul>
<li>Pull the <b>flyio/redis:6.2.6</b> image from the docker repository through the `--image` argument.</li>
<li>You can specify your Redis Fly App name through the `--name` argument</li>
<li>You can specify your region code through the `--region` attribute</li>
<li>You can opt not to immediately deploy by adding `--no-deploy` argument</li>
</ul>

2) Afterwards, add a [volume](/docs/reference/volumes/) that will persist your Redis data

```cmd
fly volumes create redis_server --size 1
```
<ul>
<li>You can specify any volume name to replace redis_server above</li>
<li>You can specify your preferred volume size in GB through the `--size` argument</li>
</ul>

3) Then, attach your volume to your Redis Fly App by revising its `fly.toml` to include `[[mounts]]`:

```toml
app = "ktan-fly-redis"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[build]
  image = "flyio/redis:6.2.6"

[env]

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]

[[mounts]]
  destination = "/data"
  source = "redis_server"
```
<ul>
<li>Under `[[mounts]]` attach the volume created in step #2, make sure that the name specified for the created volume is exactly the same string specified for its `source` attribute</li>
</ul>

4) Next, set up the Redis Fly App <b>password</b> through `fly secrets`

```cmd
fly secrets set REDIS_PASSWORD=<redacted>
```

5) Finally, deploy your Redis Fly App!

```cmd
fly deploy
```

### _Setup using the Official Redis Docker Image_
If you would like to use [Redis' official docker image](https://hub.docker.com/_/redis) to setup your Redis Fly App, the steps to get up and running are almost identical to the previous guide. There is just one minor revision on the image pulled and an additional step to set the Redis Fly App's password.

1) Follow the steps [above](/docs/laravel/the-basics/databases#setup-using-the-fly-io-redis-docker-image), with a revision to the value passed for `--image`

```cmd
mkdir ktan-off-redis
cd ktan-off-redis

fly launch --image redis --name ktan-off-redis --region ams --no-deploy
```
<ul>
<li>Pull the <b>redis</b> image from the docker repository through the `--image` argument.</li>
</ul>

2) Before deploying, make sure to revise your `fly.toml` file to specify your Redis Fly App's password by adding commands under `[experimental]`
```toml
[experimental]
  allowed_public_ports = []
  auto_rollback = true
  cmd = ["sh", "-c", "exec redis-server --requirepass \"$REDIS_PASSWORD\""]
```

<ul>
<li>Use the `fly secret` <b>`REDIS_PASSWORD`</b> you've configured earlier</li>
<li>If this passphrase is not set and your Laravel configuration sends a REDIS_PASSWORD during its connection to your Redis Fly App, watch out! You'll get the infamous "ERR Client sent AUTH, but no password is set" error</li>
</ul>


### _Connect from a Laravel Fly App_

Now that you have your Redis Fly App running, the next step is to connect it with your Laravel Fly App! Follow the steps below:

1) First, retrieve your Redis Fly App's [Fly .internal Address](/docs/laravel/the-basics/databases/#fly-internal-address). 

2) Next, make sure you move to your Laravel Fly App's directory for better navigation:
```cmd 
cd <laravel-app-folder>
```

3) Then revise your Laravel Fly App's `fly.toml` `[env]` configuration with the retrieved Fly .internal Address:

```toml
[env]
  ...
  REDIS_HOST= "<redis_app_name>.internal"
  CACHE_DRIVER= "redis"
```

4) Make sure you set your Laravel Fly App's `REDIS_PASSWORD` through the `flyctl secrets` command:

```cmd
fly secrets set REDIS_PASSWORD=<redacted>
```

5) Finally, deploy!
```cmd
fly deploy
```

That's it! Your Laravel and Redis Fly Apps should now be connected.


### _Connect from a local environment_
The simplest way to connect your local Laravel application to a Redis Fly App is to use `flyctl proxy`:

1) Open your Redis Fly App's local directory

```cmd
cd ktan-off-redis
```

2) Then run the `flyctl proxy` for port 6379 or whichever REDIS_PORT you have configured:
```cmd
fly proxy 6379
```

3) Next, revise your local Laravel application's .env file to update your Redis connection:
```.env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=<redacted>
REDIS_PORT=6379
```
Make sure the REDIS_PORT in your .env configuration matches the port used in `flyctl proxy`

That's it! Your local Laravel application should now be connected with your Redis Fly App.


### Testing Connection

<aside class="callout">
  In both examples above, Redis was used as our Laravel application's Cache Driver. 

  <p></p>
  To test if this connection is working or not, a simple `php artisan cache:clear` should let you know.
</aside>


## _Upstash Managed Redis Fly App_
Want a fully-managed Redis Fly App? Try [Upstash Redis](https://upstash.com/)! To set up, you can follow our-in-depth guide [here](/docs/reference/redis/) or follow along below:


### _Setup Using Flyctl_
1) You can create an Upstash Redis directly through `flyctl`:
```cmd
flyctl redis create
```

<aside class="callout">
  In case you receive an error 
  
  <b>"Error input:3: createAddOn You may only provision 1 Free plan per organization"</b> 


  This is a warning from Upstash. You are currently in their free tier and can only provision 1 free Redis database.

  You can upgrade your plan using `flyctl redis update`, or opt to delete the existing database if you so wish with `flyctl redis delete <db-name>`.

  Find out more [here](/docs/reference/redis)
</aside>

Once you've configured the necesary details through the flyctl prompts, and the app deployment completes, you should get a summary of the Redis cluster you've just deployed, like so:
```output
Your Upstash Redis database blue-brook-3843 is ready.
Apps in the personal org can connect to at redis://default:<redacted>@fly-blue-brook-3843.upstash.io
If you have redis-cli installed, use fly redis connect to connect to your database.
```

### _Connect From a Laravel Fly App_
To test whether your Laravel Fly App can successfully connect with your Upstash Redis database, you can use your Upstash Redis Fly App as your Cache driver, then perform a quick cache:clear command.

1) Revise the `[env]` configuration in your Laravel Fly App's `fly.toml` file:
```toml
[env]
  ...
  CACHE_DRIVER="redis"
  REDIS_URL="redis://default:<redacted>@fly-blue-brook-3843.upstash.io"
  REDIS_CACHE_DB=0
```
<ul>
<li>Set the Laravel cache driver to redis</li>
<li>Using `REDIS_URL` should override `REDIS_HOST`, add here the `REDIS_URL` received during `fly redis create`</li>
<li>Upstash only supports "database 0", so update your `REDIS_CACHE_DB` config to 0. Otherwise, you will receive an error : "SELECT` failed: ERR Only 0th database is supported! Selected DB: 1..."</li>
</ul>

2) Then deploy your `fly.toml` changes:
```cmd
fly deploy
```

3) Once deployment completes, you can test whether your connection is working by simply clearing your Laravel application's cache
```cmd
fly ssh console
```
```output
Connecting to top1.nearest.of.cool-moon-2754.internal... complete
#
```
```cmd
cd /var/www/html
php artisan cache:clear
```

If all goes well here, you should be good to go! 

## _SQLite in a Laravel Fly App_
"[SQLite](https://www.sqlite.org/about.html)" is a file-based, lightweight, low-latency, and in-process library providing an embeddable SQL database engine. 

Since SQLite is "embeddable", we no longer have to setup a separate Fly App for it. We simply configure our Laravel Fly App with one:


1) Make sure you are in your Laravel Fly App's directory

```cmd
cd <laravel-fly-configured-app>
```

2) Create a volume, you'll be attaching this later to your Laravel Fly App's storage directory 

```cmd
fly volumes create storage_vol --region ams --size 20 #GB
```


3) Revise your Laravel Fly App's `fly.toml` file to connect with the sqlite database and mount the volume created for your storage directory:

```
[env]
  APP_ENV = "production"
  LOG_CHANNEL = "stderr"
  LOG_LEVEL = "info"
  LOG_STDERR_FORMATTER = "Monolog\\Formatter\\JsonFormatter"
  DB_CONNECTION="sqlite"
  DB_DATABASE="/var/www/html/storage/database/database.sqlite"

[mounts]
  source="storage_vol"
  destination="/var/www/html/storage"
```

<aside class="callout">
Caution! Mounting a Volume to a folder will initially erase any item it contains during the first time the Volume is mounted for the folder. 
<p></p>

For example, the storage folder contains subfolders app, framework, and logs. 
Mounting the volume to the storage folder erases these contents, and leaves behind a sole item "lost+found".
</aside>

3) To fix the little storage-content-erasure issue, please go ahead and make a copy of your storage folder in a dummy folder, storage_.

```cmd
cp -r storage storage_
```
<small>
 You'll later use this folder to copy over its contents to the volumized storage folder.
</small>

4) Next create a Start Up Script that will initialize the volumized storage folder's contents.

```cmd
touch .fly/scripts/1_storage_init.sh
```
<small>
Side Note: Start up scripts are run in numeric-alphabetical order. Naming `1_storage_init.sh` makes sure it is the first script run. Otherwise, naming the file as `storage_init.sh` alone would've moved the `caches.sh` script above it, and would've executed before storage initialization happened. One of the commands in the `caches.sh` will not have worked properly, due to a lack of properly initialized storage directory.
</small>

<b>On to the content of the Start Up script:</b>
```bash
FOLDER=/var/www/html/storage/app
if [ ! -d "$FOLDER" ]; then
  echo "$FOLDER is not a directory, copying storage_ content to storage"
  cp -r /var/www/html/storage_/* /var/www/html/storage

  echo "deleteing storage_..."
  rm -rf /var/www/html/storage_
fi

FOLDER=/var/www/html/storage/database
if [ ! -d "$FOLDER" ]; then
  echo "$FOLDER is not a directory, initializing database" 
  mkdir /var/www/html/storage/database
  touch /var/www/html/storage/database/database.sqlite
fi
```
So what happened above?
<ul>
<li>The first condition statement checks if the app folder exists in the volumized storage folder. If it is not, it copies over the contents of the dummy storage_ folder to the volumized storage folder.</li>
<li>The second condition statement checks if the database folder exists in the volumized storage folder. If it is not, it creates a database directory inside storage/ and finally creates a database.sqlite file in the storage/database folder</li>
</ul>

5) Finally, deploy your Laravel Fly App!

```cmd
fly deploy
```

### _Testing the Laravel Fly App's SQLite_
A simple php artisan migrate should let you know if all is well:

```cmd
fly ssh console -C "php /var/www/html/artisan migrate --force"
```

## _Database Migrations_
<aside class="callout">
There are several ways to run the Laravel classic: "php artisan migrate" command at Fly.io:
</aside>
#1 Through the `fly.toml` [deploy] configuration ( which will run in every deployment )

```toml
[deploy]
  release_command = "php /var/www/html/artisan migrate --force"
```

#2 Through a [Start Script](/docs/laravel/the-basics/customizing-deployments/#startup-scripts) in `.fly/scripts`:
```cmd
echo "/usr/bin/php /var/www/html/artisan migrate --force" > ".fly/scripts/db.sh"
```

#3 Through `fly ssh console` shortcut:

```cmd
fly ssh console -C "php /var/www/html/artisan migrate --force"
```

#4 Through `fly ssh console`:

```cmd
fly ssh console
cd /var/www/html/
php artisan migrate --force
```
