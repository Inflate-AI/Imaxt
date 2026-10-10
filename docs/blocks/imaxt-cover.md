# ImaxtCover

A typographic post cover — a giant word, number, quote, or stacked
title — built from type, not an image.

## Data shape

```ts
interface ImaxtCoverTypographicData {
  kind: 'word' | 'stat' | 'quote' | 'stack';
  text: string;
  sub?: string;
}

interface ImaxtCoverData {
  cover?: ImaxtCoverTypographicData; // omit to fall back to a stacked cover built from `title`
  title: string;
  tone?: string;
  caption?: string;
  ratio?: string; // CSS aspect-ratio, e.g. "16 / 9"; default: "16 / 9"
}
```

## EditorJS

**Not registered as a tool.** This is post-level data (the article's
cover), not a block that lives in the body - it has no toolbox entry and
can't be inserted into the editor canvas. A builder app should surface it
as a post-settings field instead, and the [MDX compiler](../../packages/mdx)
reads/writes it from frontmatter's `cover` key.

## Astro / MDX

```astro
---
import { ImaxtCover } from '@inflate-ai/imaxt-astro';
---
<ImaxtCover title={post.data.title} cover={post.data.cover} tone="mint" ratio="4 / 3" />
```

In frontmatter:

```yaml
cover:
  kind: stack
  text: "One API for every vector"
```

## Notes

- With no `cover` given, falls back to a `stack`-kind cover built from
  the post's `title` (a short phrase, word-wrapped into up to three
  lines).
