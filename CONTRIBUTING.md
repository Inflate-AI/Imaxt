# Contributing

## Setup

```sh
bun install   # also installs this repo's git hooks (see below)
bun test      # run every package's tests
bun run build # build every package
```

Requires [Bun](https://bun.sh) 1.4+.

## How this repo validates changes

There's no CI job re-running your tests. `bun install` sets up local git
hooks instead:

- **pre-commit** runs `bun run lint`.
- **pre-push** runs `bun run typecheck && bun test && bun run build` — the
  real gate, since nothing re-checks it once it's on GitHub.

If a hook fails, fix the issue rather than skipping it. See
[`docs/publishing.md`](./docs/publishing.md) for why this repo works this
way and how to skip a hook in a genuine emergency.

## Workflow: TDD + OpenSpec

Every package in this repo was built test-first: a failing test is
written (and actually run, to confirm it fails for the expected reason)
before the implementation that makes it pass. Keep doing that for new
work - it's not a style preference, it's how this codebase's correctness
is actually established.

Non-trivial changes go through [OpenSpec](https://github.com/Fission-AI/OpenSpec):
a proposal (why), specs (what must be true, as testable scenarios), a
design (how), and a task list, under `openspec/changes/<name>/`, before
any implementation. Look at `openspec/changes/imaxt-v1/` for a worked
example. A pure tooling/docs change with no package-behavior impact can
set `skip_specs: true` in its `.openspec.yaml` instead of writing spec
deltas - see `openspec/changes/release-process-and-docs/` for an example.

Small, obviously-correct fixes (a typo, a broken link) don't need the
full ceremony. When in doubt, open the proposal first and ask.

## Adding a block

See [`docs/blocks/README.md`](./docs/blocks/README.md#adding-a-new-block) -
it's the one doc page written specifically for this.

## Versioning

This repo uses [Changesets](https://github.com/changesets/changesets). If
your change affects a published package's behavior:

```sh
bun run changeset
```

Answer its prompts (which packages, patch/minor/major) and commit the
file it writes under `.changeset/` along with the rest of your PR. See
[`docs/publishing.md`](./docs/publishing.md) for the full release flow.

## Pull requests

- Keep each PR scoped to one change (one OpenSpec change, one logical
  fix).
- Make sure `bun run lint`, `bun run typecheck`, `bun test`, and
  `bun run build` all pass before opening the PR - the pre-push hook
  already checked this for you if you didn't bypass it.
- Describe what changed and why in the PR description; link the OpenSpec
  change if there is one.
