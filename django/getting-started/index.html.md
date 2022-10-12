---
title: Getting Started
layout: framework_docs
order: 1
redirect_from: /docs/getting-started/django/
subnav_glob: docs/django/getting-started/*.html.*
objective: Build and deploy a very basic Django app on Fly. This guide is the fastest way to try using Fly, so if you're short on time start here.
# related_pages:
#   - /docs/django/fullapp
---

In this guide we build and deploy the Django Welcome Screen to demonstrate how quickly apps can be deployed on Fly.io. Later examples will cover linking to a database deploying Full Django apps.

## Django Set Up
Make sure that [Python](https://www.python.org/) is already installed on your computer. We will use [venv](https://docs.python.org/3/library/venv.html#module-venv) in this example for our virtual environment but any of the other popular choices such as [Poetry](https://python-poetry.org/), [Pipenv](https://github.com/pypa/pipenv), and [pyenv](https://github.com/pyenv/pyenv) will work too.

### New Virtual Environment
From the command line navigate to an empty directory to store your code. On both Windows and macOS the desktop is a good default if you don't already have a preferred location. We will create a new directory called `django-fly` and then activate a new Python virtual environment called `.venv` within it.

```shell
# Windows
$ cd onedrive\desktop\code
$ mkdir fly-django-tutorial
$ cd fly-django-tutorial
$ python -m venv .venv
$ .venv\Scripts\Activate.ps1
(.venv) $

# macOS
$ cd ~/desktop/code
$ mkdir fly-django-tutorial
$ cd fly-django-tutorial
$ python3 -m venv .venv
$ source .venv/bin/activate
(.venv) $
```

### Install Django
Next install Django, create a new project called `django_project`, and run `migrate` to initialize the database. Don't forget that period, `.`, at the end of the `startproject` command.

```shell
(.venv) $ python -m pip install django~=4.1.0
(.venv) $ django-admin startproject django_project .
(.venv) $ python manage.py migrate
```

You should end up with the following directory structure.

```output
├── db.sqlite3
├── django_project
│   ├── __init__.py
|   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
```

### Django Welcome Page
Start up Django's local web server with the `runserver` command.

```shell
(.venv) $ python manage.py runserver
```

In your web browser navigate to `http://127.0.0.1:8000/`. The Django welcome page should be visible.

![Django welcome page](/public/images/django-docs-welcome-page_41.png)

## Django Deployment Checklist
Django is configured by default for local development, not production. There is a [robust series of steps](https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/) required for proper secure deployment. However for demonstration purposes only we can take some shortcuts.

First, in the `django_project/settings.py` file update the `ALLOWED_HOSTS` configuration to accept all hosts.

```python
# django_project/settings.py
ALLOWED_HOSTS = ["*"]
```

Second, install [Gunicorn](https://gunicorn.org/) as our production server. The built-in Django web server is only suitable for local development.

```shell
(.venv) $ python -m pip install gunicorn==20.1.0
```

Third, create a `requirements.txt` file listing all the packages in the current Python virtual environment.

```shell
(.venv) $ pip freeze > requirements.txt
```

This creates a new `requirements.txt` file in the root-level directory. If you look inside it there should be at least the following four packages:

```output
# requirements.txt
asgiref==3.5.2
Django==4.1.2
gunicorn==20.1.0
sqlparse==0.4.3
```

Fourth, configure [static files](https://docs.djangoproject.com/en/4.1/howto/static-files/) for production.

Create a new directory called `static` in the root-level of the project. The new structure should look like this:

```output
├── db.sqlite3
├── django_project
│   ├── __init__.py
|   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── static
```

Then update the `django_project/settings.py` file with two additional lines of configuration:

```python
# django_project/settings.py
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]  # new
STATIC_ROOT = STATIC_ROOT = BASE_DIR / "staticfiles"  # new
```

## Fly Deployment
Getting an application running on Fly.io is essentially working out how to package it as a deployable image. There are [three builders](https://fly.io/docs/reference/builders/) available but the default method is to create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). That is the approach we will take here.

### Dockerfile
In your root-level directory create a new file called `Dockerfile` with the following code.

```dockerfile
# Dockerfile
ARG PYTHON_VERSION=3.10-slim-buster

FROM python:${PYTHON_VERSION}

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code

WORKDIR /code

COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

COPY . /code/

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "django_project.wsgi"]
```

This image uses Python 3.10, installs packages from the local `requirements.txt` file, exposes port `8000` (Django's default), and then uses Gunicorn as the production web server.

The directory structure should now look like this:

```output
├── Dockerfile
├── db.sqlite3
├── django_project
│   ├── __init__.py
|   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt
└── static
```

### flyctl

Fly has its own command-line utility for managing apps, [flyctl](https://fly.io/docs/hands-on/install-flyctl/). If not already installed, follow the instructions on the [installation guide](https://fly.io/docs/getting-started/installing-flyctl/) and [log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).

### Provision Django

The command `fly launch` will detect our new `Dockerfile` and build it on Fly servers. It will also generate a `fly.toml` configuration file, which is the final step before actual deployment.

The `fly launch` prompt asks us four questions:

- No, we do not want Fly to overwrite our `Dockerfile`
- You can either create a unique app name like `fly-django-getting-started` or use an auto-generated option
- Select the [Fly.io region](https://fly.io/docs/reference/regions/) closest to you
- Decline to set up a PostgreSQL database right now

```shell
(.venv) $ fly launch
```
```output
Creating app in /Users/wsv/Desktop/fly-django-getting-started
Scanning source code
Detected a Django app
? Overwrite "/Users/wsv/Desktop/fly-django-getting-started/Dockerfile"? No
? App Name (leave blank to use an auto-generated name): fly-django-getting-started
Automatically selected personal organization: Will Vincent
? Select region: iad (Ashburn, Virginia (US))
Created app fly-django-getting-started in organization personal
Set secrets on fly-django-getting-started: SECRET_KEY
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
Your app is ready. Deploy with `flyctl deploy`
```

### fly.toml

The `fly launch` command automatically creates a `fly.toml` configuration file for us. Add a `[deploy]` directive to run Django's `migrate` command and make sure both ports are listed as `8000`, which is Django's default.

```output
...
[deploy]  # new
  release_command = "python manage.py migrate --noinput"

[env]
  PORT = "8000"  # new

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8000  # new
  ...
```

### Deploy Your Application

To deploy the application use the following command:

```shell
(.venv) $ fly deploy
```

This will take a few seconds as it uploads your application, builds a machine image, deploys the images, and then monitors to ensure it starts successfully. Once complete visit your app with the following command:

```shell
(.venv) $ fly open
```

That's it! You are up and running! Wasn't that easy?

## Recap

We started with an empty directory and in a matter of minutes had a running
Django application deployed to the web. A few things to note:

  * Your application is running on a VM, which starts out based on a
    Docker image based on our `Dockerfile`.
  * A [`fly.toml`](https://fly.io/docs/reference/configuration/) file was created by `fly launch` which can be modified as needed.
  * `fly dashboard` can be used to monitor and adjust your application. Pretty
    much anything you can do from the browser window you can also do from the
    command line using `fly` commands. Try `fly help` to see what you can do.

<!-- Now that you have seen how to deploy a trivial application, it is time
to move on to a [Full Django App](../../full-django-app/). -->