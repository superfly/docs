---
title: Full Stack Caching
layout: docs
sitemap: false
nav: firecracker
---

Frameworks for full stack apps typically include powerful caching APIs. Developers can use these to cache everything from full HTTP responses to view partials to structured data. In general, the goal of caching in full stack apps is improve performance and levers for scaling.

Users prefer fast applications regardless of scale. The standard caching APIs in frameworks give you a way to make your application fast without spending wasted time prematurely optimizing some of the more finicky bits of your app. Rather than over optimizing a DB schema that will probably change as you iterate, for example, you can cache a rendered view and avoid hitting the database altogether.

Responsiveness is usually a function of latency. When a user requests data, applications typically deal with:

* Input lag, how long it takes something they type/clip/tap/say to appear on the screen. If your app is simple you hopefully don't have to worry about this. If you put in a load of third party javascript, it might be a problem.
* The "slow" speed of light: when a user sends data to your backend, they have to wait for a light to go from their device, through their ISP (which can be frightfully slow), across the world, and into your server.
* Data processing time: you probably have to do some computering to handle a user's request and then generate a response.
* The speed of light again! Your server sends data, it traverses the internet, arrives at the users (frightfully slow) ISP and lands on their device.
* Render lag: there's more computering involved when a device paints information on a user's screen.

Humans are reasonably sensitive to delays. Most people can perceive a slow down of as little as 100ms. The best apps have a latency budgets -- a "deadline" for responding to user input. This can vary a bit depending on the action, if a user makes a complicated request and gets a message that "we're working on it" very quickly, they might tolerate several seconds of delay. If they do something that seems simple (like click a URL on Google), they tend to be much less forgiving.

Latency budgets are hard! You can really only control two things: (1) render performance and (2) how fast you can get data to a user's ISPs.

Fly helps you get data to a user's ISP faster by running your app geographically near your users. A user who makes a request to your app in San Francisco, for example, will connect to a server running in San Jose, usually in under 5ms. If that same San Francisco user connects to New York City to use your application, it might take more like 150ms. Remember the 100ms "perceptible to humans" number? Light is so "slow" a human can perceive how long it takes to travel across the United States.

So if your app just does some math without talking to a DB or an outside service, Fly is great! But apps that do that are boring. Your users probably care about data you manage on their behalf. If you're using a typical database, it's difficult and expensive to move close to users ... simplest to keep it in one place. So putting your app in different cities reduces latency between your users and the application logic, but might increase latency between your application logic and the data it uses to do magic.

The trick is to avoid requesting data from your primary database. And when you do request "slow" data, to keep it in a fast cache store so you can skip that query next time.

Fly hosted applications include local Redis cache storage. When you request data from your database, you can save the response (or a transformed version of the response) in the cache. The next time you request that data, you'll get it back in just a few milliseconds. Most framework cache APIs can use Redis, so if you enable caching in your app you'll see an immediate performance improvement on Fly with minimal code.

## _View caching_

Most popular frameworks offer Redis adapters for view caching. If you’ve configured view caching already, you can typically just add a Redis adapter library, and point at [Fly’s Redis cache](/docs/redis/).


If your application purges the caches when data changes, you’ll need to add a little bit of logic to [send the purge/delete commands to `database 1`](/docs/redis/#managing-redis-data-globally) on your Fly Redis connection. This ensures they get applied in every region.
