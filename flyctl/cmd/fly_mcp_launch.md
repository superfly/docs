[experimental] Launch an MCP stdio server


## Usage
~~~
fly mcp launch command [flags]
~~~

## Options

~~~
      --auto-stop string            Automatically suspend the app after a period of inactivity. Valid values are 'off', 'stop', and 'suspend' (default "suspend")
      --bearer-token                Use bearer token for authentication (default true)
      --claude                      Add MCP server to the Claude client configuration
      --config stringArray          Path to the MCP client configuration file (can be specified multiple times)
      --cursor                      Add MCP server to the Cursor client configuration
      --file-literal stringArray    Set of literals in the form of /path/inside/machine=VALUE pairs where VALUE is the content. Can be specified multiple times.
      --file-local stringArray      Set of files in the form of /path/inside/machine=<local/path> pairs. Can be specified multiple times.
      --file-secret stringArray     Set of secrets in the form of /path/inside/machine=SECRET pairs where SECRET is the name of the secret. Can be specified multiple times.
      --flycast                     Use wireguard and flycast for access
  -h, --help                        help for launch
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
      --image string                The image to use for the app
  -i, --inspector                   Launch MCP inspector: a developer tool for testing and debugging MCP servers
      --name string                 Suggested name for the app
      --neovim                      Add MCP server to the Neovim client configuration
      --org string                  The organization that will own the app
      --password string             Password to authenticate with
  -r, --region string               The target region. By default, the new volume will be created in the source volume's region.
      --secret stringArray          Set of secrets in the form of NAME=VALUE pairs. Can be specified multiple times.
      --server string               Name to use for the MCP server in the MCP client configuration
      --user string                 User to authenticate with
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
  -v, --volume strings              Volume to mount, in the form of <volume_name>:/path/inside/machine[:<options>]
      --vscode                      Add MCP server to the VS Code client configuration
      --windsurf                    Add MCP server to the Windsurf client configuration
      --zed                         Add MCP server to the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

