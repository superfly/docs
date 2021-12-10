# _flyctl wireguard token_

Commands that managed WireGuard delegated access tokens

### About

Commands that managed WireGuard delegated access tokens

### Usage
~~~
flyctl wireguard token [command] [flags]
~~~

### Available Commands
* [create](/docs/flyctl/wireguard-token-create/)	 - Create a new WireGuard token
* [delete](/docs/flyctl/wireguard-token-delete/)	 - Delete a WireGuard token; token is name:<name> or token:<token>
* [list](/docs/flyctl/wireguard-token-list/)	 - List all WireGuard tokens
* [start](/docs/flyctl/wireguard-token-start/)	 - Start a new WireGuard peer connection associated with a token (set FLY_WIREGUARD_TOKEN)
* [update](/docs/flyctl/wireguard-token-update/)	 - Rekey a WireGuard peer connection associated with a token (set FLY_WIREGUARD_TOKEN)

### Options

~~~
  -h, --help   help for token
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl wireguard](/docs/flyctl/wireguard/)	 - Commands that manage WireGuard peer connections

