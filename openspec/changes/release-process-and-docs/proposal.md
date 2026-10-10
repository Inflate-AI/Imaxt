# Proposal

## Why

Imaxt v1 shipped with GitHub Actions running the full lint/typecheck/test/build
matrix on every push and PR, a release workflow that re-ran that same suite
before publishing, and only a README for documentation. The repo is about to
go public and be published to npm: it needs validation to happen locally
(fast feedback, no CI minutes spent re-running what a contributor's own
machine already proved), a release pipeline whose only job is the npm
deploy, and documentation a stranger - or a future contributor adding block
#20 - can actually use.

## What Changes

- **BREAKING (process, not code)**: removes `.github/workflows/ci.yml`
  entirely. Lint/typecheck/test/build no longer run in GitHub Actions.
- Adds local git hooks (`simple-git-hooks`): pre-commit runs lint, pre-push
  runs typecheck + test + build. Installed automatically via a `postinstall`
  script on `bun install`, so every clone gets them without a manual step.
- Trims `.github/workflows/release.yml` to exactly: install, build, then
  Changesets (version-PR or publish) - no test step. Automated npm
  publishing becomes this workflow's only job.
- Rewrites the root `README.md` for a public audience (badges, clearer
  package table, quickstart per package, links into `docs/`).
- Adds `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` at the repo
  root (GitHub's recognized locations for these).
- Adds a `docs/` folder: an index, a getting-started guide, an architecture
  page, a release-process page for maintainers, and - the part meant to
  scale - one page per block pairing under `docs/blocks/` (mirroring
  `packages/core/src/*.ts`'s module boundaries) plus its own index. Adding
  block #20 later means adding one new file and one index row, not editing
  a growing reference document.

## Capabilities

### New Capabilities

(none - this is tooling, process, and documentation; no package's runtime
behavior changes)

### Modified Capabilities

(none)

## Impact

- **CI/CD**: `.github/workflows/ci.yml` deleted; `.github/workflows/release.yml`
  rewritten. Validation that used to run in Actions now runs locally via git
  hooks - a contributor who bypasses hooks (web UI edits, `--no-verify`) is
  not caught by CI anymore. This is an accepted, explicit tradeoff for this
  change, not an oversight.
- **New root devDependency**: `simple-git-hooks`.
- **New files**: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  `docs/**`.
- **No package source code changes** - `packages/core`, `packages/editorjs`,
  `packages/mdx`, `packages/astro` are untouched by this change.
