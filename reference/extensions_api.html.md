---
title: Provisioning Fly.io Extensions
layout: docs
sitemap: false
nav: **firecracker**
---

*This document is super-alpha: expect things to change! Please give us feedback.*

Read our [Extensions Program overview](https://fly.io/docs/about/extensions) before digging into this doc.

## Provisioning Flow

Fly.io is a CLI-first platform. So provisioning extensions starts there. Either when launching an app, or when a customer explicitly asks to provision an extension.

We'll forward this provision request on to you, along with details about the provisioning Fly.io organization. You should reply synchronously with details about your provisioned extension, and we'll attach these details to a target application, where applicable.

## Provisioning Accounts and Organizations

To support single-sign on (SSO), billing and email communication with customers, you should provision the following along with a resource:
* An account to own extensions provisioned through Fly
* An organization/team, where applicable, to match the Fly.io organization
* A single administrator user, as an SSO and email communication target

We'll send you an email alias that routes to the administrators of the customer Fly.io organization. You can use that to send notifications, support tickets, etc. We recommend that for each resource provisioning request, you provision the above inline, idempotently. This removes the need for a separate account provisioning API.

## Provisioning API

This section covers our proposal for a REST-based provisioning API.

### Authentication and Request Signing

Given the high privilege afforded to us by your platform, we request that you:

* Authenticate requests using a shared secret token
* Validate signed requests using a different shared secret

 At some point, we'll sign all provisioning requests with a secret key, regardless of the authentication mechanism. You should validate these signatures for added security.

We follow the [IETF HTTP Message Signature Spec](https://www.ietf.org/archive/id/draft-ietf-httpbis-message-signatures-05.html), using the [HMAC SHA-256](https://www.ietf.org/archive/id/draft-ietf-httpbis-message-signatures-05.html#name-hmac-using-sha-256) algorithm. Here's a list of libraries that implement the spec:

Golang: [https://github.com/zntrio/httpsig](https://github.com/zntrio/httpsig)
Ruby: [https://github.com/99designs/http-signatures-ruby](https://github.com/99designs/http-signatures-ruby)
Python: [https://pypi.org/project/requests-http-signature](https://pypi.org/project/requests-http-signature/)

Here's an example verifier from a Rails app.

```ruby
require "http_signatures"

$http_sig = HttpSignatures::Context.new(
  keys: {"flyio-signing-secret" => ENV{'FLYIO_SIGNING_SECRET']},
  algorithm: "hmac-sha256",
  headers: ["(request-target)", "Date", "Content-Length"],
)

$http_sig.verifier.valid?(request)

```
### Request Path

We recommend your API offer a single base URL, like `https://logjam.io/flyio`, and append the paths below as REST resources.

### Resource provisioning

Fly.io will send a signed `POST` request to `{base_url}/extensions` with the following parameters.

**Parameters**

| Name | Type | Description | Example |
| --- | --- | --- | --- |
| **name** | string | Name of the extension, unique across the Fly.io platform | `collider-prod` |
| **id** | string | Unique ID representing the extension | `30bqn49y2jh` |
| **organization_id** | string | Unique ID representing an organization | `M03FclA4m` |
| **organization_name** | string | Display name for an organization | `Supercollider Inc` |
| **organization_email** | string | Obfuscated email that routes to all organization admins (does not change) | `n1l330mao@customer.fly.io` |
| **primary_region** | string | The three-letter, primary Fly.io region where the target app intends to write from | `mad` |
| **read_regions** | array | An array of Fly.io region codes where read replicas should be provisioned | `["mad", "ord"]` |
| **ip_address** | string | An IPv6 address on the customer network assigned to this extension | `fdaa:0:47fb:0:1::1d` |

```javascript
POST https://logjam.org/flyio/extensions

{
  name: "test",
  id: "test",
  organization_id: "highflyers",
  organization_name: "High Flyers",
  email: "v9WvKokd@customer.fly.io",
  user_id: "NeBO2G0l0yJ6",
  primary_region: "mad",
  ip_address: "fdaa:0:47fb:0:1::1d",
  read_regions: ["syd", "scl"]
}

```

Your response should contain, at least, a list of key/value pairs of secrets that that should be set on the associated Fly.io application. These secrets are available as environment variables. They aren't visible outside of an application VM.

```javascript
{
  "LOGJAM_URL": "https://user:password@test.logjam.org",
}

```

### Fetching extension data

We might want to fetch data about your extension. Implementing this endpoint is optional. We should discuss this on a case-by-case basis.

### Updating Extensions

We like to make extensions updatable directly from `flyctl`. For example, a database might allow adding or removing read replica regions, or we may want to allow updating payment plans.

Your API should support updates when they apply, using the same optional parameters as the `POST` request above, at:

```
PATCH {base_url]/extensions/{extension_id}

```

### Single Sign On Flow

We want to get users into your platform with as little friction as possible, directly from `flyctl`. Example:

`flyctl ext logjam dashboard -a myapp`

If the user isn't already logged in, you should issue an OAuth authorization request to:

```
https://fly.io/oauth/authorize?client_id=123&request_type=code&scope=encodedscope

```

You should pass the organization ID and desired permission level in the scope. Only `admin` is permitted as a permission level. It means that only Fly.io organization admins may successfully login via SSO to your platform.

```
scope: {organization_id: "abc", permission: "admin"}

```

In the event of a successful authentication, you'll receive an authorization code which can be exchanged for an access token. The access token currently has no permissions, and may be discarded. since the goal of this exchange is purely to verify the user's account and organization membership on Fly.io.


## Deploying your service on Fly.io

Contact us at extensions@fly.io about deploying your service here.
