---
title: Static File Serving
layout: docs
sitemap: false
nav: firecracker
---

Static File serving is offered on all Fly deployments directly from the Fly proxy layer. This allows you to configure one or more directories in your container as static directories with corresponding URL paths — and all files in those directories will be served at those URLs directly from the Fly proxy without having to go through your application. 

## What are static files?
Much of the data commonly served to clients is in the form of CSS, JavaScript and images — these are usually created once during the deployment phase of an application and never changed after that. Any file whose content is written during deployment, that doesn't change after deployment, and is always the same for a given file name is considered a static file. 

## Why serve static files through Fly's proxy?
On many applications static files tend to get pretty large, or numerous, or both. Serving these files via the application itself tends to consume resources in the form of CPU and RAM, not to mention connections and threads — especially when using with concurrency-constrained application servers. Configuring Fly to serve these files directly from the proxy frees up your application to do the actual work it needs to do. 

## Configuring Static File serving
Static file serving is configured via the `[[statics]]` section of your `fly.toml` file. A Rails app, for instance, would have the following configuration by default:

```toml
[[statics]]
  guest_path = "/app/public/assets"
  url_prefix = "/assets"
```

This assumes that the application code in the container is on `/app`. Rails compiles all assets into the `public/assets` folder by default, and since it expects the `public` folder to be served on the `/` root path, it expects these files to be available on `/assets`. 

Other applications will run with different configurations based which stack is used. If you have a React app created with Create React App, for instance you configuration will look like 

```toml
[[statics]]
  guest_path = "/app/build"
  url_prefix = "/"
```
This is because the `yarn build` command compiles all the files into the `build` folder, and expects that folder to be served at the root path. 

Fly will look for and serve `index.html` if the root or a folder path is requested, so static sites should work out of the box. 

## Application Fall-Through
If Fly can't find a file specified in a request, it falls through to your application. This allows you to add custom handlers for special cases like serving custom `index.html` on the root path, creating missing files dynamically, or any other logic you might want. 

At this time, the Fly does not cache responses handled by the application itself — it only serves files present in the configured directories at the time of deployment.  

## Monitoring & Billing
All static responses served by Fly have the `fly-cache-status: HIT/MISS` header specified on them. You can monitor these requests on the Fly dashboard, and they will not pollute your application logs.

Static file responses are billed on the normal outgoing bandwidth rates, and there is no extra charge for the CPU/RAM resources required to serve these files.

## Performance Impact
The Fly proxy can serve static files in sub-millisecond times, so there's usually a positive impact on your application's performance, especially when compared to serving them from the application layer. 

Static files are served from the Fly regions that your application is enabled, deployed and currently running in. While this will make these requests much faster serving them from a single-region deployment, this is not a replacement for a CDN that might copy your files to tens or hundreds of edge locations around the world for the fastest possible service to end users.

## Purging & Cache Invalidation
The static files in the directories you configure are copied over from the container into storage at the proxy layer on each deployment, so there are no separate purging or invalidation actions to take. The cache is cleared automatically on each deployment and re-populated with the files specified in the new deployment. 

If any requests are received during an ongoing deployment process, Fly will continue to serve files from the previous deployment's cache. 

## Caveats
* Fly does not add any **cache control headers** at this time. This has both pros and cons: if you change a file and re-deploy it with the same name your users will see the new file immediately from the next request. But this does mean that users' browsers will re-request the file each time. This may not be a problem, though — browsers will send a `If-None-Match` request header with the hash (ETag) of the file they have in the local cache, and Fly will return a `304 Not Modified` status code if the file hasn't changed, which means the whole file is not sent or billed again. 
* Fly can only parse requests and serve static files when the `http` handler is active. Running with the `tcp` handler or the `tls` handler without `http` means that the entire proxy layer (and static file serving layer) is bypassed, with all requests being served directly by your application.
