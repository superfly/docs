### Dependencies

The `litefs` binary is self-contained, but you'll need to install the `fuse3`
library so LiteFS is able to mount a local file system. You'll also need
`ca-certificates` if you're connecting to Consul, and you'll almost certainly
want to install `sqlite`. This installation  depends on your package manager but
here is a line you can add to your Dockerfile for alpine-based or debian-based images:

```dockerfile
# for alpine-based images
RUN apk add ca-certificates fuse3 sqlite
```

```dockerfile
# for debian/ubuntu-based images
RUN apt-get update -y && apt-get install -y ca-certificates fuse3 sqlite3
```

