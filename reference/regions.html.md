---
title: Regions
layout: docs
sitemap: false
nav: firecracker
---

The Fly Platform gets close to users by running applications in datacenters close to users. These datacenters are identified by region. 

The platform works out which region an application should be running in based on the incoming connection from a client. It then starts the application in that region and completes the connection.

This means that an application does not need to know which region it is running in.

There are a set of Fly capabilities available to applications, such as region-local Redis databases, that are tied to a region.

## _Discovering your Application's Region_

When an application is started, a three-character value is set in the environment variable `FLY_REGION` reflecting the region it is running in.

|Region ID| Region Location |
|---------|-----------------|
ams|Amsterdam, Netherlands
atl|Atlanta, Georgia (US)
cdg|Paris, France
dfw|Dallas, Texas (US)
ewr|Parsippany, NJ (US)
fra|Frankfurt, Germany
gru|Sao Paulo, Brazil
hkg|Hong Kong
iad|Ashburn, Virginia (US)
lax|Los Angeles, California (US)
lhr|London, United Kingdom
maa|Chennai (Madras), India
mia|Miami, Florida (US)
nrt|Tokyo, Japan
ord|Chicago, Illinois (US)
scl|Santiago, Chile
sea|Seattle, Washington (US)
sin|Singapore
sjc|Sunnyvale, California (US)
syd|Sydney, Australia
yyz|Toronto, Canada

`FLY_REGION` is just one of the range of [Runtime Enviroment](/docs/runtime-environment/) information available to applications.
