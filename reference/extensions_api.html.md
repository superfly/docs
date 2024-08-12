---
title: Provisioning Fly.io Extensions
layout: docs
sitemap: false
nav: firecracker
---

Read our [Extensions Program overview](https://fly.io/docs/about/extensions) before digging into this doc.

## Requirements

To implement the following, we need to provide you with:

* A shared secret for [signing provisioning requests](/docs/reference/extensions_api/#authentication-and-request-signing)
* A shared secret for [signing webhooks](/docs/reference/extensions_api/#webhook-authentication-and-request-signing)
* OAuth application client and secret values

You'll need to give us an OAuth redirect URL for your production environment.

## Provisioning Flow

Fly.io is a CLI-first platform. So provisioning extensions starts there. Either when launching an app, or when a customer explicitly asks to provision an extension.

We'll forward this request on to you, along with details about the provisioning Fly.io organization. You should reply synchronously with details about your provisioned extension. We'll attach these details to a target application, where applicable, as secrets exposed as environment variables in VMs.

Note: If resources take more than 5 seconds to provision, `flyctl` can poll your API for resource readiness.

## Provisioning Accounts and Organizations

We'd like customers to have full access to your platform features through their Fly.io-provisioned account. And you should be able to communicate with customers via email. To that end, all provisioning requests are acccompanied by:

* A unique user ID and working email alias
* A unique organization ID and working email alias that emails org admins

Our SSO flow allows you to fetch user and organization data, to determine whether the user has access to a given resource.

You should provision, at least:

* An account to own extensions provisioned through Fly.io
* An organization/team, where applicable, to match the Fly.io organization
* One or more administrative users as account owners and SSO targets

We recommend provisioning organizations and users idempotently along with the resource provisioning request, or along with SSO sign-in, as described below. This avoid having to implement a separate account provisioning API.

## Resource Provisioning API

This section covers describes a REST-based API for provisioning individual extension resources.

### Authentication and Request Signing

Given the high privilege afforded to us by your platform, we sign all requests with a shared secret and a SHA256 HMAC. We require that providers verify these signatures.

All requests are accompanied by an `X-Signature` header containing the HMAC of the request contents: the query string for `GET` and `DELETE` requests, and the request body for `POST` and `PATCH` requests.

We add the following parameters to help you verify the authenticity of requests. We recommend at least verifying that the signed URL matches the request URL.

```
timestamp: A UNIX epoch timestamp value
nonce: A random unique string identifying the individual request
url: The full request target URL
```

### Request Base URL

We recommend that your partner API builds upon base URL, like `https://logjam.io/flyio`. You can append then the paths shown below as REST resources.

### Resource provisioning

Here's an example provisioning request.

```javascript
POST https://logjam.io/flyio/extensions

{
  name: "test",
  id: "test",
  organization_id: "04La2mblTaz",
  organization_name: "High Flyers",
  user_email: "v9WvKokd@customer.fly.io",
  user_id: "NeBO2G0l0yJ6",
  user_role: "admin",
  primary_region: "mad",
  ip_address: "fdaa:0:47fb:0:1::1d",
  read_regions: ["syd", "scl"],
  url: "https://logjam.io/flyio/extensions",
  nonce: "e3f7b4c8f5ea016d0d2e92048ca0d856",
  timestamp: 1685641159
}

```

**Parameters**

These parameters are sent with every provisioning request.

| Name | Type | Description | Example |
| --- | --- | --- | --- |
| **name** | string | Name of the extension, unique across the Fly.io platform | `collider-prod` |
| **id** | string | Unique ID representing the extension | `30bqn49y2jh` |
| **organization_id** | string | Unique ID representing an organization | `M03FclA4m` |
| **organization_name** | string | Display name for an organization | `Supercollider Inc` |
| **user_id** | string | Unique ID representing the provisioning user | `M03FclA4m` |
| **user_email** | string | Obfuscated email that routes to the **provisioning** user (does not change) | `n1l330mao@customer.fly.io` |
| **user_role** | string | Provisioning user's role | `admin, member` |

**Optional parameters**

These parameters would only be sent for extensions that are region-aware or that deploy on Fly.io.

These parameters are sent with every provisioning request.

| Name | Type | Description | Example |
| --- | --- | --- | --- |
| **primary_region** | string | The three-letter, primary Fly.io region where the target app intends to write from | `mad` |
| **read_regions** | array | An array of Fly.io region codes where read replicas should be provisioned | `["mad", "ord"]` |
| **ip_address** | string | An IPv6 address on the customer network assigned to this extension | `fdaa:0:47fb:0:1::1d` |

Your response should must contain a list of key/value pairs of secrets that that should be set on the associated Fly.io application. These secrets are available as environment variables. They aren't visible outside of an application VM.

If your service is deployed on Fly, the response should also contain details about the target Fly.io application for the private IP address. See the following section for details about this.

**Provisioning Response**

```javascript
{
  "id": "432cb1c9-4d06-4a91-95dc-bc7aa27b896d",
  "config": {
    "LOGJAM_URL": "https://user:password@test.logjam.io"
  },
  "name": "logjam-1bd03ba",
  "fly_app_name": "logjam-production"
}

```

Your response must return a unique ID, which could be yours or the same the one we sent you. We'll always use this ID to make requests to your API. You must also return a `config` object containing the environment variables that the provisioning should set.

Optionally, you can send:

* a `fly_app_name` as the target for Flycast traffic on the IP address provisioned to your extension.
* an updated `name` for the extension resource, should you need to change the name we supplied due to uniqueness constraints or other reasons

| Name | Type | Description | Example |
| --- | --- | --- | --- |
| **id** | string | A unique identifier for the resource on the provider platform | `432cb1c9-4d06-4a91-95dc-bc7aa27b896d` |
| **fly_app_name** | string | Fly.io application name target for internal traffic | `logjam-production` |
| **name** | string | Fly.io application name target for internal traffic | `logjam-1bd03ba` |


### Giving customers private access to your service

If you're deploying on Fly.io, your service should be accessible to customers without exposing it to the public internet. In cases where this isn't possible or desirable, your service allow setting network restrictions to prevent internet access by default.

### Routing private traffic with Flycast

Our [Flycast](/docs/networking/flycast/) internal load balancing feature allow you to route traffic from an IPv6 address on a customer network to one of your Fly.io applications.

The `ip_address` field above refers to this feature. At provisioning time, we'll allocate an address on the customer network for you. Then, your reply should include the target Fly.io application where you wish that IP's traffic to be routed to.

By default, no traffic is routed to your app until it has services configured. See the [Machines API](/docs/machines/api-machines-resource/#create-a-machine) and [fly.toml docs](https://fly.io/docs/reference/configuration/#the-services-sections) for details.

Optionally, you can add the [proxy protocol handler](https://fly.io/docs/networking/services/#connection-handlers) to a service. We co-opt the [proxy protocol](https://github.com/haproxy/haproxy/blob/master/doc/proxy-protocol.txt) as a way to give your service knowledge of the IP address assigned on the customer network, at client connection time. This IP is useful for performing an additional security check beyond user/password credentials or tokens.

### DNS records

For a good developer experience, you should create a public DNS record for your internal service that resolves to the Flycast IP address mentioned in the previous section. This address should be used in the configuration variables in the provisioning response, i.e.:


```javascript
{
  "config": {
    "LOGJAM_URL": "https://user:password@logjam-instance-01.logjam.io"
  },
  "fly_app_name": "logjam-instance-01",
  "id": "432cb1c9-4d06-4a91-95dc-bc7aa27b896d"
}

```

### Fetching extension status

In most cases, we'll need to fetch information about a specific extension resource. For example, to get its current `status`, display usage information, etc.

Also, if your resource cannot be provisioned synchronously, we'll need such this endpoint to poll readiness status.


### Updating Extensions

Customers should be able to update some extensions directly from `flyctl`. For example, adding/removing read replicas on a database.

Your API should support updates using the same parameters as the `POST` request above at:

```
PATCH {base_url}/extensions/{extension_id}
```

### Single Sign On Flow

We want to get users into your platform with as little friction as possible, directly from `flyctl`. Example:

`flyctl ext logjam dashboard -a myapp`

This command should log the customer in to your UI, on the extension detail screen.

The CLI will open the user's browser and send a `GET` request.

`GET {base_url}/extensions/{extension_id}/sso`

If the user is already logged in, you should redirect them to the extension detail screen. If not, you should start an OAuth authorization request to Fly.io, by redirecting to:

```
GET https://api.fly.io/oauth/authorize?client_id=123&response_type=code&redirect_uri=https://logjam.io/flyio/callback&scope=read
```

You should pass the organization ID and desired permissions scope. Currently, only the `read` scope is supported.

Once we authenticate the user, we'll redirect to your OAUth `redirect_uri` with an authorization code you may exchange for an access token via a POST request.

```
POST https://api.fly.io/oauth/token

client_id=logjam
client_secret=123
grant_type=authorization_code
code=myauthcode
redirect_uri=https://logjam.io/flyio/callback
```

The JSON response:

```
{
  "access_token"=>"fo1__034hk03k4mhjea0l4224hk",
  "token_type"=>"Bearer",
  "expires_in"=>7200,
  "refresh_token"=>"j-elry40hpy05m2qbaptr",
  "scope"=>"read",
  "created_at"=>1683733170
}
 ```

Finally, use this access token to issue an inline request to our [token introspection endpoint](https://www.oauth.com/oauth2-servers/token-introspection-endpoint/). The response gives you enough information to:
*  Authorize the user if they belong the correct parent organization in your system
*  Provision the user and add them to these organization
*  Assign a role that maps to the Fly.io `admin` or `member` roles
*  Send emails to the user through an email alias

```
GET https://api.fly.io/oauth/token/info
Authorization: Bearer fo1__034hk03k4mhjea0l4224hk
```

The JSON response:

```
{
  "resource_owner_id"=>"rzjkdw3g0ypx061q",
  "user_id"=>"rzjkdw3g0ypx061q",
  "user_name": "Gabriella Fern",
  "email": "5mrgw4xzkxoz02yk@customer.fly.io",
  "organizations"=> [
      {
        id: "zd3e5wvkjel6pgqw",
        role: "admin"
      },
      {
        id: "zgyep87w1m4q06d4",
        role: "member"
      }
    ],
  "scope"=>["read"],
  "expires_in"=>7200,
  "application"=>{"uid"=>"logjam"},
  "created_at"=>1683740928
}
```

## Incoming Webhooks: Notify Fly.io about changes to extension resources

Providers should send webhooks to Fly.io when changes happen to resources, such as:

* A database transitioning from `ready` to `sleeping`
* A database is removed via the provider UI
* A customer changes their payment plan of a resource or an organization

### Webhook URL and format

Each extension provider gets their own webhook URL, like so:

`https://api.fly.io/api/hooks/extensions/logjam`

This endpoint will accept `POST` requests of the `application/json` type.

### Webhook Authentication and Request Signing

Webhook requests should be signed the same way as we [sign provisioning requests](/docs/reference/extensions_api/#authentication-and-request-signing) but with a different shared secret.

### The webhook request body

The request must include a UNIX `timestamp`, `action` string  and `resource` object. Here's an example:

```
{
  "timestamp": "1693513586",
  "action": "resource.updated",
  "resource": {
    "plan": "scaler_pro",
    "id": "5lgmabb3y30",
    "status": "ready"
  }
}
```

Supported actions are:

```
resource.updated
resource.deleted
resource.created
```

For `resource.created`, the request body should include the Fly.io `organization_id` and `user_id` that provisioned the resource.

```
{
  "timestamp": "1693513586",
  "action": "resource.created",
  "resource": {
    "plan": "scaler_pro",
    "name": "myprod-db"
    "organization_id": "kg032ljbmqs0j",
    "user_id": "nh0kweyt23jyhl",
    "id": "5lgmabb3y30",
    "status": "ready"
  }
}
```

Note: `resource` should contain the same parameters provided by `GET` endpoints for invdividual resources.

## Outbound Webhooks: Get notified about changes to provisioned accounts and resources

We intend to inform your service about system changes such as:
* Addition or removal of provisioned users from an organization
* Provisioned user role changes
* Issues with hosts that affect your deployment
* Individual machine events (stops, starts, crashes, etc)

**Currently, we only send machine events from a single Fly.io organization.**

If your service deploys on Fly.io, we can send you webhooks for machine events, such as stops and starts, with some details about the source and cause of each.

These webhooks conform to the [CloudEvents spec](https://github.com/cloudevents/spec). The spec encodes common attributes like `ID`, `source`, `type` and `timestamp` in HTTP headers. Find your [SDK of choice here](https://github.com/cloudevents/).

*Type* will be encoded in this format: `io.fly.machine.starting`. The contents of `data` varies depending on the event. These types and data will be documented, eventually. For now, consult us on a case-by-case basis if the contents are not self-explanatory.

Here's a sample payload, minus the fields mentioned above.

```
POST https://logjam.io/flyio/extensions/events
{
  "machine_id": "5683977ad31768",
  "status": "failed",
  "data": {
    "Error": "image not found",
    "Transition": "prepareImage"
  }
}
```

## Email communication with customers

The automatic signup process happening through Fly.io is less intentional than the signup one makes through a provider's website. In light of that, we want to avoid overwhelming users with messaging unrelated to their intended goal - provisioning a service.

The following are guidelines, open for discussion on a case-by-case basis.

Providers should discuss their desired email cadence with Fly.io customers early in the process to avoid surprises down the line.

Providers shouldn't ask new users to confirm their email. Email confirmation is a requirement to use our platform, so emails can be assumed to be confirmed ahead of time.

Providers should mostly send transactional messages about the resource itself, or about billing. For example: database idling, system maintenance or alerts about passing free tier limits.

Providers should take care that developers do not receive duplicate emails. For example, if a user is placed on an opt-out email campaign, you should ensure the following:

The same user should not receive multiple, identical emails because they happen to provision resources on more than one Fly.io organization. This is quite common, as organizations are used for separating production and staging environments, for example.

Once a single user in an organization has been placed on an email campaign, other users in the same organization should not be placed on a similar campaign merely for having used SSO sign-in.

## Deploying your service on Fly.io

If you run a latency-sensitive service like a database, we require you run your service on Fly.io to be considered an official extension.

Contact us at [extensions@fly.io](mailto:extensions@fly.io) about deploying your service on the Fly.io platform.

## Billing customers through Fly.io

Your service should offer a minimal billing API for fetching costs and passing them on to customers. We'd want to query this API at least once per day. Fly.io will bill customers for your service and pay you what's owed after deducting the revenue share.

We prefer services that can provide a simple, pay-as-you-go pricing model.

We also prefer that making changes to billing, support plans, etc happen inside the provider UI.

## Support

The support process for Extensions is evolving and should be discussed on a case-by-case basis.

## Limitations

Keep the following in mind when considering running an extension on Fly.io.

The Extensions Program does *not*:

* Run billing logic for your extension - we pass billing data through our invoice for convenience
* Manage your service beyond the underlying Fly.io services
* Run support for your service - but we will pass support requests on to you
* Run workflows to deploy your service automatically - you need a control plane