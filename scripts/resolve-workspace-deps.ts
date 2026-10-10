#!/usr/bin/env bun
// Rewrites `workspace:*` / `workspace:^` / `workspace:~` dependency ranges to
// the referenced package's real current version before `npm publish` packs
// package.json. changesets' publish command only does this substitution for
// pnpm and yarn (whose own publish commands do it natively); for npm - which
// is what changesets falls back to for a Bun workspace - it does nothing, so
// without this step a published package would carry the literal string
// "workspace:*" as a dependency, which no consumer outside this monorepo can
// resolve. Run `git checkout -- packages/*/package.json` afterward to revert.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const packagesDir = join(import.meta.dirname, '..', 'packages');
const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(packagesDir, entry.name, 'package.json'));

const versionsByName = new Map<string, string>();
for (const path of packages) {
  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  versionsByName.set(pkg.name, pkg.version);
}

for (const path of packages) {
  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const deps = pkg[field];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== 'string' || !range.startsWith('workspace:')) continue;
      const version = versionsByName.get(name);
      if (!version)
        throw new Error(`No local version found for workspace dependency "${name}" in ${path}`);
      const protocolRange = range.slice('workspace:'.length);
      const resolved =
        protocolRange === '*'
          ? version
          : protocolRange === '^' || protocolRange === '~'
            ? `${protocolRange}${version}`
            : protocolRange;
      deps[name] = resolved;
      changed = true;
      console.log(`${pkg.name}: ${name} ${range} -> ${resolved}`);
    }
  }
  if (changed) writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
}
