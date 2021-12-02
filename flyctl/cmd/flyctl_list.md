<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Lists your Fly resources
</p>

## About

The list command is for listing your resources on has two subcommands, apps and orgs.

The apps command lists your applications. There are filtering options available.

The orgs command lists all the organizations you are a member of.

## Usage

~~~
flyctl list [command] [flags]
~~~

## Available Commands
* [apps](/docs/flyctl/list-apps/)	 - Lists all your apps
* [orgs](/docs/flyctl/list-orgs/)	 - List all your organizations

## Options

~~~
  -h, --help   help for list
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

