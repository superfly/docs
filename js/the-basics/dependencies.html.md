---
title: Dependencies
layout: framework_docs
objective: Installing needed dependencies, and addressing common problems.
order: 1
---

Whether you are using [bun](https://bun.sh/), [pnpm](https://pnpm.io/),
[npm](https://docs.npmjs.com/cli/v9/commands/npm) or
[yarn](https://classic.yarnpkg.com/lang/en/), most Node.js and Bun applications
depend on [npm](https://www.npmjs.com/) modules, and record
their dependencies in a
[package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) file.

If you are running a Deno app, this page does not apply, instead refer to
[Run a Deno App](https://fly.io/docs/languages-and-frameworks/deno/) for
more information.

## Missing dependencies

If your application works locally but doesn't work when deployed this may be due to
dependencies which are installed globally rather than being enumerated in the
package.json file.  In order to deploy an application, it needs to be self-contained.

You can resolve this by adding the dependency to your `package.json`, typically by
using a command such as `yarn add` or `npm install`.

## Mis-categorized dependencies

Many `package.json` files have two lists of dependencies: `dependencies` and `devDependencies`.
`devDependencies` are intended to list dependencies which are only needed at build time and
not when deployed.  Sometimes dependencies are miscategorized, for example a database tool
needed to perform migration may be listed as a `devDependency` despite the fact that such a
tool is needed to deploy.

It is generally best to correct these errors by moving the dependency to the right place in
the `package.json`.  An alternative when this isn't feasible or desired is to regenerate the
dockerfile to include _all_ dependencies at deployment:

```cmd
npx @flydotio/dockerfile --dev
```

## Legacy peer dependencies

Some `package.json` files have a third set of dependencies `peerDependencies`.  As tooling
support for this varies, this information can become stale and out of sync, causing builds
to fail.  While correcting these dependencies may work for a while, often times it becomes
necessary to indicate that these dependencies are _legacy_.  The way to do this varies
based on the package manager, and dockerfile-node can take care of this for you:

```cmd
npx @flydotio/dockerfile --legacy-peer-deps
```

## Native modules

Some npm modules are _native_ modules which may require additional libraries to be
installed, either at build time, or at deploy time, or both.

```
npx @flydotio/dockerfile --add-base=libxml2
npx @flydotio/dockerfile --add-build=babel
npx @flydotio/dockerfile --add-deploy=fontconfig
```

If you find yourself needing to do this, and your need is a consequence of using a
native module, please open an [issue](https://github.com/fly-apps/dockerfile-node/issues)
so that other users with the same dependency can have this taken care of for
them automatically.
