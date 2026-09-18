---
title: "Machines API"
layout: docs
nav: machines
redirect_from: /docs/machines/working-with-machines/
toc: false
---

<figure class="flex justify-center">
  <img src="/static/images/machine-api.png" alt="Illustration by Annie Ruygt of a group of hovering servers with eyes" class="max-w-lg">
</figure>

The Fly Machines REST API provides resources to provision and manage Fly Apps, Fly Machines, and Fly Volumes.


* **[Working with the Machines API](/docs/machines/api/working-with-machines-api):** Get set up quickly to use the Machines API.

* **[Machines resource](/docs/machines/api/machines-resource):** The core of the Machines API. Use the Machines resource to fully control Machines at speed.

* **[Apps resource](/docs/machines/api/apps-resource):** Create and manage Fly Apps to group and administer your Machines.

* **[Certificates resource](/docs/machines/api/certificates-resource):** Manage SSL/TLS certificates for custom domains.

* **[Tokens resource](/docs/machines/api/tokens-resource):** Request an OpenID Connect token from a 3rd-party.

* **[Volumes resource](/docs/machines/api/volumes-resource):** Create and manage persistent storage volumes for your Machines.

* **[OpenAPI spec](https://docs.machines.dev/+external):** OpenAPI 3.0 specification for the Machines API.

## Client libraries

You can call the Machines API from any HTTP client. The official packages from Fly.io:

* **[fly-go](https://pkg.go.dev/github.com/superfly/fly-go+external):** Go client for the Machines API and the Fly.io GraphQL API. It's the library [flyctl](https://github.com/superfly/flyctl+external) is built on. Module `github.com/superfly/fly-go`.

* **Other languages:** generate a client from the [OpenAPI spec](https://docs.machines.dev/openapi.json+external) with a tool like [openapi-generator](https://openapi-generator.tech/+external).

[Fly Sprites](/sprites/) is a separate API (`api.sprites.dev`) with its own SDKs: [`@fly/sprites`](https://www.npmjs.com/package/@fly/sprites+external) for JavaScript and TypeScript, [`sprites-py`](https://pypi.org/project/sprites-py/+external) for Python, [`sprites-go`](https://pkg.go.dev/github.com/superfly/sprites-go+external) for Go, [`sprites`](https://hex.pm/packages/sprites+external) for Elixir, and an [MCP server](https://sprites.dev/mcp+external).
