# Getting started

Imaxt publishes one package.

```sh
bun add @inflate-ai/imaxt react react-dom
```

## Render a block

```ts
import '@inflate-ai/imaxt/styles.css';
import { renderStatement } from '@inflate-ai/imaxt/core';

const html = renderStatement({
  html: 'Boring is <em>dependable</em>.',
  tone: 'mint',
});
```

The renderers are framework-neutral. A host framework owns how that HTML is
mounted and how it calls any matching `attach*` hydration helper.

## Use the editor

```tsx
import '@inflate-ai/imaxt/styles.css';
import '@inflate-ai/imaxt/editor.css';
import { ImaxtEditor } from '@inflate-ai/imaxt/editor';
export function ArticleEditor() {
  return <ImaxtEditor initialValue="# New article" onChange={persist} />;
}

function persist(source: string) {
  localStorage.setItem('article', source);
}
```

The editor reads and writes standard Markdown/GFM plus Imaxt's strict MDX block
syntax, such as `<Statement tone="mint">...</Statement>`. Its parser and
serializer are private editor implementation details, not a public compiler API.
