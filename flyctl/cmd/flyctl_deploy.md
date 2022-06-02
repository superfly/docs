Deploy Fly applications from source or an image using a local or remote builder.
	

## Usage
~~~
flyctl deploy [WORKING_DIRECTORY] [flags]
~~~

## Options

~~~
  -a, --app string            Application name
      --build-arg strings     Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only            Build but do not deploy
      --build-target string   Set the target build stage to build if the Dockerfile has more than one stage
  -c, --config string         Path to application configuration file
      --detach                Return immediately instead of monitoring deployment progress
      --dockerfile string     Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
  -e, --env strings           Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                  help for deploy
  -i, --image string          The image tag or ID to deploy
      --image-label string    Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --local-only            Only perform builds locally using the local docker daemon
      --nix                   Build with Nix
      --no-cache              Do not use the build cache when building the image
      --now                   Deploy now without confirmation
      --plain                 Display full Docker build output
      --push                  Push image to registry after build is complete
  -r, --region string         The region to operate on
      --remote-only           Perform builds on a remote builder instance instead of using the local docker daemon
      --strategy string       The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. Default is canary, or rolling when max-per-region is set.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

