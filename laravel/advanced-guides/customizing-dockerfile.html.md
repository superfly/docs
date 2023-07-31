---
title: "Customizing the Dockerfile"
layout: framework_docs
objective: Customize the Dockerfile to add additional modules and more
order: 6
---

When you run `fly launch`, we create a `Dockerfile` for you. You may need to customize this for your application!

The `Dockerfile` we create has three main responsibilities:

1. Copy the codebase into the container
2. Configure services (nginx, maybe configure Octane), run `composer install` and similar
3. Build static assets (via NodeJS)

The `Dockerfile` assumes you'll want to run `composer install...` and build static assets *on deployment*. 

## Customizing Static Assets

If you have static assets already built for production (perhaps committed to Git), you can save a bunch of deployment time by cutting out the step to build static assets.

You can just delete the whole section from the `Dockerfile` that deals with that - [here's a gist showing the diff](https://gist.github.com/fideloper/e393ca245b895f512944c16dce042a1e/revisions).

## Installing Extra Stuff

You may also want to install additional stuff!

Here's an example of installing `pecl` and pecl-specific modules `sqlsrv` and `pdo_sqlsrv`. Don't tell anyone I said this, but SqlServer is actually a great database, iykyk.

We'll borrow from Microsoft's [docs here](https://learn.microsoft.com/en-us/sql/connect/php/installation-tutorial-linux-mac?view=sql-server-ver16).

The trick here is knowing WHERE in the `Dockerfile` to install things. Generally, you want extra work to be done BEFORE we `COPY` our code base into the container. This is because changes to our code base will bust Docker's build cache, and all the work we do installing stuff will need to be re-done.

If we install things **BEFORE** the `COPY` instruction, all that work can get cached and won't need to be re-done on each deployment!

So, here's a section of the `Dockerfile` that shows installing the needed things to get SqlServer working:

```Dockerfile
# Things above this omitted

LABEL fly_launch_runtime="laravel"

###
## NEW STUFF HERE
#
ENV ACCEPT_EULA=Y

# Note we specify version 18 of SqlServer via package msodbcsql18
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && apt-get install --no-install-recommends -y php${PHP_VERSION}-dev php-pear \
       g++ make msodbcsql18 unixodbc-dev mssql-tools \
    && pecl install sqlsrv \
    && pecl install pdo_sqlsrv \
    && printf "; priority=20\nextension=sqlsrv.so\n" > /etc/php/${PHP_VERSION}/mods-available/sqlsrv.ini \
    && printf "; priority=30\nextension=pdo_sqlsrv.so\n" > /etc/php/${PHP_VERSION}/mods-available/pdo_sqlsrv.ini \
    && phpenmod -v ${PHP_VERSION} sqlsrv pdo_sqlsrv
###
## END NEW STUFF
#

# copy application code, skipping files based on .dockerignore
COPY . /var/www/html

# Things below this omitted
```

Here's a [diff](https://gist.github.com/fideloper/92b6c7c89613203f45e26f70cbb161e9/revisions) for full context. We installed a bunch of stuff to get SqlServer drivers installed, and we did it above the line that `COPY`'s our code into the container!

Note that we used one `RUN` command and just ran each command in sequence. This helps reduce the number of instructions in the `Dockerfile` (and therefore the number of "layers" that make up the Docker image), thus reducing the overall size of the image we deploy onto Fly.

Since we put the installation of our stuff up high above the `COPY` instruction, this install step should be cached in the Docker builder cache, and shouldn't normally need to get re-run on every subsequent deployment.
