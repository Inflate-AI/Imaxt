# @inflate-ai/imaxt-core

[![npm version](https://img.shields.io/npm/v/@inflate-ai/imaxt-core.svg)](https://www.npmjs.com/package/@inflate-ai/imaxt-core)

Framework-agnostic render functions, design tokens, and vanilla-JS
interactivity for every [Imaxt](https://github.com/Inflate-AI/Imaxt) block.
The single source of truth [`@inflate-ai/imaxt-editorjs`](https://www.npmjs.com/package/@inflate-ai/imaxt-editorjs)
and [`@inflate-ai/imaxt-astro`](https://www.npmjs.com/package/@inflate-ai/imaxt-astro)
build on — most consumers want one of those two, not this package directly.

## Install

```sh
bun add @inflate-ai/imaxt-core
```

## Usage

```ts
import { renderStatement } from '@inflate-ai/imaxt-core';

renderStatement({ html: 'Boring is <em>dependable</em>.', tone: 'mint' });
// -> '<div class="imx"><div class="imx-statement imx-slab" data-tone="mint" ...>...'
```

```css
/* once per page/app */
@import '@inflate-ai/imaxt-core/styles.css';
```

Every block's render function is documented in the
[block reference](https://github.com/Inflate-AI/Imaxt/blob/main/docs/blocks/README.md).

## License

MIT
