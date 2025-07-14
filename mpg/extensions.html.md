---
title: Supported Postgres Extensions
layout: docs
nav: firecracker
date: 2025-07-11
---


<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>


## Supported Bundled Postgres Extensions

Fly.io Managed Postgres (MPG) clusters include all modules and extension provided with the default Postgres 16 distribution. This includes commonly used tools and utilities like `pgcrypto`, `pg_stat_monitor`, and `citext`. 

By default the `plpgsql`, `pg_stat_monitor`, and `pgaudit` extensions are enabled. Other supported extensions can be added by connecting to your cluster and running 
```cmd
CREATE EXTENSION IF NOT EXISTS <extension_name>
```
Extensions that require full superuser permissions may not be able to be installed. 
A full list included default extensions is [available here](/docs/mpg/extensions/#All-included-default-extensions). 


## Supported Third Party Extensions
Aside from the extensions bundled with the default Postgres distribution, we are working to support other commonly used third party extensions.

Currently only [PGVector](https://github.com/pgvector/pgvector) is supported. To enable PGVector on your MPG cluster, it *must* be added when creating the cluster: 

- When creating a cluster via the dashboard, check the "Enable PGVector" option

- When creating a cluster via flyctl, pass the `--pgvector` flag:
```cmd
flyctl mpg create --pgvector
```
Unlike the other extensions, PGVector can not be added to an existing cluster if it was not enabled at creation time. 

We plan on supporting additional third party extensions based on user feedback. If there's an extension you rely on or commonly use, please let us know! 

## All included default extensions

This is a list of all bundled extensions included in MPG. As the default database user for MPG does not have full superuser permissions, not all of these can be enabled at this time. 

| Name | Description |
| --- | --- |
| adminpack | Support toolpack for pgAdmin to provide additional functionality like remote management of server log files. |
| amcheck | Provides functions to verify the logical consistency of the structure of indexes, such as B-trees. It's useful for detecting system catalog corruption and index corruption. |
| auth_delay | Causes the server to pause briefly before reporting authentication failure, to make brute-force attacks on database passwords more difficult. |
| auto_explain | Automatically logs execution plans of slow SQL statements. It helps in performance analysis by tracking down un-optimized queries in large applications that exceed a specified time threshold. |
| basebackup_to_shell | Adds a custom basebackup target called shell. This enables an administartor to make a base backup of a running PostgreSQL server to a shell archive. |
| basic-archive | An archive module that copies completed WAL segment files to the specified directory. Can be used as a starting point for developing own archive module. |
| bloom | Provides an index access method based on Bloom filters.<br>A Bloom filter is a space-efficient data structure that is used to test whether an element is a member of a set. |
| btree_gin | Provides GIN index operator classes with B-tree-like behavior. This allows you to use GIN indexes, which are typically used for full-text search, in situations where you might otherwise use a B-tree index, such as with integer or text data. |
| btree_gist | Provides GiST (Generalized Search Tree) index operator classes that implement B-tree-like behavior. This allows you to use GiST indexes, which are typically used for multidimensional and non-scalar data, in situations where you might otherwise use a B-tree index, such as with integer or text data. |
| citext | Provides a case-insensitive character string type, citext. Essentially, it internally calls lower when comparing values. Otherwise, it behaves almost exactly like text. |
| cube | Implements a data type cube for representing multidimensional cubes |
| dblink | Provides functions to connect to other PostgreSQL databases from within a database session. This allows for queries to be run across multiple databases as if they were on the same server. |
| dict_int | An example of an add-on dictionary template for full-text search. It's used to demonstrate how to create custom dictionaries in PostgreSQL. |
| dict_xsyn | Example synonym full-text search dictionary. This dictionary type replaces words with groups of their synonyms, and so makes it possible to search for a word using any of its synonyms. |
| earthdistance | This module provides two different approaches to calculating great circle distances on the surface of the Earth. The fisrt one depends on the cube module. The second one is based on the built-in point data type, using longitude and latitude for the coordinates. |
| hstore | Implements the hstore data type for storing sets of key/value pairs within a single PostgreSQL value. |
| intagg | Integer aggregator and enumerator. |
| intarray | Provides a number of useful functions and operators for manipulating null-free arrays of integers. |
| isn | Provides data types for the following international product numbering standards: EAN13, UPC, ISBN (books), ISMN (music), and ISSN (serials). |
| lo | Provides support for managing Large Objects (also called LOs or BLOBs). This includes a data type lo and a trigger lo_manage. |
| ltree | Implements a data type ltree for representing labels of data stored in a hierarchical tree-like structure. Extensive facilities for searching through label trees are provided. |
| oldsnapshot | Allows inspection of the server state that is used to implement old_snapshot_threshold. |
| pageinspect | Provides functions that allow you to inspect the contents of database pages at a low level, which is useful for debugging purposes. |
| passwordcheck | Checks users' passwords whenever they are set with CREATE ROLE or ALTER ROLE. If a password is considered too weak, it will be rejected and the command will terminate with an error. |
| pg_buffercache | Provides the set of functions for examining what's happening in the shared buffer cache in real time. |
| pgcrypto | Provides cryptographic functions for PostgreSQL. |
| pg_freespacemap | Provides a means of examining the free space map (FSM), which PostgreSQL uses to track the locations of available space in tables and indexes. This can be useful for understanding space utilization and planning for maintenance operations. |
| pg_prewarm | Provides a convenient way to load relation data into either the operating system buffer cache or the PostgreSQL buffer cache. This can be useful for reducing the time needed for a newly started database to reach its full performance potential by preloading frequently accessed data. |
| pgrowlocks | Provides a function to show row locking information for a specified table. |
| pg_stat_monitor | A more advanced version of pg_stat_statements for tracking planning and execution statistics of all SQL statements executed by a server. Includes all columns available in pg_stat_statements plus provides additional ones.|
| pg_stat_statements | A module for tracking planning and execution statistics of all SQL statements executed by a server. Consider using an advanced version of pg_stat_statements - pg_stat_monitor |
| pgstattuple | Povides various functions to obtain tuple-level statistics. It offers detailed information about tables and indexes, such as the amount of free space and the number of live and dead tuples. |
| pg_surgery | Provides various functions to perform surgery on a damaged relation. These functions are unsafe by design and using them may corrupt (or further corrupt) your database. Use them with caution and only as a last resort |
| pg_trgm | Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching. A trigram is a contiguous sequence of three characters. The extension can be used for text search and pattern matching operations. |
| pg_visibility | Provides a way to examine the visibility map (VM) and the page-level visibility information of a table. It also provides functions to check the integrity of a visibility map and to force it to be rebuilt. |
| pg_walinspect | Provides SQL functions that allow you to inspect the contents of write-ahead log of a running PostgreSQL database cluster at a low level, which is useful for debugging, analytical, reporting or educational purposes. |
| postgres_fdw | Provides a Foreign Data Wrapper (FDW) for accessing data in remote PostgreSQL servers. It allows a PostgreSQL database to interact with remote tables as if they were local. |
| seg | Implements a data type seg for representing line segments, or floating point intervals. seg can represent uncertainty in the interval endpoints, making it especially useful for representing laboratory measurements. |
| segpgsql | SELinux-, label-based mandatory access control (MAC) security module. It can only be used on Linux 2.6.28 or higher with SELinux enabled. |
| spi | Provides several workable examples of using the Server Programming Interface (SPI) and triggers. |
| sslinfo | Provides information about the SSL certificate that the current client provided when connecting to PostgreSQL. |
| tablefunc | Includes various functions that return tables (that is, multiple rows). These functions are useful both in their own right and as examples of how to write C functions that return multiple rows. |
| tcn | Provides a trigger function that notifies listeners of changes to any table on which it is attached. |
| test_decoding | An SQL-based test/example module for WAL logical decoding |
| tsm_system_rows | Provides the table sampling method SYSTEM_ROWS, which can be used in the TABLESAMPLE clause of a SELECT command. |
| tsm_system_time | Provides the table sampling method SYSTEM_TIME, which can be used in the TABLESAMPLE clause of a SELECT command. |
| unaccent | A text search dictionary that removes accents (diacritic signs) from lexemes. It's a filtering dictionary, which means its output is always passed to the next dictionary (if any). This allows accent-insensitive processing for full text search. |
| uuid-ossp | Provides functions to generate universally unique identifiers (UUIDs) using one of several standard algorithms |