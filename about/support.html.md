---
title: Support
layout: docs
nav: firecracker
toc: false
---

<img src="/static/images/support.webp" srcset="/static/images/support@2x.webp 2x" alt="An open laptop with a Fly.io sticker on it, sitting on the ground next to a coffee mug and a cute turtle.">

Need support? We can help! Here's where to look.

## Fly.io status

For platform-wide issues and updates, please view our [status page](https://status.flyio.net/).

For host-level issues that might affect your apps, see your [dashboard](https://fly.io/dashboard).

## Community forum

**Who can use this:** Everyone

**Use this for:** General questions, troubleshooting advice, best practices, and sharing tips with other Fly.io users.

All customers have access to our active [community forum](https://community.fly.io). We're in the forums regularly to help out with customer issues and post new feature announcements.

Customers also frequently help each other out and share insights on running their apps on Fly.io. Especially helpful contributors can earn a special "Aeronaut" badge to signify their troubleshooting prowess, great advice, and exceptional kindness.

## Email support

**Who can use this:** Customers who have purchased a Standard, Premium, or Enterprise Support package.

**Use this for:**  Issues or questions specific to you.

Our Standard, Premium, and Enterprise packages have access to email support. These plans come with an organization-specific address for emailing support questions, typically `<org-name>@support.fly.io`.

You can find your support address is in the [Fly.io dashboard](https://fly.io/dashboard). Select your organization, and look for your unique email address in the **Support** section. You'll also find a form to submit new support tickets, as well as an overview of recent support interactions.

## Support metrics

The Fly.io Support team publishes our email support response time metrics in order to better set expectations regarding response times and help to you understand how we're doing. You can view these metrics in the public [Support Metrics Dashboard](https://fly.io/support).

## Working with support

We understand that describing technical issues can sometimes be challenging. Providing a clear and detailed description of the problem, including any noticeable symptoms and relevant artifacts, can help us identify similar cases and potentially speed up the resolution process.

Here are some things to include in your ticket:
- Your app name and/or Machine ID.
- Specific errors in your app logs or browser. What you observed (e.g. 'it threw a 500 error').
- What you were trying to achieve (e.g. deploy the application).
- What you did (e.g. I ran `fly deploy`).
- UTC timestamps for when the issue occurred.
- Prepending `LOG_LEVEL=debug` to any flyctl command will provide insight into the lower-level API calls being made.
- If you are sending us error messages or log output, it's best to send that as plain text in the body of the email (or upload a `.txt` or `.log` file for longer outputs), rather than attached screenshots of your terminal window.

## Scope of Support

This section highlights the products we actively work on and maintain, and therefore, the ones we can provide support for. While we can't offer support for users' code, you can find [links to the most common frameworks](https://fly.io/docs/getting-started/get-started-by-framework/) used on Fly.io.
### Supported Products
- **Networking**
- **Machines** (including GPUs)
- **Apps**
- **Launch/Deploy** (UI & CLI)
- **Volumes**
- **FKS**
- **Security**
- **Accounts & Billing**
- **Extensions** (Tigris, Upstash, Depot)

### Limited Support

- **Monitoring** (metrics and logs)

### Products We Don't Support

- **LiteFS**
- **Unmanaged Postgres**:  
  Our current Postgres offering is [unmanaged](https://fly.io/docs/postgres/getting-started/what-you-should-know/), and we generally can't provide in-depth guidance for it. We understand this might be frustrating, and we're working on a managed offering. Until then, we recommend considering a managed provider like [Crunchy Bridge](https://www.crunchydata.com/products/crunchy-bridge) if you encounter consistent issues with our unmanaged Postgres.


## Other questions?

For questions about a specific invoice or account management issues, email us at [billing@fly.io](mailto:billing@fly.io).
