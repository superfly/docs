Commands that managed WireGuard delegated access tokens

## Usage
~~~
main wireguard token [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/main-wireguard-token-create/)	 - Create a new WireGuard token
* [delete](/docs/flyctl/main-wireguard-token-delete/)	 - Delete a WireGuard token; token is name:<name> or token:<token>
* [list](/docs/flyctl/main-wireguard-token-list/)	 - List all WireGuard tokens
* [start](/docs/flyctl/main-wireguard-token-start/)	 - Start a new WireGuard peer connection associated with a token (set FLY_WIREGUARD_TOKEN)
* [update](/docs/flyctl/main-wireguard-token-update/)	 - Rekey a WireGuard peer connection associated with a token (set FLY_WIREGUARD_TOKEN)

## Options

~~~
  -h, --help   help for token
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main wireguard](/docs/flyctl/main-wireguard/)	 - Commands that manage WireGuard peer connections

