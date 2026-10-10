# Tasks

## 1. CI and release workflow

- [x] 1.1 Delete `.github/workflows/ci.yml` - verify `.github/workflows/` contains only `release.yml`
- [x] 1.2 Rewrite `.github/workflows/release.yml` to install, build, then run Changesets' action (version-PR or publish, no test step) - verify the workflow YAML is valid (`yamllint` or a GitHub Actions lint if available, else manual review) and contains no `bun test`/`bun run test` invocation

## 2. Local git hooks

- [x] 2.1 Add `simple-git-hooks` as a root devDependency with a `simple-git-hooks` config (pre-commit: lint; pre-push: typecheck + test + build) and a `postinstall` script that installs them - verify `bun install` writes working `.git/hooks/pre-commit` and `.git/hooks/pre-push` files
- [x] 2.2 Verify the hooks actually fire: make a trivial change, confirm `git commit` runs lint and `git push --dry-run` (or a throwaway branch) runs typecheck/test/build

## 3. Root community files

- [x] 3.1 Rewrite `README.md` for a public audience (badges, package table, quickstart, links into `docs/`) - verify it renders sensibly and every internal link resolves to a real file
- [x] 3.2 Add `CONTRIBUTING.md` (dev setup, TDD/OpenSpec workflow, commit/PR conventions, how Changesets works for this repo) - verify it names the actual `bun` commands this repo uses
- [x] 3.3 Add `CODE_OF_CONDUCT.md` (Contributor Covenant) and `SECURITY.md` (how to report a vulnerability) - verify both exist at the repo root where GitHub recognizes them

## 4. docs/ structure

- [x] 4.1 Write `docs/README.md` (index/TOC) and `docs/getting-started.md` (install + quickstart per package) - verify every link in the index resolves
- [x] 4.2 Write `docs/architecture.md` (the 4-package model and how they relate, derived from `openspec/changes/imaxt-v1/design.md`) - verify it accurately reflects the shipped package boundaries
- [x] 4.3 Write `docs/publishing.md` for maintainers (git-hook-based local validation, the Changesets release flow, required `NPM_TOKEN` secret, the accepted no-CI-safety-net tradeoff) - verify it matches the actual release.yml content
- [x] 4.4 Write `docs/blocks/README.md` (index table: block name, core module, EditorJS tool, Astro component) and one page per core module pairing (statement, stat, pull-quote, compare, steps, timeline, bars, sidenote, code-walk, marquee, heatmap, curved-text, scrolly, type-lab, imaxt-cover - 15 pages), each covering data shape, EditorJS usage, Astro/MDX usage, notes - verify every block in `packages/core/src/index.ts` has exactly one page and the index lists all 15

## 5. Final validation

- [x] 5.1 Run `bun run lint`, `bun run typecheck`, `bun test`, `bun run build` from the repo root - verify all exit 0 (this change touches no package source, so this is a regression check, not new coverage)
- [ ] 5.2 Commit and push to `ccr-11238ad0-go18z6`

## Workflow follow-up

- Tell the user the exact steps to make the GitHub repo public and configure the `NPM_TOKEN` secret, since both are account-level actions outside this change's access.
- Archive this change (and `imaxt-v1`, if not already) once the user has reviewed the implementation.
