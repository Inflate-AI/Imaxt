# Diff

A line-level comparison computed from plain `before`/`after` text - the
author writes both versions, the block computes the diff.

## Data shape

```ts
interface DiffData {
  before: string;
  after: string;
  lang?: string;
}
```

## EditorJS

`DiffTool` is a simple field-based tool: before/after textareas and an
optional language field.

## Astro / MDX

```mdx
<Diff
  lang="ts"
  before={"const timeout = 1000;"}
  after={"const timeout = 5000;"}
/>
```
