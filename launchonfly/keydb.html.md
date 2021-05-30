---
title: KeyDB on Fly
layout: docs
sitemap: false
nav: firecracker
toc: true
---

[Launch KeyDB On Fly](https://fly.io/launch/keydb)

## About KeyDB

KeyDB is a high-performance fork of Redis with a focus on multithreading, memory efficiency, and high throughput.

## KeyDB Template

The launch template for KeyDB will deploy two instances in the selected region, with the selected VM type and memory, configured for multi-master replications and persistence. The template will generate a password which you should record, or replace with an appropriately strong password of your own making.

### External Connections

The template configures the app with a non-TLS external port 10000. The application is externally accessible at `appname.fly.dev` where appname is your selected application name. You may also attach a custom domain to the application to give it a hostname outside `.fly.dev`.

### Private 6PN Connections

As a Fly application, your app is accessible through the 6PN private networking of Fly. This means applications within the same organization can look up the app at `appname.internal` and communicate with it over its default ports. For KeyDB, that is the non-TLS port 6379.  

### Lost Password?

If you have lost your password to your KeyDB app, it is possible to reset it using the command:

```
fly -a appname secrets set KEYDB_PASSWORD=newpassword
```

## Example: Connecting over 6PN

The following examples use an appname of `demokeydb`:

#### Go (with redigo)

This is an excerpt from an example which caches results from querying a GitHub API (you can find the full example at [github.com/fly-apps/keydb-6pn-go](https://github.com/fly-apps/keydb-6pn-go).

```go
...
var conn redis.Conn

func main() {
	var err error

	password, lookup := os.LookupEnv("KEYDB_PASSWORD)

	if !lookup {
		log.Fatal("Set secret KEYDB_PASSWORD to password")
	}
	redisurl := fmt.Sprintf("redis://:%s@demokeydb.internal", password)
	conn, err = redis.DialURL(redisurl)

	if err != nil {
		log.Fatal(err)
  }
...
```


