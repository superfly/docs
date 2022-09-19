---
title: Machines
objective: Learn how to use the new Fly Machines to provision, run, and scale Rails applications via the fly CLI
status: alpha
layout: framework_docs
---

## Provision the application

First we need to create an application on Fly that will be associated with the machine:

```cmd
fly machines launch
```

This will create a `Dockerfile` and `fly.toml` file at the root of your project.

### Configure `fly.toml` for a web application

...

### Connect a Postgres database

```cmd
$ fly pg create
```

You'll get a `DATABASE_URL` at the end of this process, which you'll want to save in a secret manager.

```cmd
$ fly secrets set DATABASE_URL=<paste the URL from the previous step>
```

Let's deploy the machine!

### Deploy the machine

```cmd
fly deploy
```

### Open the machine

Once the machine deploys, lets open it.

```cmd
fly open
```

If all went well, you should see your application.
