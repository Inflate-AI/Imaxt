# Tasks

## 1. core: add katex dependency, Formula

- [x] 1.1 Add `katex` (dependency) and `@types/katex` (devDependency) to
  `packages/core/package.json`
- [x] 1.2 Write failing tests for `renderFormula` per the spec scenarios
  above, then implement until tests pass - verify with
  `bun test packages/core`
- [x] 1.3 Add KaTeX's stylesheet `@import` to `packages/core/src/styles.css`

## 2. editorjs: FormulaTool

- [x] 2.1 Write failing tests for `FormulaTool`, then implement - verify
  with `bun test packages/editorjs`

## 3. astro: Formula component

- [x] 3.1 Add `Formula` Astro component, wire into `imaxt` convenience
  export, extend `test-site` fixture - verify with `bun test packages/astro`

## 4. mdx: compiler mapping

- [x] 4.1 Add `to-mdx.ts`/`from-mdx.ts` mapping and `Block` union member,
  extend `SAMPLE_BLOCKS`/`COMPONENT_NAME` in `compiler.test.ts` - verify
  with `bun test packages/mdx`

## 5. docs + changeset

- [x] 5.1 Add a docs page under `docs/blocks/`, update the table in
  `docs/blocks/README.md`
- [x] 5.2 Add a minor changeset for all four packages
