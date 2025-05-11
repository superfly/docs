---
title: Deploy on Fly.io
layout: framework_docs_overview
toc: false
order: 1
---

First we explore deploying a stdio MCP on Fly.io using your choice of the Machines API, `fly machine run`, and `fly launch`.
The example we use in each is the same: the [FileSystem MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) running the [flyio/mcp](https://hub.docker.com/r/flyio/mcp) image on DockerHub image on a Machine with a volume.

The remaining sections assume that you chose one of these first.
