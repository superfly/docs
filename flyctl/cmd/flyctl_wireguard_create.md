Add a WireGuard peer connection to an organization

`org` will be prompted for selection if not provided.

Omitting `region` will default to looking up the `FLYCTL_WG_REGION` environment variable or finding the closest region.

If a `name` is not provided, a default will be generated starting with `interactive-*`. These generated names are filtered from DNS and subsequently will not show in `_peer.internal` or `<peername>._peer.internal` queries.

## Usage
~~~
flyctl wireguard create [org] [region] [name] [flags]
~~~

## Options

~~~
  -h, --help   help for create
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl wireguard](/docs/flyctl/wireguard/)	 - Commands that manage WireGuard peer connections
