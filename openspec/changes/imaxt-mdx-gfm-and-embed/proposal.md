# Proposal

## Why

A planned new consumer of this repo - a standalone, MDX-native rich
editor (`@inflate-ai/imaxt-editor`, scoped and built as its own,
separate change) - surfaced two real gaps in `imaxt-mdx`'s current MDX
pipeline while being designed against it, both independently worth
fixing now, for every existing consumer, not just the new one:

1. `from-mdx.ts`/`to-mdx.ts` parse and serialize with only the
   `mdxjs`/`frontmatter` micromark extensions loaded - no GFM. A GFM
   table or a GFM task-list checkbox written by hand, or produced by
   `blocksToMdx`'s own `markdown` passthrough, parses back as a single
   plain paragraph: the table's structure and a checklist's checked
   state are silently lost on the next `mdxToBlocks` call. This is a
   real, already-reachable round-trip bug, not a hypothetical one.
2. There is no representation at all for embedded external content
   (a linked video, a tweet, etc.) - no `Block` variant, no block, no
   render function. Anyone who wants to reference such a thing today
   has nothing to reach for.

## What Changes

- Add `mdast-util-gfm` + `micromark-extension-gfm` to `imaxt-mdx`'s
  parse (`from-mdx.ts`) and serialize (`to-mdx.ts`) option objects, so
  GFM tables, task-list items (including checked state), and
  strikethrough round-trip losslessly through the `markdown`
  passthrough block.
- Add one new block, `Embed`, across all four packages per this repo's
  normal "adding a block" process (`docs/blocks/README.md`): a styled
  link card to an external URL with an optional caption - **not** an
  `<iframe>` or other live embed, matching this ecosystem's one
  stated consumer's own content policy (saranmahadev/blog's
  `ARTICLE_GUIDE.md`: "no iframes, embeds or social widgets - link out
  instead"). This gives embedded references the same durable,
  lossless MDX round-trip every other block already has.
- Export generalized single-node converters, `mdastNodeToBlock` and
  `blockToMdastNode`, from `imaxt-mdx`'s public `index.ts` -
  generalizations of the existing private `elementToBlock`/
  `blockToNode` functions in `from-mdx.ts`/`to-mdx.ts` to operate on
  one node instead of a whole document. Needed so a future
  node-by-node consumer (a live editor converting one block at a
  time) doesn't have to re-derive this repo's own JSX-attribute
  encoding.

## Capabilities

### Modified Capabilities

- `mdx-compilation`: GFM constructs now round-trip losslessly through
  the `markdown` passthrough (extends the existing "unrecognized
  content is preserved" guarantee to cover GFM specifically); adds the
  single-node conversion functions to the package's public contract.
- `block-render-engine`: one new block requirement added (`Embed`).
- `astro-components`: `Embed`'s Astro component follows the existing
  blanket "every block has a matching component" requirement - no
  requirement-text change, just one more block it covers.

## Impact

- **Packages touched**: `packages/mdx` (new dependencies, new public
  exports), `packages/core` (new block), `packages/editorjs` (new
  tool), `packages/astro` (new component).
- **Dependencies**: `mdast-util-gfm`, `micromark-extension-gfm` added
  to `packages/mdx`.
- **Versioning**: minor release for all four packages via changeset.
- **Explicitly not in scope**: no changes to `packages/editorjs`
  beyond the one new `EmbedTool` (that package is not getting further
  investment beyond keeping its own spec's invariants true); no new
  editor package (a separate, later change).
