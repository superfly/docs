The main command used to start LiteFS is the `litefs mount` command. This mounts
a FUSE file system and then starts an API server for LiteFS nodes to
communicate with each other. You can use this as the `ENTRYPOINT` in your
Dockerfile:

```dockerfile
ENTRYPOINT litefs mount
```

### Running as a supervisor

LiteFS can either be run on its own or it can act as a simple supervisor process
for your application. Running as a supervisor lets LiteFS wait to start the
application until after it has connected to the cluster.

You can specify one or more commands in the `exec` section of your config. If
you set `lease.promote` to `true`, then you can specify to run your migration
scripts only on candidate nodes. This means that candidates will automatically
promote to the primary and run the migrations.

```yml
exec:
  # Only run migrations on candidate nodes.
  - cmd: "rails db:migrate"
    if-candidate: true

  # Then run the application server on all nodes.
  - cmd: "rails server"
```

