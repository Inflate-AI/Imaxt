# Getting started

Pick the package(s) you need — you don't need all four unless you're
building both a visual editor and the site that renders its output.

## Install

```sh
# the render engine - a dependency of the other three, install it alongside them
bun add @inflate-ai/imaxt-core

# pick what you actually need:
bun add @inflate-ai/imaxt-editorjs @editorjs/editorjs   # a visual builder
bun add @inflate-ai/imaxt-mdx                           # EditorJS JSON <-> MDX
bun add @inflate-ai/imaxt-astro astro                   # an Astro site authoring .mdx directly
```

(`npm install`/`pnpm add` work the same way - these are ordinary npm
packages regardless of what built them.)

## Astro: author blocks directly in `.mdx`

```astro
---
import { imaxt } from '@inflate-ai/imaxt-astro';
import '@inflate-ai/imaxt-astro/styles.css';
---

<Content components={imaxt} />
```

Now any `.mdx` post under that content collection can use every block with
no per-file imports:

```mdx
<Statement tone="mint">Every retrieval project rebuilds the **same plumbing**.</Statement>

<StatRow>
  <Stat value="5" unit="ms" label="p95 query time" tone="mint" />
  <Stat value="10×" label="fewer calls" tone="sky" />
</StatRow>
```

See the [block reference](./blocks/README.md) for every block's full prop
list.

## EditorJS: a visual builder

```ts
import EditorJS from '@editorjs/editorjs';
import { imaxtTools } from '@inflate-ai/imaxt-editorjs';

const editor = new EditorJS({
  holder: 'editor',
  tools: imaxtTools, // every Imaxt block tool, keyed by name
});
```

Pass a subset instead of all of `imaxtTools` if you only want some blocks
available in the toolbox.

## MDX compiler: move content between the builder and `.mdx` files

```ts
import { blocksToMdx, mdxToBlocks } from '@inflate-ai/imaxt-mdx';

// On "Publish": EditorJS's save() output -> .mdx source
const mdx = blocksToMdx({
  frontmatter: { title: 'One API for every vector' },
  blocks: editorData.blocks, // from editor.save()
});

// On "Edit": an existing .mdx post -> EditorJS block data
const { frontmatter, blocks } = mdxToBlocks(existingPostSource);
```

`mdxToBlocks` never drops content it doesn't recognize — plain prose or
non-Imaxt JSX comes back as a `{ type: 'markdown', source }` block, so a
hand-written post round-trips without losing anything.

## Core: the render engine directly

Most consumers don't need this package directly — `imaxt-editorjs` and
`imaxt-astro` already depend on it and use it internally. Reach for it
yourself only if you're building a third consumer (a different framework's
component wrapper, a server-side preview renderer, etc.):

```ts
import { renderStatement } from '@inflate-ai/imaxt-core';

renderStatement({ html: 'Boring is <em>dependable</em>.', tone: 'mint' });
// -> '<div class="imx"><div class="imx-statement imx-slab" data-tone="mint" ...>...'
```
