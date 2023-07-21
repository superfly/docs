### Testing your LiteFS instance

Once LiteFS is mounted, you can use SQLite clients or the `sqlite3` CLI to
interact with databases on the mount directory:

```
sqlite3 /litefs/my.db
```

LiteFS only allows files in the root of the mount and it does not currently
support subdirectories.
