If you have an existing database, you can import it using the `ltx import`
command.

```sh
ltx import -name my.db /path/to/database
```

See the [`ltx import`](/docs/litefs/import) documentation for more details.

<div class="callout">
  ❗️ **You should only interact with SQLite databases on LiteFS through
  a SQLite client or through the `litefs` tooling. Do not use `cp` to copy a
  database into place.**
</div>
