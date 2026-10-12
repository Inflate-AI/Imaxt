# Tasks

## 1. mdx: GFM support

- [x] 1.1 Add `mdast-util-gfm` + `micromark-extension-gfm` to
  `packages/mdx/package.json`
- [x] 1.2 Write failing tests for GFM table and task-list round-trip
  (compile a document containing them, parse it back, assert
  deep-equal), then wire the extensions into `from-mdx.ts`'s
  `PARSE_OPTIONS` and `to-mdx.ts`'s `blocksToMdx` until they pass -
  verify with `bun test packages/mdx`

## 2. core: Embed block

- [x] 2.1 Write failing tests for `renderEmbed` per the spec
  scenarios (renders a link not an iframe; caption renders when
  given), then implement `packages/core/src/embed.ts` - verify with
  `bun test packages/core`
- [x] 2.2 Add `.imx-embed` styling to `packages/core/src/styles.css`,
  following `Banner`'s section as the template

## 3. editorjs: EmbedTool

- [x] 3.1 Write failing tests for `EmbedTool` (`packages/editorjs/src/embed.ts`),
  following `banner.ts`/`banner.test.ts` as the template (one text
  input for `url`, one for `caption`, no tone picker), then implement -
  verify with `bun test packages/editorjs`
- [x] 3.2 Register `embed: EmbedTool` in `packages/editorjs/src/index.ts`'s
  `imaxtTools`

## 4. astro: Embed component

- [x] 4.1 Add `packages/astro/src/Embed.astro` (following `Banner.astro`),
  wire into the `imaxt` convenience export, extend the `test-site`
  fixture - verify with `bun test packages/astro`

## 5. mdx: Embed compiler mapping + single-node exports

- [x] 5.1 Add the `Embed` `Block` union member and its `to-mdx.ts`/
  `from-mdx.ts` JSX mapping (`<Embed url="..." caption="..." />`),
  extend `SAMPLE_BLOCKS`/`COMPONENT_NAME` in `compiler.test.ts` -
  verify with `bun test packages/mdx`
- [x] 5.2 Export `blockToMdastNode`/`mdastNodeToBlock` (generalized
  from the existing private `blockToNode`/`elementToBlock`) and
  `MdxJsxElement` from `packages/mdx/src/index.ts`; write a failing
  test converting one block with no document wrapper, then make it
  pass - verify with `bun test packages/mdx`

## 6. docs + changeset

- [x] 6.1 Add `docs/blocks/embed.md`, update the table in
  `docs/blocks/README.md`
- [x] 6.2 Add a minor changeset for `packages/mdx`, `packages/core`,
  `packages/editorjs`, `packages/astro`
