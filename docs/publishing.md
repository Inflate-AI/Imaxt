# Publishing (for maintainers)

## Where validation happens

This repo validates locally, not in CI. `bun install` (via `simple-git-hooks`'s
`postinstall`) sets up:

- **pre-commit**: `bun run lint` (Biome — sub-second).
- **pre-push**: `bun run typecheck && bun test && bun run build` (the real
  gate — this is what a passing GitHub Actions job would otherwise have
  re-run on every push).

This is a deliberate tradeoff, not an oversight: a contributor who commits
through GitHub's web UI, or passes `--no-verify`, ships without local
validation and nothing in CI catches it. For this repo's size and
maintainer model, that's accepted in exchange for not burning CI minutes
re-proving what a normal local commit/push already proved. If that
tradeoff ever stops making sense (more external contributors, more
surface area), the fix is to re-add a `ci.yml` that runs the same four
commands on PRs — nothing about the local hooks needs to change.

To skip hooks deliberately (recovering from a bad local state, an
emergency fix): `SKIP_SIMPLE_GIT_HOOKS=1 git commit ...` or `git push
--no-verify`. Don't make this routine.

## Versioning and publishing: Changesets

Every PR that changes a published package's behavior should include a
changeset:

```sh
bun run changeset
```

This asks which packages changed and whether it's a patch/minor/major
bump, and writes a small file under `.changeset/` describing it. Commit
that file with the rest of the PR.

`.github/workflows/release.yml` runs on every push to `main` and does
exactly two things, in order:

1. **If there are unreleased changesets**: opens or updates a "Version
   Packages" pull request that bumps the affected packages' versions and
   removes the consumed changeset files. Nothing is published yet.
2. **Once that PR is merged** (no changesets left pending): builds every
   package and runs `changeset publish`, which publishes to npm only the
   packages whose `package.json` version isn't already on the registry.

No one ever runs `npm publish` by hand. The workflow needs an `NPM_TOKEN`
repository secret (Settings → Secrets and variables → Actions) with
publish access to the `@inflate-ai` npm scope - without it, the publish
step fails with an auth error but the version-PR step still works.

## One-time setup before the first real release

1. Create (or get added to) the `@inflate-ai` organization on
   [npmjs.com](https://www.npmjs.com/).
2. Generate an npm **Automation** access token scoped to that
   organization (Account Settings → Access Tokens → Generate New Token →
   Automation - automation tokens work with 2FA-required orgs, which
   "Publish" tokens don't).
3. Add it to this repo as the `NPM_TOKEN` secret.
4. Make sure `main` is this repo's default branch (the release workflow
   only triggers on pushes to `main`) and that this feature branch has
   been merged into it.

After that, the normal loop is: merge PRs with changesets → the bot keeps
a "Version Packages" PR up to date → merge that PR when you're ready to
release → the four packages with version bumps publish automatically.
