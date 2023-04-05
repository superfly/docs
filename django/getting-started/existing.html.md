---
title: Existing Django Apps
layout: framework_docs
order: 2
subnav_glob: docs/django/existing/*.html.*
objective: Learn how to run your existing Django applications on Fly.
related_pages:
  - /docs/django/getting-started/existing
  - /docs/flyctl/
  - /docs/postgres/
---

If you have an existing Django app that you want to move over to Fly, this guide
walks you through the initial deployment process and shows you techniques you
can use to troubleshoot issues you may encounter.

## Configure Django

The official [How to Deploy Django](https://docs.djangoproject.com/en/stable/howto/deployment/) guide and [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/) are a good first step to ensure your app is ready for deployment.

The third-party package [WhiteNoise](https://whitenoise.evans.io/en/stable/) is recommended for serving static files in production as this requires [additional configuration](https://docs.djangoproject.com/en/stable/howto/static-files/deployment/).

A production web server must be installed, typically either [Gunicorn](https://docs.gunicorn.org/en/latest/install.html) or [uWSGI](https://uwsgi-docs.readthedocs.io/en/latest/). The database adapter [Psycopg](https://www.psycopg.org/docs/) is commonly used along with [dj-database-url](https://pypi.org/project/dj-database-url/) to establish a Django database connection via a `DATABASE_URL` environment variable.

Be sure to have generated an up-to-date `requirements.txt` file for any new packages added for deployment.

## flyctl

Fly.io has its own command-line utility for managing apps, [flyctl](https://fly.io/docs/hands-on/install-flyctl/). If not already installed, follow the instructions on the [installation guide](https://fly.io/docs/hands-on/install-flyctl/) and [log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).


## Provision Django and Postgres Servers

To configure and launch the app, use the command `fly launch` and follow the wizard. You can set a name for the app, choose a default region, launch and attach a Postgresql database. You can also set up a Redis database though we will not be doing so in this example.

```cmd
fly launch
```
```output
Creating app in ~/django-existing-app
Scanning source code
Detected a Django app
? Choose an app name (leave blank to generate one): django-existing-app
automatically selected personal organization: Jane Smith
? Choose a region for deployment: Ashburn, Virginia (US) (iad)
Created app django-existing-app in organization personal
Set secrets on django-existing-app: SECRET_KEY
Creating database migrations
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? Yes
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster in organization personal
Creating app...
Setting secrets on app django-existing-app-db...Provisioning 1 of 1 machines with image flyio/postgres:14.4
Waiting for machine to start...
Machine 217811c53e0896 is created
==> Monitoring health checks
  Waiting for 217811c53e0896 to become healthy (started, 3/3)

Postgres cluster django-existing-app-db created
  Username:    postgres
  Password:    lt5JoEIVons5INJ
  Hostname:    django-existing-app-db.internal
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:lt5JoEIVons5INJ@django-existing-app-db.internal:5432

Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the Jane Smith organization can connect to this Postgres using the following credentials:
For example: postgres://postgres:lt5JoEIVons5INJ@django-existing-app-db.internal:5432


Now that you've set up postgres, here's what you need to understand: https://fly.io/docs/reference/postgres-whats-next/

Postgres cluster django-existing-app-db is now attached to django-existing-app
The following secret was added to django-existing-app:
  DATABASE_URL=postgres://django_existing_app:6YuIWrdwzVOgVe1@top2.nearest.of.django-existing-app-db.internal:5432/django_existing_app?sslmode=disable
Postgres cluster django-existing-app-db is now attached to django-existing-app
? Would you like to set up an Upstash Redis database now? No

Your Django app is almost ready to deploy!

We recommend using the database_url(pip install dj-database-url) to parse the DATABASE_URL from os.environ['DATABASE_URL']

For detailed documentation, see https://fly.dev/docs/django/
```

## Dockerfile and fly.toml

The `fly launch` command creates two new files in the project that are automatically configured: `Dockerfile` and `fly.toml`.

The [Dockerfile](https://docs.docker.com/engine/reference/builder/) is essentially instructions for creating an image. On the last line make sure to replace `"demo.wsgi"` with your Django project's name.

The [`fly.toml`](https://fly.io/docs/reference/configuration/) file is used by Fly.io to configure applications for deployment. Configuration of builds, environment variables, internet-exposed services, disk mounts and release commands go here.

## ALLOWED_HOSTS & CSRF\_TRUSTED_ORIGINS

The dedicated URL for your deployment will be `<app_name>.fly.dev`. Update the [ALLOWED_HOSTS](https://docs.djangoproject.com/en/stable/ref/settings/#allowed-hosts) and [CSRF\_TRUSTED\_ORIGINS](https://docs.djangoproject.com/en/stable/ref/settings/#csrf-trusted-origins) configurations with your `<app_name>` to include it.

## Deploy Your Application

To deploy the application use the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, verifies the app configuration, builds the image, and then monitors to ensure it starts successfully. Once complete visit your app with the following command:

```cmd
fly open
```

If everything went as planned you will see your Django application homepage.

## Troubleshooting your initial deployment

Since this is an existing Django app, it is highly likely it might not boot because you probably need to configure secrets or other service dependencies. Let's walk through how to troubleshoot these issues so you can get your app running.

### View Log Files

If your application didn't boot on the first deploy, run `fly logs` to see
what's going on.

```cmd
fly logs
```

This shows the past few log file entries and tails your production log
files. [Additional flags](https://fly.io/docs/flyctl/logs/) are available for filtering.

### Console

To SSH into your hosted Django application use the command `fly ssh console`. For example, to execute Django's `createsuperuser` command to log into the admin do the following:

```cmd
fly ssh console
# cd code
# python manage.py createsuperuser
```

If you prefer, this can be run as one command instead:

```cmd
fly ssh console --pty -C 'python /code/manage.py createsuperuser'
```

<div class="callout">The `--pty` flag tells the SSH server to run the command in a pseudo-terminal, which `createsuperuser` requires.</div>

### Secrets

Secrets allow sensitive values, such as credentials and API keys, to be securely passed to your Django applications. You can set, remove, or list all secrets with the [fly secrets](https://fly.io/docs/reference/secrets/) command.

### Git

Deployments are initiated via the `fly deploy` command--git isn't needed to deploy to Fly.io. The advantage of this approach is that your git history will be clean and not full of `git push` commits such as occurs on other hosting platforms.

This also means that `.gitignore` files are not ignored. If you have secrets or other sensitive information in your git history, it is recommended to create a `.dockerignore` file and add the git repo there.

### Databases

Fly.io has a [Postgres offering](https://fly.io/docs/postgres/) to automate provisioning, maintenance, and snapshot tasks for your Postgres database, but it does not manage it. If you run out of disk space, RAM, or other resources on your Fly Postgres instances, you'll have to scale those virtual machines from the Fly CLI. If you prefer, you can instead connect to an [external fully-managed Postgres database](https://fly.io/docs/postgres/#fully-managed-postgres).

### Custom Domain & SSL Certificates

After you finish deploying your application to Fly.io and have tested it extensively, [read through the Custom Domain docs](/docs/app-guides/custom-domains-with-fly) and point your domain at Fly.

In addition to supporting [`CNAME` DNS records](/docs/app-guides/custom-domains-with-fly#option-i-cname-records), Fly.io also supports [`A` and `AAAA` records](/docs/app-guides/custom-domains-with-fly#option-ii-a-and-aaaa-records) for those who want to point `example.com` (without the `www.example.com`) directly at Fly.

### flyctl Commands

The [flyctl CLI docs](https://fly.io/docs/flyctl/) have an extensive inventory of `fly` commands. Here are a few common commands especially if you are coming from another hosting service like Heroku.

| Task         | Command |
|--------------|-----------|
| Log in | `fly login` |
| Launch an app | `fly launch` |
| Deployments | `fly deploy` |
| Open web dashboard | `fly dashboard` |
| SSH | `fly ssh console` |
| Tail log files | `fly logs` |
| Secrets | `fly secrets` |
| View releases | `fly releases` |
| Help | `fly help` |
