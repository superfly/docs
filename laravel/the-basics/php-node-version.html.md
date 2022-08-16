---
title: PHP and Node Versions
layout: framework_docs
objective: Adjust the PHP and NodeJS versions used to build and run your Laravel application.
order: 1
---

Your app is a special snowflake. Here are a few things you may want to customize further!

## PHP Version

The `Dockerfile` installs PHP 8.0 by default. If you want PHP 8.1 or (bless your heart) PHP 7, you can find/replace instances of `php8` to your version of choice.

For example, to update to PHP 8.1, you'll need to edit:

1. `Dockerfile` - Change package names from php8 to php81 (e.g. `php8-cli` to `php81-cli`)
2. `docker/app.conf` (if present) - Change `listen` to use `php81-fpm.sock`
3. `docker/php-fpm.conf` (if present) - Change `include` to use file path `/etc/php81`
4. `server.conf` - Change `fastcgi_pass` to pass to `php81-fpm.sock`
5. `supervisord.conf` - Change `[program:php8-fpm]` (if present) to run command `php-fpm81`

If you need PHP 7, you can find other PHP versions (and matching Alpine container versions) [here](https://github.com/codecasts/php-alpine). Note that you may not be able to use `alpine:edge` as the base container.

## Node Version

The `Dockerfile` uses fancy [multi-stage](https://docs.docker.com/develop/develop-images/multistage-build/) builds to install your Node dependencies and build static assets.

You can change the Node version used in the `Dockerfile` by changing `FROM node:14` to a [version of your choice](https://hub.docker.com/_/node).

```docker
# Change this:
FROM node:14 as node_modules_go_brrr

# To whatever version you need:
FROM node:16 as node_modules_go_brrr
```

One last note: The `node_modules` directory ends up being excluded from your code base. If you need it, you'll have to adjust the `Dockerfile`:

```docker
# Keep this line
COPY --from=node_modules_go_brrr /app/public /var/www/html/public
# Add this line:
COPY --from=node_modules_go_brrr /app/node_modules /var/www/html/node_modules
```