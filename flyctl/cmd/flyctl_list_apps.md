# _flyctl list apps_

Lists all your apps

### About

The list apps command lists all your applications. As this may be a 
long list, there are options to filter the results.

Specifying a text string as a parameter will only return applications where the
application name contains the text.

The --orgs/-o flag allows you to specify the name of an organization that the
application must be owned by. (see list orgs for organization names).

The --status/-s flag allows you to specify status applications should be at to be
returned in the results. e.g. -s running would only return running applications.

### Usage
~~~
flyctl list apps [text] [-o org] [-s status] [flags]
~~~

### Options

~~~
  -e, --exact           Show exact times
  -h, --help            help for apps
  -o, --org string      Show only apps in this organisation
      --sort string     Sort by name, created (default "name")
  -s, --status string   Show only apps with this status
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl list](/docs/flyctl/list/)	 - Lists your Fly resources

