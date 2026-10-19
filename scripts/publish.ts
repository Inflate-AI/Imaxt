#!/usr/bin/env bun
// The published package has no workspace dependencies, so release only needs
// a verified build followed by Changesets publication.
import { $ } from 'bun';

await $`bun run build`;
const extraArgs = process.argv.slice(2);
await $`changeset publish ${extraArgs}`;
