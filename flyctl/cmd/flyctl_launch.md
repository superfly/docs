Create and configure a new app from source code or an image reference.

## Usage
~~~
flyctl launch [flags]
~~~

## Options

~~~
      --copy-config         Use the configuration file if present without prompting
      --dockerfile string   Path to a Dockerfile. Defaults to the Dockerfile in the working directory
      --generate-name       Always generate a name for the app
  -h, --help                help for launch
      --image string        Image to launch
      --name string         Name of the new app
      --no-deploy           Do not prompt for deployment
      --now                 Deploy now without confirmation
      --org string          Organization that will own the app (use org slug here; see "fly orgs list")
      --path string         Path to app code and where a fly.toml file will be saved (default ".")
      --region string       Region to launch the new app in
      --remote-only         Perform builds remotely without using the local docker daemon
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

