# @inflate-ai/imaxt-mdx

Bidirectional compiler between [Imaxt](https://github.com/Inflate-AI/Imaxt)
EditorJS block JSON and MDX source.

## Install

```sh
bun add @inflate-ai/imaxt-mdx
```

## Usage

```ts
import { blocksToMdx, mdxToBlocks } from '@inflate-ai/imaxt-mdx';

// EditorJS's save() output -> .mdx source
const mdx = blocksToMdx({ frontmatter: { title: '...' }, blocks: editorData.blocks });

// an existing .mdx post -> EditorJS block data
const { frontmatter, blocks } = mdxToBlocks(existingPostSource);
```

Content this compiler doesn't recognize (plain prose, non-Imaxt JSX) comes
back as a `{ type: 'markdown', source }` block instead of being dropped, so
a hand-written post round-trips losslessly. See
[`docs/getting-started.md`](https://github.com/Inflate-AI/Imaxt/blob/main/docs/getting-started.md)
for a fuller example.

## License

MIT
