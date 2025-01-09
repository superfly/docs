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

**Who can use this:** Organizations who have purchased a Standard, Premium, or Enterprise Support package or organizations with legacy Launch or Scale plans.

**Use this for:**  Technical support for issues or questions specific to you.

Our Standard, Premium, and Enterprise packages have access to email support. These plans come with an organization-specific address for emailing support questions, typically `<org-name>@support.fly.io`.

You can find your support address is in the [Fly.io dashboard](https://fly.io/dashboard). Select your organization, and look for your unique email address in the **Support** section. You'll also find a form to submit new support tickets, as well as an overview of recent support interactions.

## Support Portal

**Who can use this:** Organizations who have purchased a Standard, Premium, or Enterprise Support package or organizations with legacy Launch or Scale plans.

**Use this for:** Technical support for issues or questions specific to you.

The Support Portal is a self-service portal for customers to submit support tickets, view recent support interactions, and track the status of their tickets. You can access it from your [Fly.io dashboard](https://fly.io/dashboard) by clicking the **Support** tab.

## Billing and account support

**Who can use this:** Everyone

**Use this for:** Billing and account management issues.

For questions about a specific invoice or account management issues, you can email us at [billing@fly.io](mailto:billing@fly.io).

## Support metrics

The Fly.io Support team publishes our email support metrics to better set expectations regarding response times and help to you understand how we're doing. You can view these metrics in the public [Support Metrics Dashboard](https://fly.io/support).

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

<div class="max-w-4xl">
  <p class="mb-6">
    This section highlights the products we actively work on and maintain, and therefore, the ones we are able to provide support for. While we can't offer support for user's code, you can find [links to the most common frameworks](https://fly.io/docs/getting-started/get-started-by-framework/)</a> used on Fly.io.
  </p>

  <p class="mb-8">
    Your code is yours alone to write. We're not able to provide direct support or guidance for the specific language or framework that you use. There are many of them out there and we can't be experts in all of them, but if we do know the answer we'll always let you know.
  </p>

  <div class="border-2 border-gray-200 rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-3 ">
      <div class="p-6 border-r border-gray-200">
        <h3 class="font-bold mb-4">Supported Products</h3>
        <ul class="space-y-2">
          <li>**Networking**</li>
          <li>**Machines** (including GPUs)</li>
          <li>**Apps**</li>
          <li>**Launch/Deploy** (UI & CLI)</li>
          <li>**Volumes**</li>
          <li>**FKS**</li>
          <li>**Security**</li>
          <li>**Accounts & Billing**</li>
          <li>**Extensions** (Tigris, Upstash, Depot)</li>
        </ul>
      </div>

      <div class="p-6 border-r border-gray-200">
        <h3 class="font-bold mb-4">Limited Support</h3>
        <ul class="space-y-2">
          <li>**Monitoring** (metrics and logs)</li>
        </ul>
      </div>

      <div class="p-6">
        <h3 class="font-bold mb-4">Not Supported</h3>
        <ul class="space-y-2">
          <li>**LiteFS**</li>
          <li>**Unmanaged Postgres**</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="max-w-4xl">
  <p class="mb-6 mt-8">
    Our current Postgres offering is [unmanaged](https://fly.io/docs/postgres/getting-started/what-you-should-know/). In general, [Fly.io](http://fly.io/) provides support for the automated provisioning, daily snapshots, global networking, and Prometheus metrics for Postgres databases, but unfortunately we're not able to provide in-depth guidance or troubleshooting for your unmanaged Postgres database apps.
    We are working on a managed offering, but until then, we recommend folks look at a managed provider such as [Crunchy Bridge](https://www.crunchydata.com/products/crunchy-bridge) if they run into consistent issues with our unmanaged Postgres.
  </p>