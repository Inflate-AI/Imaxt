# Statement

A short sentence at poster scale. Bold text gets a marker-style highlight;
italic text gets an expressive italic face.

## Data shape

```ts
interface StatementData {
  html: string;              // rich text: plain text, <strong>, <em>, <br>
  tone?: string;              // mint | lilac | sky | rose | accent | ink | white (default: ink)
  align?: 'left' | 'center';  // default: left
  wide?: boolean;
  bleed?: boolean;
}
```

## Render

```ts
import { renderStatement } from '@inflate-ai/imaxt/core';

renderStatement({ html: 'Boring is <em>dependable</em>.', tone: 'mint' });
```

## Notes

- Scroll-driven entrance animation (`animation-timeline: view()`) only
  applies where the browser supports it, and never under
  `prefers-reduced-motion: reduce`.
