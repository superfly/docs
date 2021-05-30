# _flyctl ssh establish_

Create a root SSH certificate for your organization

### About

Create a root SSH certificate for your organization. If <override>
is provided, will re-key an organization; all previously issued creds will be
invalidated.

### Usage
```
flyctl ssh establish [<org>] [<override>] [flags]
```

### Options

```
  -h, --help   help for establish
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl ssh](/docs/flyctl/ssh/)	 - Commands that manage SSH credentials

