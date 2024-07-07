---
title: Full Stack Caching
layout: docs
sitemap: false
nav: firecracker
---

Full stack app frameworks typically include powerful caching APIs. Developers can use these to cache everything from full HTTP responses to view partials to structured data. In general, the goal of caching in full stack apps is to improve performance and levers for scaling.

Users prefer fast applications regardless of scale. Standard caching APIs in frameworks allow you to improve application speed without prematurely optimizing some of the more finicky parts of your app. Instead of over-optimizing a DB schema that will likely change as you iterate, you can cache rendered views and avoid hitting the database altogether.

Responsiveness is usually a function of latency. When a user requests data, applications typically deal with:

* Input lag, how long it takes something they type/clip/tap/say to appear on the screen. If your app is simple, you hopefully don't have to worry about this. However, if you incorporate a lot of third-party JavaScript, it might become an issue.
* The "slow" speed of light: when a user sends data to your backend, they have to wait for a light to go from their device, through their ISP (which can be frightfully slow), across the world, and into your server.
* Data processing time: you likely have to perform some computations to handle a user's request and generate a response.
* The speed of light again! Your server sends data, it traverses the internet, arrives at the users (frightfully slow) ISP and lands on their device.
* Render lag: additional computations are involved when a device renders information on a user's screen.

Humans are reasonably sensitive to delays, with most people perceiving slowdowns as brief as 100ms. The best apps have latency budgets -- a "deadline" for responding to user input. This can vary a bit depending on the action, if a user makes a complicated request and gets a message that "we're working on it" very quickly, they might tolerate several seconds of delay. If they perform a seemingly simple action (like clicking a URL on Google), they tend to be much less forgiving.

Latency budgets are hard! You can really only control two things: (1) render performance and (2) how fast you can get data to a user's ISPs.

Fly helps you get data to a user's ISP faster by running your app geographically close to your users. For example, a user in San Francisco making a request to your app will connect to a server running in San Jose, usually within 5ms. If that same user connects to a server in New York City to use your application, it might take around 150ms. Remember the 100ms "perceptible to humans" number? Light is so "slow" a human can perceive how long it takes to travel across the United States.

So if your app just does some math without talking to a DB or an outside service, Fly is great! But apps that do that are boring. Your users probably care about data you manage on their behalf. If you're using a typical database, moving it close to users can be difficult and expensive. It's often simplest to keep it in one place. Placing your app in different cities reduces latency between users and application logic but might increase latency between application logic and the data it needs.

The trick is to avoid requesting data from your primary database. When you do request "slow" data, store it in a fast cache so you can skip the query next time.

Fly hosted applications include local Redis cache storage. When you request data from your database, you can save the response (or a transformed version of it) in the cache. The next time you request that data, you'll get it back in just a few milliseconds. Most framework cache APIs can use Redis. Enabling caching in your app will result in immediate performance improvements on Fly with minimal code changes.

## _View caching_

Most popular frameworks offer Redis adapters for view caching. If you’ve already configured view caching, you can typically just add a Redis adapter library, and point at [Fly’s Redis cache](/docs/redis/).

If your application purges the caches when data changes, you’ll need to add a little bit of logic to [send the purge/delete commands to `database 1`](/docs/redis/#managing-redis-data-globally) on your Fly Redis connection. This ensures they get applied in every region.
