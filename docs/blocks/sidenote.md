# Sidenote

A labelled aside, visually distinguished from the surrounding body text.

## Data shape

```ts
interface SidenoteData {
  html: string;    // the note's body (plain, <strong>, <em>, <br>)
  label?: string;   // default: "Note"
}
```

## Render

```ts
import { renderSidenote } from '@inflate-ai/imaxt/core';

renderSidenote({ html: 'Numbers here are placeholders.', label: 'Mock data' });
```
