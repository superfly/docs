# _flyctl init_

Initialize a new application

### About

The INIT command will both register a new application 
with the Fly platform and create the fly.toml file which controls how 
the application will be deployed. The --builder flag allows a cloud native 
buildpack to be specified which will be used instead of a Dockerfile to 
create the application image when it is deployed.

### Usage
```
flyctl init [APPNAME] [flags]
```

### Options

```
      --builder string   The Cloud Native Buildpacks builder to use when deploying the app
      --builtin string   The Fly Runtime to use for building the app
      --dockerfile       Use a dockerfile when deploying the app
  -h, --help             help for init
      --image string     Deploy this named image
      --import string    Create but import all settings from the given file
      --name string      The app name to use
      --nowrite          Never write a fly.toml file
      --org string       The organization that will own the app
      --overwrite        Always silently overwrite an existing fly.toml file
  -p, --port string      Internal port on application to connect to external services
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

