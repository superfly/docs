---
title: "Connect Retool to your Fly.io Database"
layout: docs
sitemap: false
nav: firecracker
categories:
  - guide
priority: 10
date: 2023-04-11
---

Retool is a low-code platform for building internal tools.
It allows you to connect to your services and databases to build internal tools without writing any code.

In this guide we'll show you how to connect Retool to your Fly.io database using an SSH Tunnel.
We'll use a Fly.io Postgres Database for this guide, but the same steps can be used to connect Retool to any of their [SSH Tunnel supported databases](https://docs.retool.com/docs/enabling-ssh-tunnels).

## Requirements

Make sure you have an account on [Retool](https://retool.com/).

Make sure you've [setup a Fly.io database](https://fly.io/docs/postgres/getting-started/create-pg-cluster/) and have the connection details.

## Step 1: Get the Retool Public Key

Navigate to your Retool account and select "Create a Resource" in the "Resources" card.

Enter your database username and password.

Leave SSL/TLS unchecked.

Enable SSH Tunnel.

You do not yet have the "Bastion" details, but you need to Download Retool's public key - the link should be towards the bottom of the create resource form.

Leave this form open, we'll come back to it.

## Step 2: Create an SSH Server on Fly.io

In order to safely expose your Fly.io database to Retool,
we'll create an SSH server on Fly.io that will act as a tunnel from Retool to Fly.io database.

```cmd
git clone https://github.com/fly-apps/ssh-app
cd ssh-app
fly launch
```

When `fly launch` prompts you,
allow it to copy the configuration from this fly.toml,
enter a name for your SSH Server app,
select the organization that your Fly.io database is in,
select the region that your Fly.io database is in,
do not create a postgres or redis for this app,
and do not deploy. Then run:

```cmd
fly ips allocate-v4
```

Copy the contents of the Public Key we downloaded earlier. An easy way to do that on a Mac is to run:

```cmd
cat ~/Downloads/retool.pub | pbcopy
```

Now you can setup the public key secret and deploy the SSH App:

```cmd
fly secrets set PUBLIC_KEY="the contents of the public key file"
fly deploy
```

## Step 3: Connect Retool to your Fly.io Database

Now that we have an SSH Server on Fly.io, configured with the retool public key,
we can connect Retool to our Fly.io database.

Go back to the Retool form we left open earlier and enter your SSH Server as the Bastion host.
It should look something like "yoursshserver.fly.dev".

You can see we only the internal port 22, as port 1122 over the internet in the SSH app's fly.toml.
Because of that we'll set 1122 as the port in the Retool form.

Now you should be able to select "Test Connection" and see a green checkmark.

If that's working, you can select "Create Resource."

## Step 4: Using your resource in Retool

TODO: Holy crap this needs screenshots or a gif or something.

Now that you've created your resource, you can use it in Retool.

Navigate to or create a Retool "app."

Switch to the "Edit" mode.

On the right-hand bar there's you can select "Create" to add components to your app.

Drag a Table component onto your app.

With the Table component selected, look to the bottom left, and select the "+" in the "Code" area.

Select "Resource query" and select the resource you created - it will add a query to the bottom of the Code list.

In the bottom middle, now, you can see the query you just added.

In that same bottom middle pane, click the "Resource" dropdown and select the Fly database you added to Retool.

Enter a simple query like `SELECT * FROM users LIMIT 10;` and click "Save & Run."

You should see the data table populated with the results of your query.

## Conclusion

You can now build internal tools with Retool and connect them to your Fly.io database.

This isn't necessarily limited to Retool, you can use any tool that supports SSH Tunneling to connect to your Fly.io database.

It's also not limited to Fly.io databases, you can use this same technique to connect to any database that supports SSH Tunneling.

You could also use this technique to tunnel to secure APIs.
