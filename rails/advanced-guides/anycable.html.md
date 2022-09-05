---
title: AnyCable
layout: framework_docs
objective: This guide shows you how to replace Action Cable with AnyCable.
status: beta
---

This guide shows you how to replace [Action Cable](https://guides.rubyonrails.org/action_cable_overview.html)
with [AnyCable](https://docs.anycable.io/).  Both provide similar functionality, but have different scaling
characteristics.  While AnyCable has the potential to reduce RAM requirements on large deployments, the
need to run multiple processes makes it impossible to run AnyCable alongside even a tiny Rails application
on a 256MB machine.  A minimum of 512MB is required.

The configuration below also runs [nginx](https://www.nginx.com/) as a [reverse
proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/) to avoid
any firewall issues.

## Prepare your application

If you haven't already dones so, perform the steps described in the
[Provisioning Redis](../../getting-started/#provisioning-redis) section of the Getting Started guide.  Also be sure that the `pg` gem is listed
in your `Gemfile`.

Now add the `anycable-rails` gem:

```cmd
bundle add anycable-rails
```

Edit `config/cable.yml` thus:

```diff
 production:
-  adapter: redis
-  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
-  channel_prefix: namelist_production
+  adapter: any_cable
```

## Update your image

Modify `Dockerfile` to install `foreman`, `anycable-go` and `nginx`:

```diff
 FROM base
 
+RUN gem install foreman
+RUN curl -L https://go.dev/dl/go1.19.linux-amd64.tar.gz | tar xz -C /opt
+RUN GOBIN=/usr/local/bin /opt/go/bin/go install github.com/anycable/anycable-go/cmd/anycable-go@latest
+
-ARG PROD_PACKAGES="postgresql-client file vim curl gzip libsqlite3-0"
+ARG PROD_PACKAGES="postgresql-client file vim curl gzip libsqlite3-0 nginx"
 ENV PROD_PACKAGES=${PROD_PACKAGES}
 
 RUN --mount=type=cache,id=prod-apt-cache,sharing=locked,target=/var/cache/apt \
     --mount=type=cache,id=prod-apt-lib,sharing=locked,target=/var/lib/apt \
     apt-get update -qq && \
     apt-get install --no-install-recommends -y \
     ${PROD_PACKAGES} \
     && rm -rf /var/lib/apt/lists /var/cache/apt/archives
+
+ADD config/nginx.conf /etc/nginx/sites-available/default
 
 COPY --from=gems /app /app
 COPY --from=node_modules /app/node_modules /app/node_modules
```

Edit `fly.toml` to run foreman::

```diff
 [env]
   PORT = "8080"
-  SERVER_COMMAND = "bin/rails fly:server"
+  SERVER_COMMAND = "foreman start -f Procfile.fly"
```

Add `Procfile.fly` to start the four processes required:

```
nginx: nginx -g 'daemon off;'
server: bin/rails server -p 8081
anycable: bundle exec anycable
ws: anycable-go --port=8082
```

Add `config/nginx.conf` to reverse proxy cable traffic to anycable-go and send the
remainder to your Rails application::

```
server {
        listen 8080 default_server;
        listen [::]:8080 default_server;

        location /cable {
                proxy_pass http://localhost:8082/cable;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "Upgrade";
                proxy_set_header Host $host;
        }

        location / {
                proxy_pass http://localhost:8081/;
                proxy_set_header origin 'https://localhost:8081';
        }
}
```

## Deployment

If you haven't already done so, scale your machine:

```cmd
fly scale vm shared-cpu-1x --memory 512
```

Now you are ready to deploy:
```
fly deploy
```


