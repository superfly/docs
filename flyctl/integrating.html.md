---
title: Integrating Flyctl
layout: docs
sitemap: false
nav: flyctl
---

The flyctl command has a number of features that enable it to be seamlessly integrated with scripted and automated environments such as CI.

## Environment Variables

* `FLY_ACCESS_TOKEN` is an environment variable which can be used to pass an access token to an instance of Flyctl. The token may be obtained using `flyctl auth token`.
* `FLY_APP` is an environment variable which is used as the application name.

## JSON output

Most flyctl commands can product JSON output using the `--json` or `-j` flag. The JSON may be streamed messsages in JSON-NL format or a single JSON object, depending on what is being requested.

