# @inflate-ai/imaxt

Imaxt provides typographic article blocks and a native React editor. The
editor reads and writes standard Markdown/GFM plus Imaxt's established MDX
block syntax.

## Install

```sh
npm install @inflate-ai/imaxt react react-dom
```

`react` and `react-dom` are optional when using only the framework-neutral
block renderers.

## Render blocks

Import the shared stylesheet once, then render block HTML with the `core`
entry point:

```ts
import '@inflate-ai/imaxt/styles.css';
import { renderStatement } from '@inflate-ai/imaxt/core';

const html = renderStatement({
  html: 'Boring is <em>dependable</em>.',
  tone: 'mint',
});
```

The renderers are framework-neutral. Your host application is responsible for
mounting returned HTML and calling an `attach*` helper for blocks that need
client-side behavior.

## Use the editor

```tsx
import '@inflate-ai/imaxt/styles.css';
import '@inflate-ai/imaxt/editor.css';
import { ImaxtEditor } from '@inflate-ai/imaxt/editor';

export function ArticleEditor() {
  return <ImaxtEditor initialValue="# New article" onChange={save} />;
}

function save(source: string) {
  localStorage.setItem('article', source);
}
```

`initialValue` and `onChange` use Markdown/MDX strings. The editor's Lexical
state and parser are private implementation details, not persistence APIs.

## Entry points

- `@inflate-ai/imaxt/core`: block data types, renderers, and hydration helpers.
- `@inflate-ai/imaxt/editor`: React editor and image adapter API.
- `@inflate-ai/imaxt/styles.css`: block styles.
- `@inflate-ai/imaxt/editor.css`: editor styles.

Imaxt does not provide framework adapters. For Astro MDX, map the component
syntax to local Astro components that call the functions in
`@inflate-ai/imaxt/core`.

## License

MIT
