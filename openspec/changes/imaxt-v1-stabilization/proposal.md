# Proposal

## Why

Five batches (`imaxt-data-blocks`, `imaxt-narrative-blocks`,
`imaxt-technical-blocks`, `imaxt-formula-block`, `imaxt-typographic-blocks`)
have landed, taking the package from 15 blocks (`0.1.4`) to 40 blocks
(`0.6.0`), each shipped test-first with its own OpenSpec change and
documented in `docs/blocks/`. This change does none of that work itself -
it closes out the push: tag the result `1.0.0`, and update the
process-level docs (`README.md`, `ROADMAP.md`) that described the
library as 15 blocks and the production migration as a "Now" item that
is in fact already done.

This is a pure process/docs change with no package-behavior impact
(`skip_specs: true`, same as `release-process-and-docs`) - no block's
render function, EditorJS tool, Astro component, or MDX mapping changes
here.

## What Changes

- `README.md`'s block list and `ROADMAP.md`'s "Shipped"/"Now" sections
  updated to reflect the 40-block library and the completed production
  migration (both already done in prior work, just not yet reflected in
  these two docs).
- A **major** changeset for all four packages, bumping `0.6.0` → `1.0.0`
  - the first stable release, committing to the semver guarantees that
    implies for this package's public API from here on.

## Impact

- **Packages touched**: none (docs + changeset only).
- **Dependencies**: none.
- **Versioning**: major release (`0.6.0` → `1.0.0`) via changeset.
