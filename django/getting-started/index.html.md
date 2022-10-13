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

In this guide we build and deploy a simple Django website to demonstrate how quickly Django apps can be deployed on Fly.io. <!-- The Django Full App example shows how to link to a database and deploy a full Django website. -->

## Initial Set Up
Make sure that [Python](https://www.python.org/) is already installed on your computer along with a way to create virtual environments. We will use [venv](https://docs.python.org/3/library/venv.html#module-venv) in this example but any of the other popular choices such as [Poetry](https://python-poetry.org/), [Pipenv](https://github.com/pypa/pipenv), or [pyenv](https://github.com/pyenv/pyenv) will work too.

Within a new virtual environment (called `.venv` in our example) follow the official Django docs for [Getting Started with Django](https://www.djangoproject.com/start/) to install the latest version. With your environment set up, we'll create a new Django project called `django_project` and a new app called `fly`.

```shell
(.venv) $ django-admin startproject django_project .
(.venv) $ python manage.py startapp fly
```

Add the new `fly` app to the `INSTALLED_APPS` configuration in the `settings.py` file.

```python
# django_project/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "fly",  # new
]
```

## Django Fly App

Now let's configure a basic view that returns the text, "Hello, Fly!" by updating the `fly/views.py` file.

```python
# fly/views.py
from django.http import HttpResponse


def homePageView(request):
    return HttpResponse("Hello, Fly!")
```

Create a new file called `fly/urls.py` with the following code.

```python
# fly/urls.py
from django.urls import path

from .views import homePageView

urlpatterns = [
    path("", homePageView, name="home"),
]
```

And update the existing `django_project/urls.py` file as well.

```python
# django_project/urls.py
from django.contrib import admin
from django.urls import path, include  # new

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("fly.urls")),  # new
]
```

That's it! Run the `migrate` command to initialize our local database and then `runserver` to start up Django's local server.

```shell
(.venv) $ python manage.py migrate 
(.venv) $ python manage.py runserver
```

If you open `http://127.0.0.1:8000/` in your web browser it now displays the text "Hello, Fly!"

## Django Deployment Checklist

By default, Django is configured for local development. The [Django deployment checklist](https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/) lists all the steps required for a secure deployment. However for demonstration purposes only we can take some shortcuts.

First, in the `django_project/settings.py` file update the `ALLOWED_HOSTS` configuration to accept all hosts.

```python
# django_project/settings.py
ALLOWED_HOSTS = ["*"]  # new
```

Second, install [Gunicorn](https://gunicorn.org/) as our production server. 

```shell
(.venv) $ python -m pip install gunicorn==20.1.0
```

Third, create a `requirements.txt` file listing all the packages in the current Python virtual environment.

```shell
(.venv) $ pip freeze > requirements.txt
```

## Fly Deployment
Getting an application running on Fly.io is essentially working out how to package it as a deployable image. There are [three builders](https://fly.io/docs/reference/builders/) available but the default method is to create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). 

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

EXPOSE 8000

CMD ["gunicorn", "--bind", ":8000", "--workers", "2", "django_project.wsgi"]
```

### flyctl

Fly has its own command-line utility for managing apps, [flyctl](https://fly.io/docs/hands-on/install-flyctl/). If not already installed, follow the instructions on the [installation guide](https://fly.io/docs/getting-started/installing-flyctl/) and [log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).

### Provision Django

The command `fly launch` will detect our new `Dockerfile` and build it on Fly servers. It will also generate a `fly.toml` configuration file, which is the final step before actual deployment.

The `fly launch` prompt asks us four questions:

- No, we do not want Fly to overwrite our `Dockerfile`
- You can create a unique app name like `django-hello-fly` or use an auto-generated option
- Select the [Fly.io region](https://fly.io/docs/reference/regions/) closest to you
- Decline to set up a PostgreSQL database right now

```shell
(.venv) $ fly launch
```
```output
Creating app in ~/django-hello-fly
Scanning source code
Detected a Django app
? Overwrite "~/django-hello-fly/Dockerfile"? No
? App Name (leave blank to use an auto-generated name): django-hello-fly
Automatically selected personal organization: John Smith
? Select region: iad (Ashburn, Virginia (US))
Created app django-hello-fly in organization personal
Set secrets on django-hello-fly: SECRET_KEY
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
Your app is ready. Deploy with `flyctl deploy`
```

### fly.toml

The `fly launch` command automatically creates a `fly.toml` configuration file. Add a `[deploy]` directive to run Django's `migrate` command and update both ports to Django's default of `8000`.

```output
# fly.toml
[deploy]  
  release_command = "python manage.py migrate"

[env]
  PORT = "8000"  

[[services]]
  http_checks = []
  internal_port = 8000  
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

You are up and running! Wasn't that easy?

## Recap

We started with an empty directory and in a matter of minutes had a running
Django application deployed to the web. A few things to note:

  * Your application is running on a VM, which starts out based on a Docker image based on our `Dockerfile`.
  * A [`fly.toml`](https://fly.io/docs/reference/configuration/) file was created by `fly launch` which can be modified as needed.
  * `fly dashboard` can be used to monitor and adjust your application. Pretty much anything you can do from the browser window you can also do from the command line using `fly` commands. Try `fly help` to see what you can do.

<!-- Now that you have seen how to deploy a simple Django application, it is time
to move on to a [Full Django App](../../full-django-app/). -->