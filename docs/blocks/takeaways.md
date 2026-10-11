# Takeaways

A short "key points" box - a static list of strings with an optional
title.

## Data shape

```ts
interface TakeawaysData {
  items: string[];
  title?: string;
}
```

## EditorJS

`TakeawaysTool` manages a repeatable list of plain-text rows plus an
optional title field.

## Astro / MDX

```mdx
<Takeaways title="Key takeaways" items={[
  "Chunking strategy matters more than embedding model choice",
  "Hybrid search beats pure vector search for most corpora",
]} />
```
