<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Launch a new app
</p>

## About

Create and configure a new app from source code or an image reference.

## Usage

~~~
flyctl launch [flags]
~~~

## Options

~~~
      --dockerfile string   Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --generate-name       Always generate a name for the app
  -h, --help                help for launch
      --image string        the image to launch
      --name string         the name of the new app
      --no-deploy           Do not prompt for deployment
      --now                 deploy now without confirmation
      --org string          the organization that will own the app
      --path string         path to app code and where a fly.toml file will be saved. (default ".")
      --region string       the region to launch the new app in
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

