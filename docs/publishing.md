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

No one ever runs `npm publish` by hand. Publishing authenticates via npm's
[Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC) -
GitHub Actions proves its identity to npm directly, scoped to this exact
repository and workflow file, with no long-lived secret to generate, store,
or rotate.

## One-time setup

Trusted Publishing can't perform a package's very first publish - npm
requires the package to already exist before a trusted publisher can be
attached to it. So each new package goes through this once:

1. Make sure `main` exists and is this repo's default branch - the release
   workflow only triggers on pushes to `main`.
2. Publish the package for the first time from a maintainer's own machine,
   signed in with `npm login` (interactive, so normal 2FA applies):
   ```sh
   bun install && bun run build
   bunx changeset publish
   ```
3. On that package's page on npmjs.com, go to **Settings → Trusted
   Publisher** and add a GitHub Actions publisher: organization/user,
   repository name, and the workflow filename (`release.yml`) - these are
   case-sensitive. Leave the environment field blank unless this workflow
   is scoped to one.
4. Do this soon after creating the trusted-publisher entry: npm expects a
   successful publish from that exact workflow within a short window of
   it being configured, or you'll need to reconfigure it.

After that, the normal loop is: merge PRs with changesets → the bot keeps
a "Version Packages" PR up to date → merge that PR when you're ready to
release → the workflow publishes the packages with version bumps via
OIDC, no token involved.
