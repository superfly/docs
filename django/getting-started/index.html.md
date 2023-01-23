---
title: Getting Started
layout: framework_docs
order: 1
redirect_from: /docs/getting-started/django/
subnav_glob: docs/django/getting-started/*.html.*
objective: Build and deploy a very basic Django app on Fly. This guide is the fastest way to try using Fly, so if you're short on time start here.
related_pages:
  - /docs/django/getting-started/existing
  - /docs/flyctl/
  - /docs/reference/configuration/
  - /docs/postgres/
---

In this guide we build and deploy a simple Django website to demonstrate how quickly Django apps can be deployed on Fly.io.

## Initial Set Up

Make sure that [Python](https://www.python.org/) is already installed on your computer along with a way to create virtual environments. We use [venv](https://docs.python.org/3/library/venv.html#module-venv) in this example but any of the other popular choices such as [Poetry](https://python-poetry.org/), [Pipenv](https://github.com/pypa/pipenv), or [pyenv](https://github.com/pyenv/pyenv) work too.

Within a new virtual environment, follow the official Django docs for [Getting Started with Django](https://www.djangoproject.com/start/) to install the latest version of Django.

Create a new Django project called `demo`.

```cmd
django-admin startproject demo .
```

Now create a new app called `fly`.

```cmd
python manage.py startapp fly
```

Add the new `fly` app to the `INSTALLED_APPS` configuration in the `demo/settings.py` file.

```python
# demo/settings.py
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

Create a new file called `fly/urls.py` for our app-level URL configuration.

```python
# fly/urls.py
from django.urls import path

from .views import homePageView

urlpatterns = [
    path("", homePageView, name="home"),
]
```

And update the existing `demo/urls.py` file as well for project-level URL configuration.

```python
# demo/urls.py
from django.contrib import admin
from django.urls import path, include  # new

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("fly.urls")),  # new
]
```

That's it! Run the `migrate` command to initialize our local database.

```cmd
python manage.py migrate
```

Now `runserver` to start up Django's local web server.

```cmd
python manage.py runserver
```

If you open `http://127.0.0.1:8000/` in your web browser it now displays the text "Hello, Fly!"

## Django Deployment Checklist

By default, Django is configured for local development. The [How to Deploy Django](https://docs.djangoproject.com/en/stable/howto/deployment/) and [Django deployment checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/) guide list the various steps required for a secure deployment. However, for demonstration purposes, we can take some shortcuts.

First, in the `demo/settings.py` file update the `ALLOWED_HOSTS` configuration to accept all hosts.

```python
# demo/settings.py
ALLOWED_HOSTS = ["*"]  # new
```

Second, install [Gunicorn](https://gunicorn.org/) as our production server.

```cmd
python -m pip install gunicorn
```

Third, create a `requirements.txt` file listing all the packages in the current Python virtual environment.

```cmd
pip freeze > requirements.txt
```

That's it! We're ready to deploy on Fly.

## flyctl

Fly has its own command-line utility for managing apps, [flyctl](https://fly.io/docs/hands-on/install-flyctl/). If not already installed, follow the instructions on the [installation guide](https://fly.io/docs/hands-on/install-flyctl/) and [log in to Fly](https://fly.io/docs/getting-started/log-in-to-fly/).


## Provision Django

To configure and launch the app, run the `fly launch` command and follow the wizard. You can set a name for the app and choose a default region. You can also choose to launch and attach a Postgresql database and/or a Redis database though we are not using either in this example.

```cmd
fly launch
```
```output
Creating app in ~/django-hello-fly
Scanning source code
Detected a Django app
? Choose an app name (leave blank to generate one): django-hello-fly
automatically selected personal organization: Jane Smith
? Choose a region for deployment: Ashburn, Virginia (US) (iad)
Created app django-hello-fly in organization personal
Set secrets on django-hello-fly: SECRET_KEY
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
Your app is ready! Deploy with `flyctl deploy`
```

This creates two new files in the project that are automatically configured: a [Dockerfile](https://docs.docker.com/engine/reference/builder/) and [`fly.toml`](https://fly.io/docs/reference/configuration/) file to configure applications for deployment.

We do not have [static files](https://docs.djangoproject.com/en/stable/howto/static-files/) in this example so comment out that line near the bottom of the autogenerated Dockerfile. Most Django projects do though which is why it is included by default.

```dockerfile
...
# RUN python manage.py collectstatic --noinput
...
```

## Deploy Your Application

To deploy the application use the following command:

```cmd
fly deploy
```

This will take a few seconds as it uploads your application, verifies the app configuration, builds the image, and then monitors to ensure it starts successfully. Once complete visit your app with the following command:

```cmd
fly open
```

You are up and running! Wasn't that easy?

## Recap

We started with an empty directory and in a matter of minutes had a running Django application deployed to the web. A few things to note:

  * Your application is running on a Virtual Machine that was created based on the `Dockerfile` image.
  * The `fly.toml` file controls your app configuration and can be modified as needed.
  * `fly dashboard` can be used to monitor and adjust your application. Pretty much anything you can do from the browser window you can also do from the command line using `fly` commands. Try `fly help` to see what you can do.

Now that you have seen how to deploy a simple Django application, it is time to move on to [Existing Django Apps](/docs/django/getting-started/existing/) that feature static files and a PostgreSQL database.
