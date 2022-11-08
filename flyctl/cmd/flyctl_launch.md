Create and configure a new app from source code or a Docker image.

## Usage
~~~
flyctl launch [flags]
~~~

## Options

~~~
      --auto-confirm                  Will automatically confirm changes when running non-interactively.
      --build-arg strings             Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only                    Build but do not deploy
      --build-secret strings          Set of build secrets of NAME=VALUE pairs. Can be specified multiple times. See https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information
      --build-target string           Set the target build stage to build if the Dockerfile has more than one stage
      --copy-config                   Use the configuration file if present without prompting
      --detach                        Return immediately instead of monitoring deployment progress
      --dockerfile string             Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --dockerignore-from-gitignore   If a .dockerignore does not exist, create one from .gitignore files
  -e, --env strings                   Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --generate-name                 Always generate a name for the app, without prompting
  -h, --help                          help for launch
  -i, --image string                  The Docker image to deploy
      --image-label string            Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --local-only                    Only perform builds locally using the local docker daemon
      --name string                   Name of the new app
      --nixpacks                      Deploy using nixpacks to generate the image
      --no-cache                      Do not use the build cache when building the image
      --no-deploy                     Do not prompt for deployment
      --now                           Deploy now without confirmation
  -o, --org string                    The target Fly organization
      --path string                   Path to the app source root, where fly.toml file will be saved (default ".")
      --push                          Push image to registry after build is complete
  -r, --region string                 The target region (see 'flyctl platform regions')
      --remote-only                   Perform builds on a remote builder instance instead of using the local docker daemon
      --strategy string               The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. Default is canary, or rolling when max-per-region is set.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

