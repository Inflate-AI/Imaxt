# @inflate-ai/imaxt-editorjs

[![npm version](https://img.shields.io/npm/v/@inflate-ai/imaxt-editorjs.svg)](https://www.npmjs.com/package/@inflate-ai/imaxt-editorjs)

[EditorJS](https://editorjs.io) Block Tools for every
[Imaxt](https://github.com/Inflate-AI/Imaxt) block — visual authoring for
typographic article blocks, no images.

## Install

```sh
bun add @inflate-ai/imaxt-editorjs @editorjs/editorjs
```

## Usage

```ts
import EditorJS from '@editorjs/editorjs';
import { imaxtTools } from '@inflate-ai/imaxt-editorjs';

const editor = new EditorJS({
  holder: 'editor',
  tools: imaxtTools, // every block tool, keyed by name - or pass a subset
});
```

`ImaxtCover` is not included here — it's post-level data (the article's
cover), not a body block. See the
[block reference](https://github.com/Inflate-AI/Imaxt/blob/main/docs/blocks/README.md)
for every tool's saved-data shape, and
[`@inflate-ai/imaxt-mdx`](https://www.npmjs.com/package/@inflate-ai/imaxt-mdx)
for turning `editor.save()`'s output into MDX.

## License

MIT
