# Proposal

## Why

Imaxt's 19 typographic article blocks currently exist only as Astro components
hand-copied into one blog (`saranmahadev/blog`), authored by hand-typing MDX. They
cannot be reused by any other site, and there is no way to author them visually
(e.g. from an EditorJS-based builder) without hand-writing JSX-like MDX syntax from
memory. Extracting them into a standalone, publishable package set - with a shared
rendering engine, EditorJS tools for visual authoring, and a compiler that moves
content between EditorJS JSON and MDX - makes Imaxt reusable, visually authorable,
and keeps the existing MDX-based site pipeline untouched.

## What Changes

- Add a framework-agnostic rendering engine (`@inflate-ai/imaxt-core`) that is the
  single source of truth for every block's markup, CSS design tokens, and
  client-side interactive behavior (count-up, scroll-linked beats, step highlight,
  spin, a vanilla-TS font-playground replacing the original React island).
- Add EditorJS Block Tools (`@inflate-ai/imaxt-editorjs`) for every block, so
  articles can be authored visually. Blocks that nest children in MDX (e.g.
  `StatRow`>`Stat`, `Timeline`>`Event`) become one composite tool with a
  repeatable internal sub-item editor, since EditorJS has no stable nested-block
  API.
- Add a bidirectional compiler (`@inflate-ai/imaxt-mdx`) that turns EditorJS block
  JSON into MDX source matching the blog's existing component syntax
  (`blocksToMdx`), and parses that MDX back into block JSON (`mdxToBlocks`), so
  content keeps round-tripping between a visual builder and git-diffable `.mdx`
  files without changing how any Astro site consumes its content collection.
- Add thin Astro components (`@inflate-ai/imaxt-astro`) that wrap the core engine,
  so a site can keep authoring blocks directly in `.mdx` without EditorJS at all.
- Publish all four packages publicly under the `@inflate-ai` npm scope with an MIT
  license, from a public Bun-workspace monorepo at `Inflate-AI/Imaxt`.
- Out of scope for this change: wiring any of this into `saranmahadev/blog` itself,
  and any new blocks beyond the 19 that exist today plus the typographic post
  cover (`ImaxtCover`).

## Capabilities

### New Capabilities

- `block-render-engine`: the framework-agnostic contract for how each Imaxt block
  renders to HTML, which design tokens it accepts, and how its client-side
  interactivity behaves (motion-reduction, count-up, etc). Owned by
  `packages/core`.
- `editorjs-authoring`: how each Imaxt block behaves as an EditorJS Block Tool -
  its toolbox entry, editable fields, live preview, saved data shape, and
  validation. Owned by `packages/editorjs`.
- `mdx-compilation`: the bidirectional mapping between an Imaxt block's EditorJS
  JSON data and its MDX source representation, including frontmatter (the
  `ImaxtCover` post cover) and round-trip fidelity. Owned by `packages/mdx`.
- `astro-components`: the public Astro component surface (props, slots, the
  `imaxt` convenience import map) that exposes `block-render-engine` to
  `.astro`/`.mdx` content. Owned by `packages/astro`.

### Modified Capabilities

(none - this is a greenfield repo)

## Impact

- **New repo content**: everything under `packages/core`, `packages/editorjs`,
  `packages/mdx`, `packages/astro` in `Inflate-AI/Imaxt` (this repo). No other
  repository is touched by this change.
- **Dependencies**: `@editorjs/editorjs` (peer, editorjs package),
  `mdast-util-from-markdown`/`mdast-util-to-markdown`/`mdast-util-mdx`/
  `mdast-util-frontmatter`/`micromark-extension-mdxjs`/
  `micromark-extension-frontmatter`/`yaml` (mdx package), `astro` (peer, astro
  package). All pinned to current latest stable versions (see
  `openspec/config.yaml` context for the one documented exception).
- **Publishing**: four new public npm packages under the `@inflate-ai` scope.
  Actually running `npm publish` requires an authenticated npm account/org this
  change does not have access to - the deliverable is packages that are
  publish-ready (correct `package.json` metadata, build output, `publishConfig`),
  not a live npm release.
