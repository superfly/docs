---
title: Static File Serving
layout: docs
sitemap: false
nav: firecracker
---

Static File serving is offered on all Fly servers directly from the Fly proxy layer. This allows you to designate a directory in your container and a URL path, and all files in that directory will be served at that URL directly from the Fly proxy without having to go through your application. 

## _What are static files?_
Much of the data commonly served to clients is in the form of CSS, JavaScript and images — these are usually created once during the deployment phase of an application and never changed after that. Any file whose content is written during deployment, that doesn't change after deployment, and is always the same for a given file name is considered a static file. 

## _Why serve static files through Fly's proxy?_
On many applications static files tend to get pretty large, or numerous, or both. Serving these files via the application itself tends to consume resources in the form of CPU and RAM, not to mention connections and threads — especially when dealing with concurrency-constrained application servers. Configuring Fly to serve these files directly from the proxy frees up your application to do the actual work it needs to do. 

## Configuring Static File serving
Static file serving is configured via the `[[statics]]` section of your `fly.toml` file. A Rails app, for instance, would have the following configuration by default:

```toml
[[statics]]
  guest_path = "/app/public/assets"
  url_prefix = "/assets"
```

This assumes that the application code in the container is on `/app`. Rails compiles all assets into the `public/assets` folder by default, and since it expects the `public` folder to be served on the `/` root path, it expects these files to be available on `/assets`. 

Other applications will run with slightly different configurations based which stack is used. If you have a React app created with Create React App, for instance you configuration will look a bit like 

```toml
[[statics]]
  guest_path = "/app/build"
  url_prefix = "/"
```
This is because the `yarn build` command compiles all the files into the `build` folder, and expects that folder to be served at the root path. 

## Application Fall-Through
If Fly can't find a file specified in a request, it falls through to your application. This allows you to add custom handlers for special cases like serving `index.html` on the root path, creating missing files dynamically, or any other logic you might want. 

At this time, the proxy does not cache responses handled by the application itself — only files present in the configured `guest_path` at the time of deployment at served by the proxy. 

## Caveats
* Fly does not add any **cache control headers** at this point in time, so each request is re-served from the Fly edge cache. This has both pros and cons: the good news is that if you change the file and re-deploy with the same name your users will see the new file immediately. But this does need users to retry download the file each time. This isn't often a problem, though — most browsers will send a `If-None-Match` with the hash of the file they already have in the local cache, and Fly will return a `304 Not Modified` status code if the file hasn't changed. 

fly-cache-status: HIT (or MISS) 