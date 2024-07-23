---

title: Enveloop Email API
layout: docs
status: alpha
nav: firecracker
---

[Enveloop](https://enveloop.com) lets developers design, send, and track email and text messages from Fly applications using a simple API. They can store all message content, images, HTML, and CSS in Enveloop -- keeping Fly apps lightweight.

<aside class="callout">
This service is in **public beta** on Fly.io. A couple of notes:

Enveloop is a production service. For our Fly.io launch, we are in public beta as we tighten up the integration.

During the beta period, you won’t be charged for Enveloop usage.
</aside>

## Create an Enveloop project

Creating an Enveloop project happens via the [Fly.io CLI](/docs/hands-on/install-flyctl/). Once the Fly.io CLI is installed, [sign up for a Fly.io account](https://fly.io/docs/getting-started/log-in-to-fly/) and create your first Fly app. From there, you can add an Enveloop project to your app.

<aside class="callout">Running the following command in a Fly app context (inside an app directory or specifying `-a yourapp`) will create a new Enveloop project and Fly Secrets (sandbox & production) on your app.</aside>

```cmd
flyctl ext enveloop create
```

```output
? Select Organization: moon (moon)
? Choose a name, use the default, or leave blank to generate one:
Your Enveloop project (quiet-butterfly-6638) is ready. See details and next steps with:

Setting the following secrets on quiet-butterfly-6638:
ENVELOOP_LIVE_API_KEY: live_**********
ENVELOOP_SANDBOX_API_KEY: test_**********
```

## The Enveloop Web Console

Enveloop provides a visual display of your message templates, a template builder, and message logging and monitoring. To access these features, use the `dashboard` command to launch the Enveloop web app:

```cmd
flyctl ext enveloop dashboard <project_name>
```

## Use Enveloop with your Language and Framework

Here are some examples for how to use Enveloop with various languages and frameworks.

* [Rails with ActionMailer](https://docs.enveloop.com/enveloop-api/languages-and-frameworks/ruby-on-rails)
* [Ruby](https://github.com/enveloophq/enveloop-ruby)
* [Node.js](https://github.com/enveloophq/enveloop-js)
* [Python](https://github.com/enveloophq/enveloop-py)

## Pricing and Billing

<aside class="callout">
During the public beta, Enveloop is free to use on Fly.io. 
</aside>

Enveloop starts at $5 per month. With that, we include 1000 messages per month -- each message over 1000 is $0.005. As you send more messages, individual messages sent cost less -- the breakdown below illustrates. While we only charges for messages (email or text) sent, the $5 minimum helps cover logging, data retention, and support. You can view the official [Enveloop Pricing](https://enveloop.com/pricing) page for additional information.

<aside class="callout">
Here is a breakdown of the per message costs, per month, as your usage on Enveloop scales.

* $0.00500 - 1000-5000 (minimum $5 spend)
* $0.00250 - 5001-50,000
* $0.00170 - 50,001-100,000
* $0.00145 - 100,001-500,000
* $0.00140 - 500,001+

</aside>

Enveloop usage fees are billed daily and will show up, throughout the month, on your Fly.io invoice.

<aside class="callout">
Enveloop plans include unlimited use of our message builder, templates, analytics, logging, and our webhooks. Also, you can add as many users as you need. These features are accessible via the Enveloop web console.

Additional information about Enveloop capabilities are located in the [Enveloop Docs](https://docs.enveloop.com).
</aside>
  
### List your project and view project status

Get a list of your Enveloop projects.

```cmd
flyctl ext enveloop list
```

```output
NAME ORG PRIMARY REGION
quiet-butterfly-6638 moon
```

```cmd
flyctl ext enveloop status quiet-butterfly-6638
```

```output
Status
  Name   = quiet-butterfly-6638
  Status = created
  Region = 
```  

### Delete an Enveloop project

Be aware! -- Deleting can't be undone. This will remove all message settings, templates, and message logs.

```cmd
fly ext enveloop destroy quiet-butterfly-6638
```

```output
Destroying an Enveloop project is not reversible.

? Destroy Enveloop project named quiet-butterfly-6638? Yes
Your Enveloop project quiet-butterfly-6638 was destroyed
```
