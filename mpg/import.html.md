---
title: Import data from another postgres cluster
layout: docs
nav: mpg
date: 2025-07-11
---


<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>


## Import data from another postgres cluster into your Managed Postgres Cluster

If you're migrating to Fly Managed Postgres (MPG) from an unmanaged Fly Postgres cluster or another Postgres provider, you'll need to import your data into your MPG cluster.

There isn't currently an automated way to migrate an existing DB's data, but you can accomplish this with a standard Postgres dump and restore process after creating your MPG cluster.

For simple databases, this can be as easy as running :

```cmd
 pg_dump "$LEGACY_PG_CONNECTION_STRING" | psql "$MPG_URI".
```

Because your MPG cluster runs within your Fly Private Network, you'll need to be connected to your organizations Wireguard network in order to restore into your MPG database. To run the import process from your local machine, you would take the following steps: 

1. Create your Managed Postgres cluster from the Fly.io dashboard, or using `fly mpg create`

  <div class="warning icon">
  <b>Warning:</b> Your new cluster must be created with a volume at least as large as the database you're importing, otherwise the import process will fail. 
  </div> 

2. Open a proxy connection to your MPG database with
  ```out
  $ fly mpg proxy    
  ? Select Organization: My Organization (personal)
  ? Select a Postgres cluster my-test-cluster (iad)
  Proxying localhost:16380 to remote [fdaa:1:2345:0:0::67]:5432
  ```

3. Find your MPG cluster's connection string in the dashboard, and modify it to use the local proxy: 
  ```out
  Connection String: postgres://fly-user:<password>@localhost:16380/fly-db
  ``` 

4. Run the dump and restore command
```cmd
 pg_dump "$LEGACY_PG_CONNECTION_STRING" | psql postgres://fly-user:<password>@localhost:16380/fly-db
```

5. If everything succeeds, all data from your legacy cluster will be imported into your new MPG cluster. 

For larger or more complex databases, you may need to break the dump and restore process into multiple steps. You may also consider using dedicated PG migration tools like [pgloader](https://pgloader.io/) or [pgcopydb](https://github.com/dimitri/pgcopydb).

## Limitations
Some source databases may not be a good fit for importing into a Fly Managed Postgres cluster.  Some common cases that will prevent imports are if your source database:

- Relies on a third party extension that [isn't supported by MPG](/docs/mpg/extensions)
- Is larger than 1 TB (the maximum storage limit for MPG clusters)

Multi-schema and multi-database imports are supported. If your app uses multiple schemas or databases, imports should work as expected when run with the default `fly-user` or another user with the `schema_admin` role.

Note: While MPG supports up to 1 TB of storage, initial cluster creation is limited to 500 GB. For databases larger than 500 GB, you'll need to create your cluster with the maximum initial size and then expand storage after the import process.