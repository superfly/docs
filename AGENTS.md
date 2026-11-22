# AGENTS.md

Source for the Fly.io docs at https://docs.fly.io, built with Mintlify.

## Layout

- Pages are MDX (`.mdx`) with a `title` in the frontmatter. Most also set `description` and `source_url`; copy them from a neighbouring page.
- Navigation and redirects live in `docs.json`. Add a nav entry for a new page, and a `redirects` entry when you move or delete one.
- Internal links are root-relative with no `/docs` prefix: `/postgres`, not `/docs/postgres/`.
- Shared fragments are in `snippets/`, images in `images/`.
- Don't edit generated pages. `flyctl/cmd/*.mdx` is synced from superfly/flyctl, and `api/machines/models.mdx` comes from the Machines API spec. Fix those at the source.
- Pages under `/sprites` live in superfly/sprites-docs.
- Mintlify serves Markdown files as pages even when they aren't in the nav (`README.md` excepted). List files that shouldn't be published, like this one, in `.mintignore`.

## Preview and checks

- Preview locally: `npx mint@latest dev` prints a localhost URL to open. `--port` picks the port.
- Check internal links: `npx mint@latest broken-links`. It already reports a few broken links on `main` and can't parse `api/machines/models.mdx`, so compare against `main` and don't add new ones.
- CI runs [Vale](https://vale.sh) 3.24.0 on changed files, using `.vale.ini` and the house style in `styles/Fly`. It reports but doesn't fail the PR. To run it locally: `vale <files>`.
- When a PR touches `flyctl/cmd/` or `docs.json`, CI checks that every `flyctl/cmd` page has a nav entry and every `flyctl/cmd` nav entry has a page.

## Pull requests

- Fill in `.github/pull_request_template.md`: Summary of changes, Preview, Related links, Notes.
- `.github/CODEOWNERS` assigns every file to `@superfly/docs`.
