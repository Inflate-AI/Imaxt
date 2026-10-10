# Publishing (for maintainers)

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
4. Make sure `main` exists and is this repo's default branch — the
   release workflow only triggers on pushes to `main`.

After that, the normal loop is: merge PRs with changesets → the bot keeps
a "Version Packages" PR up to date → merge that PR when you're ready to
release → the four packages with version bumps publish automatically.
