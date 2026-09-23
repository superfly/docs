# Fly.io docs

The documentation published at https://docs.fly.io

## The format changed on 23 September 2026

These docs moved from Sitepress to Mintlify. If you have a branch, a fork or an
open pull request from before that date, it targets a tree that no longer exists
here.

What changed:

- Pages are MDX (`.mdx`) rather than `.html.md` and `.html.markerb`, and there
  are no ERB partials.
- Navigation lives in `docs.json` rather than in partials.
- Internal links drop the `/docs` prefix, so `/docs/postgres/` is now
  `/postgres`, and the `+external` suffix on outside links is gone.
- Redirects go in the `redirects` array in `docs.json`.

Rewriting a page as MDX is usually quicker than rebasing. Find the equivalent
`.mdx` file, apply your change there, and open a fresh pull request. If yours was
closed during the migration, the diff is still on it.

## Sprites documentation lives elsewhere

Pages under `/sprites` are built from
[superfly/sprites-docs](https://github.com/superfly/sprites-docs). Open pull
requests for those there.

## The old site

`fly.io/docs/*` redirects to `docs.fly.io/*`, preserving the path. The Sitepress
source remains in this repository's history.
