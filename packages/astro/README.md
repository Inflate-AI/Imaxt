# @inflate-ai/imaxt-astro

[![npm version](https://img.shields.io/npm/v/@inflate-ai/imaxt-astro.svg)](https://www.npmjs.com/package/@inflate-ai/imaxt-astro)

[Astro](https://astro.build) components for every
[Imaxt](https://github.com/Inflate-AI/Imaxt) block — for sites that author
content directly in `.mdx`.

## Install

```sh
bun add @inflate-ai/imaxt-astro astro
```

## Usage

```astro
---
import { imaxt } from '@inflate-ai/imaxt-astro';
import '@inflate-ai/imaxt-astro/styles.css';
---

<Content components={imaxt} />
```

Now any `.mdx` post in that content collection can use every block with no
per-file imports:

```mdx
<Statement tone="mint">Every retrieval project rebuilds the **same plumbing**.</Statement>
```

Or import components individually: `import { Statement } from '@inflate-ai/imaxt-astro'`.
See the [block reference](https://github.com/Inflate-AI/Imaxt/blob/main/docs/blocks/README.md)
for every component's props.

## License

MIT
