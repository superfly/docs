---
title: Static Files
layout: docs
sitemap: false
nav: firecracker
---

Static File serving is offered on all Fly servers directly from the Fly proxy layer. This allows you to designate a directory in your container and a URL path, and all files in that directory will be served at that URL directly without having to go through your application. 

## _What are static files?_
Much of the data commonly served to clients is in the form of CSS, JavaScript and images that are created once during the deployment phase of an application and never changed after that. Any file whose content is written during deployment,  that doesn't change, and is always the same for a given file name is considered a static file. 

## _Why serve static files through Fly's proxy?_
On many applications static files tend to get pretty large, or numerous, or both. Serving these files via the application itself tends to consume resources in the form of CPU and RAM, not to mention connections and threads — especially when dealing with concurrency-constrained application servers. Configuring Fly to serve these files directly from the proxy frees up your application to do the actual work it needs to do. 
