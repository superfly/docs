---
title: Scaling Instances
objective: Scale Postgres instances up to handle more capacity
layout: framework_docs
order: 5
---

You can scale VM resources for an individual machine with the `flyctl machine update` command:

```
$ fly machine update e784079b449483 --memory 1024 --app pg-test
```  
