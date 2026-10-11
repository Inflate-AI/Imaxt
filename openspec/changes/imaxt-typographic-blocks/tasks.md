# Tasks

## 1. core: Ticker, DropCap, Redacted, Stamp, Banner

- [x] 1.1 Write failing tests for all five `render*` functions (plus
  `attachTicker`) per the spec scenarios above, then implement until
  tests pass - verify with `bun test packages/core`

## 2. editorjs: tools for all five blocks

- [x] 2.1 Write failing tests for all five EditorJS tools, then implement -
  verify with `bun test packages/editorjs`

## 3. astro: components for all five blocks

- [x] 3.1 Add Astro components, wire into `imaxt` convenience export,
  extend `test-site` fixture - verify with `bun test packages/astro`

## 4. mdx: compiler mappings for all five blocks

- [x] 4.1 Add `to-mdx.ts`/`from-mdx.ts` mappings and `Block` union members,
  extend `SAMPLE_BLOCKS`/`COMPONENT_NAME` in `compiler.test.ts` - verify
  with `bun test packages/mdx`

## 5. docs + changeset

- [x] 5.1 Add one docs page per block under `docs/blocks/`, update the
  table in `docs/blocks/README.md`
- [x] 5.2 Add a minor changeset for all four packages
