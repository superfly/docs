### Dependencies

The `litefs` binary is self-contained, but you'll need to install the `fuse3`
library so LiteFS is able to mount a local file system. You'll also need
`ca-certificates` if you're connecting to Consul. This installation
depends on your package manager but some examples are:

```sh
# Install on Alpine
$ apk add ca-certificates fuse3
```

```sh
# Install on Debian/Ubuntu
$ apt install ca-certificates fuse3
```

### Installing LiteFS

LiteFS is meant to run inside your container along side your application. You
can pull in the `litefs` binary by copying it from the official Docker image:

```Docker
COPY --from=flyio/litefs:0.4 /usr/local/bin/litefs /usr/local/bin/litefs
```

It's recommended that you run LiteFS as `root` in Docker instead of using the
`USER` command to change users. If you need to run your application as another
user, use the `su` command to run your application as a non-root user.

Take a look at [the example Dockerfile][Dockerfile] in the `litefs-example` repo
for an example.

[Dockerfile]: https://github.com/superfly/litefs-example/blob/main/Dockerfile