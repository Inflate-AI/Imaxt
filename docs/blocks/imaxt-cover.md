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

## Render

```ts
import { renderImaxtCover } from '@inflate-ai/imaxt/core';

renderImaxtCover({ title: 'One API for every vector', tone: 'mint' });
```

## Notes

- With no `cover` given, falls back to a `stack`-kind cover built from
  the post's `title` (a short phrase, word-wrapped into up to three
  lines).
