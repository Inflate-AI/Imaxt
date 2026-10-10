#!/usr/bin/env bun
// Orchestrates a release: build, resolve `workspace:*` ranges to real
// versions (see resolve-workspace-deps.ts for why that's needed), publish,
// then always restore the working tree - even if publish fails partway -
// so `workspace:*` stays intact for local development and the next
// `changeset version` run.
import { $ } from 'bun';

await $`bun run build`;
await $`bun ${import.meta.dirname}/resolve-workspace-deps.ts`;

const extraArgs = process.argv.slice(2);
let exitCode = 0;
try {
  await $`changeset publish ${extraArgs}`;
} catch (error) {
  exitCode =
    error != null && typeof error === 'object' && 'exitCode' in error
      ? Number((error as { exitCode: number }).exitCode)
      : 1;
} finally {
  await $`git checkout -- packages/*/package.json`;
}
process.exit(exitCode);
