# Changelog

A version-by-version list, rendered in the given array order (the
author controls ordering - the block does not re-sort by version).

## Data shape

```ts
interface ChangelogEntry {
  version: string;
  date?: string;
  items: string[];
}

interface ChangelogData {
  entries: ChangelogEntry[];
}
```

## EditorJS

`ChangelogTool` manages a repeatable list of version entries, each with
a version, an optional date, and a newline-separated items textarea.

## Astro / MDX

```mdx
<Changelog entries={[
  { version: "0.2.0", date: "2026-10-11", items: ["Added data blocks"] },
  { version: "0.1.0", date: "2026-10-01", items: ["Initial release"] },
]} />
```
