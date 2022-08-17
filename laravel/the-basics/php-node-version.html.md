---
title: PHP and Node Versions
layout: framework_docs
objective: Adjust the PHP and NodeJS versions used to build and run your Laravel application.
order: 1
---

Your app is a special snowflake. Here are a few things you may want to customize further!

## Node and PHP Version

We try to detect your local version of PHP and match it (with a minimum of PHP 7.4). If we can't determine the version, we default to version 8.0. 

For NodeJS, we default to version 14.

You can define the PHP and NodeJS versions you want by adding/adjusting build arguments in the `fly.toml` file: 

```toml
[build]
  [build.args]
    PHP_VERSION = "8.1"
    NODE_VERSION = "14"
```

Alternatively, you can set (or over-ride) the build arguments when deploying:

```bash
fly deploy --build-arg "PHP_VERSION=8.1" --build-arg "NODE_VERSION=14"
```
