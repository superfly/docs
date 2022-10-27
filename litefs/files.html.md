---
title: LiteFS Special Files
layout: docs
sitemap: false
nav: litefs
toc: true
---

LiteFS handles user-created files based on their suffix:

- Journal files have a `-journal` suffix.
- WAL files have a `-wal` suffix.
- Shared memory files have a `-shm` suffix.

All other user-created files are treated as SQLite databases. Additionally,
there are special read-only files made available by LiteFS as an easy way to
communicate state to the end user.

## Primary file

If the LiteFS node is currently a replica _and_ it is connected to the primary
LiteFS node, a `.primary` file will be available in the LiteFS directory. You
can read this file to determine where to redirect write requests from your
application:

```sh
$ cat /path/to/mnt/.primary
hostname.example.com
```

This file will return the `hostname` specified in the primary node's
configuration file or, if unspecified, it will read `hostname(2)` from the
primary node's operating system. A newline is appended to the end.

If the `.primary` file is unavailable then the local LiteFS node is either:

1. Currently the primary and can accept writes, or
2. Unable to determine or connect to the primary.


## Position files

Each database created in LiteFS maintains a position in their replication log.
The position is a combination of a monotonically incrementing transaction ID
(TXID) and a rolling checksum of the database contents.

You can view the position for any database by reading the `-pos` suffixed file
next to the database file. For example, if you have a database named `db` then
you can read from a file called `db-pos`:

```sh
$ cat /path/to/mnt/db-pos
00000000002df417/ce552e44f23fbbdd
```

The TXID is representated a 16-character hex-encoded `uint64`. The checksum is
encoded as a 16-character hex-encoded byte array. These are concatenated using
a slash and a newline is appended at the end.

