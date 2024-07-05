---
title: Integrating flyctl
layout: docs
nav: flyctl
---

The flyctl command has a number of features that enable it to be seamlessly integrated with scripted and automated environments such as CI.

## Environment variables

* `FLY_ACCESS_TOKEN` is an environment variable which can be used to pass an access token to an instance of Flyctl. The token may be obtained using `flyctl auth token`. A token with permission to manage a single app can be generated with `fly tokens create deploy`.
* `FLY_APP` is an environment variable which is used as the application name.

## JSON output

Many flyctl commands can produce JSON output using the `--json` or `-j` flag. The JSON may be streamed messages in JSON-NL format or a single JSON object, depending on what is being requested.

