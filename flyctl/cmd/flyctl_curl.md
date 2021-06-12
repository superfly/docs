# _flyctl curl_

Run a performance test against a url.

### About

Check connection information in each region.

### Example

```
flyctl curl https://fly.io
```

|Region|Status|DNS|Connect|TLS|TTFB|Total|
|------|------|---|-------|---|----|-----|
scl|200|3.7ms|4ms|37.2ms|29.4ms|31.2ms
|...

### Usage
```
flyctl curl <url> [flags]
```

### Options

```
  -h, --help   help for docs
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

