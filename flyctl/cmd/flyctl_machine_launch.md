Create and configure a new app from source code or a Docker image.

## Usage
~~~
flyctl machine launch [flags]
~~~

## Options

~~~
      --build-arg strings      Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only             Build but do not deploy
      --build-secret strings   Set of build secrets of NAME=VALUE pairs. Can be specified multiple times. See https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information
      --build-target string    Set the target build stage to build if the Dockerfile has more than one stage
      --copy-config            Use the configuration file if present, without prompting
      --dockerfile string      Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --generate-name          Always generate a name for the app, without prompting
  -h, --help                   help for launch
  -i, --image string           The image tag or ID to deploy
      --image-label string     Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --local-only             Only perform builds locally using the local docker daemon
      --no-cache               Do not use the build cache when building the image
      --no-deploy              Do not prompt for deployment
      --now                    Deploy now without confirmation
  -o, --org string             The organization to operate on
      --path string            Path to the app source root, where fly.toml file will be saved (default ".")
      --push                   Push image to registry after build is complete
  -r, --region string          The region to operate on
      --remote-only            Perform builds on a remote builder instance instead of using the local docker daemon (default true)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

