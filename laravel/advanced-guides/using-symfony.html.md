---
title: "Using Symfony"
layout: framework_docs
objective: See how to run Symfony apps, with just a few tweaks to the Laravel configuration.
order: 4
---

Credit where credit's due, community member [Yaeger wrote this up](https://dejager.sh/articles/deploying-symfony-on-fly) and we're using it as our source.

To run a Symfony app on Fly.io, we can trick  `flyctl` into thinking it's a Laravel app, having it generate the needed configuration for us, and then tweak it as needed.

## Generating Configuration

We'll start by tricking `flyctl` into thinking we have a Laravel application. The `fly launch` command just searches for a file named `artisan`. If it finds that, it will assume we have a Laravel application.

```bash
touch artisan
fly launch
```

This will generate a Dockerfile and other related files (within a new `.fly` directory) that are needed to serve a PHP application.

## Environment Variables

By default, Symfony wants a `.env` file to exist. That's fine if you want to include one in your build (you'll need to remote `.env` from the `.dockerignore` file if so). However we prefer to add environment variables to the `fly.toml` file (and have secrets be set via `fly secrets`).

To accomplish this, we'll create a custom `SymfonyRuntime` class and use that when we deploy to file.

Create file `.fly/FlySymfonyRuntime.php` with the following contents:

```php
class FlySymfonyRuntime extends SymfonyRuntime
{
    public function __construct(array $options = [])
    {
        $options['disable_dotenv'] = true;

        parent::__construct($options);
    }
}
```

This disables the requirement for the `.env` file to be present.

We can then update our `Dockerfile` to copy our new PHP file into the application when we deploy to Fly.io:

```dockerfile
# Add this command into the Dockerfile in the string of
# commands run after `COPY . /var/www/html`
# e.g.  RUN cp <the below line> && composer install...
cp .fly/FlySymfonyRuntime.php /var/www/html/src/FlySymfonyRuntime.php
```

We also need to tell Symfony to use the `FlySymfonyRuntime` by setting an environment variable in `fly.toml`:

```toml
[env]
  APP_RUNTIME = '\App\FlySymfonyRuntime'
```

## The Fly Proxy

Symfony needs to be aware of the Fly Proxy in order to generate links correctly (among other things). The Fly proxy is a routing layer (similar to a load balancer) that sits between your application server and the public internet.

The proxy terminates SSL connections, and sends "http" requests to your application. We need to tell Symfony to [trust this proxy](https://symfony.com/doc/current/deployment/proxies.html) by editing file `config/packages/framework.yaml` and adding `trusted_proxies: '127.0.0.1,REMOTE_ADDR'`.

## Detail Work

That's basically it! From then on, running `fly deploy` should let you deploy the application and run your Symfony application.

If you want to see examples of running queues or connecting to a database, check out [this article](https://dejager.sh/articles/deploying-symfony-on-fly) which has details on that.
