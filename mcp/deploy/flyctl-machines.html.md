---
title: flyctl machines
layout: framework_docs
objective: This guide shows you how to use flyctl commands to create a Fly.io machine that runs an MCP server remotely.
status: beta
order: 2
---

The [Fly.io command line interface](https://fly.io/docs/flyctl/help/) is a higher level interface that enables you to do much of what you can do via the Machines API. It is suitable for scripting and ad hoc exploration and updates.

This guide presumes that you have [flyctl installed](https://fly.io/docs/flyctl/install/), and have successfully run either
[`fly auth signup`](https://fly.io/docs/flyctl/auth-signup/) or [`fly auth login`](https://fly.io/docs/flyctl/auth-login/).

The first step is intended to be run in an empty directory.

## Create your app

Now use the [fly apps create](https://fly.io/docs/flyctl/apps-create/) command:

```sh
fly apps create --generate-name --save
```

If you prefer, you can replace `--generate-name` with a name of your choice.

You can also specify the organization by passing in a `--org` parameter.

## Create IP addresses for your application

The following will create a shared IPv4 address and a dedicated IPv6 address:

```sh
fly ips allocate-v4 --shared
fly ips allocate-v6
```

If your application is going to be public, but instead is only going to be accessed by other applications within your organization, run the following instead:

```sh
fly ips allocate-v6 --private
```

## Create a volume

This demo uses a volume. If your application doesn't use a volume skip this step.

```sh
fly volumes create data --region iad
```

Adjust the [region](https://fly.io/docs/reference/regions/#fly-io-regions) as necessary.

## Create a machine

This next part contains a lot of [properties](https://fly.io/docs/machines/api/machines-resource/#machine-config-object-properties), so first an overview:

* The first parameter specifies the image we will be running. Fly.io provides an image capable of running `npx` and `uvx`, which is sufficient to run many MCPs. If you have a custom MCP with unique requirements, you can provide your own image. 
* If you are using a volume, the `--region` selected must match a region in which you have an allocated but unattached volume.
* `--command` specifies the command we will be running. 
* The `--vm-*` parameters specify the size of the machine desired.
* `--volume` specifies the volume, and where it is to be mounted.
* `--auto*` and `--port` define what network services your application provides.

```sh
flyctl machine run flyio/mcp:latest --region iad \
  --command "npx -f @modelcontextprotocol/server-filesystem /data/" \
  --vm-cpu-kind shared --vm-cpus 1 --vm-memory 1024 \
  --volume data:/data \
  --autostart=true --autostop=stop \
  --port 80:8080/tcp:http --port 443:8080/tcp:http:tls
```

Note that this creates and starts a machine. If you want to only create the machine, use [`fly machine create`](https://fly.io/docs/flyctl/machine-create/) instead.

Once this command completes, you can update your `fly.toml` to include this new information using the following command:

```
fly config save --yes
```

## Accessing the MCP via an inspector

You are test out your MCP server using the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```
fly mcp proxy -i
```

Navigate to http://127.0.0.1:6274 ; click Connect; then List Tools; select any tool; fill out the form (if any) and click Run tool.

## Configure your LLM

Here’s an example `claude_desktop_config.json`:

```
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/rubys/.fly/bin/flyctl",
      "args": [
         "mcp",
         "proxy",
         "--url=https://mcp.fly.dev/"
       ]
    }
  }
}
```

Adjust the flyctl path and the value of the --url, restart your LLM (in this case, Claude) and try out the tools.
