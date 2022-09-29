---
title: Databases
layout: framework_docs
objective: Notes and configurations on connecting with Databases
order: 4
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

<b>The Answer: Use the database application's [Fly .internal Address](/docs/reference/private-networking/#fly-internal-addresses):</b>
<ol>
<li>Get the database application's app-name from its `fly.toml`</li>
<li>Generate the pattern for your database application's  Fly .internal Address: `"<app-name>.internal"`</li>
<li>Use the Fly .internal Address retrieved above in your Laravel application's `fly.toml` configuration for connecting with the database</li>
</ol>


## _MySQL in Fly.io_
You can start with a relational-database classic: [MySQL](https://www.mysql.com/). You can even run it as a Fly App! 

In this section, you'll:
  1. Get a reference on how to spin a MySQL Fly App 
  2. Connect to your MySQL Fly App from a Laravel Fly App
  3. Connect to your MySQL Fly App from a local environment

### _Setup a MySQL application in Fly.io_
Follow this [MySQL guide](/docs/app-guides/mysql-on-fly/) to get up and running with your MySQL application in Fly.io.


### _Connect from a Laravel application in Fly.io_

First, you'll have to find out your MySQL application's Fly .internal Address: 

<b>Get MySQL application's Fly .internal Address</b>

Open your MySQL application's `fly.toml` as a reference, and from there get its [Fly .internal Address](/docs/laravel/the-basics/databases/#fly-internal-address). 
As an example, your MySQL Fly .internal Address would be `"mysql-app-name.internal"`, given a `fly.toml` configuration below:

```toml
app = "mysql-app-name"

[env]
  MYSQL_DATABASE = "<database-name>"
  MYSQL_USER =  "<database-user>"
```

Once you have your MySQL Fly .internal Address, go ahead and revise the `[env]` configuration in your Laravel application's `fly.toml` file to connect with your MySQL application's [Fly .internal Address](/docs/laravel/the-basics/databases/#get-mysql-application-s-fly-internal-address) and MYSQL_DATABASE:

```toml
[env]
  APP_ENV = "production"
  DB_CONNECTION = "mysql"
  DB_HOST = "<MYSQL Fly .internal Address>"
  DB_DATABASE= "<MYSQL_DATABASE>"
```

Then, set up the database username and password through [Fly Secrets](/docs/flyctl/secrets/):

```cmd
fly secrets set DB_USERNAME=<MYSQL_USER> DB_PASSWORD=<MYSQL_PASSWORD>
```

Finally deploy your changes with

```cmd
fly deploy 
```



### _Connect  from a local environment_

The MySQL instance you spun up in Fly.io &quot;[is closed to the public internet](/docs/reference/machines/#notes-on-networking)&quot;, and can only be accessed by another application found in your Fly.io organization's private network. You'll need a way to tunnel into the network, and finally connect to your MySQL instance.

<b>In this guide you'll tunnel to your MySQL instance through the use of `flyctl proxy`</b>

First, open your MySQL application's `fly.toml` and take note of the following:

```toml
app = "<mysql-app-name>"

[env]
  MYSQL_DATABASE = "<database-name>"
  MYSQL_USER =  "<database-user>"
```

Then use `flyctl proxy`  to tunnel to your MySQL application:

```cmd
flyctl proxy 3306 -a <mysql-app-name>
```

Finally, update your local .env file with the values from your MySQL `fly.toml` file:

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

1. Setup a  PlanetScale database instance
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

### _Connect from a Laravel application in Fly.io_

Update your Laravel application's `fly.toml`'s `[env]` with details from the PlanetScale connection string 

```
[env]
  APP_ENV = "production"
  DB_CONNECTION = "mysql"
  DB_HOST = "<DB_HOST>"
  DB_DATABASE= "<DB_DATABASE>"
  MYSQL_ATTR_SSL_CA="/etc/ssl/certs/ca-certificates.crt"
```
[Take note that the value for MYSQL_ATTR_SSL_CA vary depending on the Docker container used. For the default docker container used by Fly.io, the above value is the path]

Next, set up the database username and password through [flyctl secrets](/docs/flyctl/secrets/):

```cmd
fly secrets set DB_USERNAME=<DB_USERNAME> DB_PASSWORD=<DB_PASSWORD>
```

Finally deploy your changes with:

```cmd
fly deploy 
```



## _Database Migrations_
<aside class="callout">
There are several ways to run the Laravel classic: &quot;php artisan migrate&quot; command at Fly.io:
</aside>
#1 Through the `fly.toml` [deploy] configuration ( which will run in every deployment )

```
[deploy]
  release_command = "php /var/www/html/artisan migrate --force"
```

#2 Through `fly ssh console` shortcut:

```
fly ssh console -C "php /var/www/html/artisan migrate --force"
```

#3 Through `fly ssh console`:

```
fly ssh console
cd /var/www/html/
php artisan migrate --force
```
