---
title: Redis on Fly
layout: docs
sitemap: false
nav: firecracker
---

## _What Is Redis On Fly._

[Redis](https://redis.io) is a popular in-memory key/value store. On Fly, it can provide a region-local cache to Fly applications and a cross-region mechanism for communication. 

## _Getting Redis For An Application_

There is no configuration to be done to enable Redis. The environment variable `FLY_REDIS_CACHE_URL` contains a URL for Redis and should be retrieved by your application so they can use a standard Redis driver to connect.

## _How it works_

We run Redis clusters in each region for your app processes. Your app can access these clusters with minimal latency so you can cache application data, views, or partials.

Writes to the regional Redis clusters are only visible within their region. If you cache information in Chicago, for example, it’s not visible to application processes that run in Amsterdam. This helps reduce duplication of data, applications have surprisingly little cache overlap across regions.

The clusters are volatile and in memory only. Cache data can vanish at any time. These Redis instances should not be used for data you don’t want to lose, they’re intended only for use as caches.

## _The Redis `select` command_

When you connect to the Fly Redis service, you can only read from database 0. Most Redis drivers select database 0 by default. 

## _Managing Redis data globally_

Database 1 is a “virtual” Redis. You can access it by running the `select 1` command. This database returns an `ok` response for any well-formed command immediately, and then replays the command + parameters in every region your application is running in.

This is useful for purging cache data, and can also be used to “push” cache data to each region. 

**Note:** command propagation is eventually consistent. Under most circumstances, small commands should be applied to every region in less than 1 second. Large commands can take a bit longer to propagate (if you `set` a very large value, for example). Commands might also be slow to propagate in the event of network issues.

## Unsupported Redis Commands

<div class="max-w:full overflow-x:auto bg:white shadow:lg r mb:4">
<table class="table:stretch table:pad text:sm text:no-wrap m:0">
<thead><tr><td colspan="5"><strong>PubSub commands not supported</strong></td></tr></thead>
<tr><td>PSUBSCRIBE</td><td>PUBLISH</td><td>PUBSUB</td><td>PUNSUBSCRIBE</td><td>SUBSCRIBE</td></tr> 
<tr><td>UNSUBSCRIBE</td><td>DISCARD</td><td>EXEC</td><td>MULTI</td></tr>
</table>
</div>

<div class="max-w:full overflow-x:auto bg:white shadow:lg r mb:4">
<table class="table:stretch table:pad text:sm text:no-wrap m:0">
<thead><tr><td colspan="5"><strong>Other commands not supported</strong></td></tr></thead>
<tr><td>MOVE</td><td>RANDOMKEY</td><td>SORT</td><td>DBSIZE</td><td>TIME</td></tr> 
<tr><td>CLIENT</td><td>CONFIG</td><td>MONITOR</td><td>SLOWLOG</td><td>SWAPDB</td></tr> 
<tr><td>MEMORY</td><td>LOLWUT</td><td>EVAL</td><td>EVALSHA</td><td>SCRIPT</td></tr> 
<tr><td>GEOADD</td><td>GEOHASH</td><td>GEOPOS</td><td>GEORADIUS</td><td>GEORADIUS<br/>BYMEMBER</td></tr> 
<tr><td>FLUSHDB</td></tr>
</table>
</div>

**Note:** Many of these commands are excluded because they are used for server or client management.

