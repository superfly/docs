Deploy Fly applications from source or an image using a local or remote builder.

		To disable colorized output and show full Docker build output, set the environment variable NO_COLOR=1.
	

## Usage
~~~
flyctl deploy [WORKING_DIRECTORY] [flags]
~~~

## Options

~~~
  -a, --app string             Application name
      --auto-confirm           Will automatically confirm changes when running non-interactively.
      --build-arg strings      Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only             Build but do not deploy
      --build-secret strings   Set of build secrets of NAME=VALUE pairs. Can be specified multiple times. See https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information
      --build-target string    Set the target build stage to build if the Dockerfile has more than one stage
  -c, --config string          Path to application configuration file
      --detach                 Return immediately instead of monitoring deployment progress
      --dockerfile string      Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
  -e, --env strings            Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                   help for deploy
      --ignorefile string      Path to a Docker ignore file. Defaults to the .dockerignore file in the working directory.
  -i, --image string           The Docker image to deploy
      --image-label string     Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --lease-timeout int      Seconds to lease individual machines while running deployment. All machines are leased at the beginning and released at the end, so this needs to be as long as the entire deployment. flyctl releases leases in most cases. (default 1800)
      --local-only             Only perform builds locally using the local docker daemon
      --nixpacks               Deploy using nixpacks to build the image
      --no-cache               Do not use the build cache when building the image
      --now                    Deploy now without confirmation
      --push                   Push image to registry after build is complete
  -r, --region string          The target region (see 'flyctl platform regions')
      --remote-only            Perform builds on a remote builder instance instead of using the local docker daemon
      --strategy string        The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. Default is canary, or rolling when max-per-region is set.
      --wait-timeout int       Seconds to wait for individual machines to transition states and become healthy. (default 120)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

