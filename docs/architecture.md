# Architecture

Four packages, one per capability, each owning exactly one job. The full
rationale (including alternatives considered) lives in
[`openspec/changes/imaxt-v1/design.md`](../openspec/changes/imaxt-v1/design.md);
this page is the shorter, public-facing version.

```
                     ┌──────────────────────┐
                     │ @inflate-ai/imaxt-core│
                     │  render*(data): string│
                     │  attach*(el): dispose │
                     │  design tokens (CSS)  │
                     └───────────┬───────────┘
                                 │ used by
                 ┌───────────────┼───────────────┐
                 │                               │
     ┌───────────▼───────────┐       ┌───────────▼───────────┐
     │ @inflate-ai/           │       │ @inflate-ai/           │
     │   imaxt-editorjs       │       │   imaxt-astro           │
     │  EditorJS Block Tools  │       │  .astro components     │
     └───────────┬───────────┘       └───────────┬───────────┘
                 │ save() JSON                    │ .mdx source
                 │                                 │
                 └───────────────┬─────────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │ @inflate-ai/imaxt-mdx  │
                     │  blocksToMdx           │
                     │  mdxToBlocks           │
                     └────────────────────────┘
```

## `imaxt-core` — the single source of truth

Every block's HTML output, CSS, and client-side interactivity (count-up,
scroll-linked beats, code-walk line highlighting, the TypeLab font
playground) lives here as plain functions: `render*(data): string` and,
where a block needs it, `attach*(root): () => void` (returns a cleanup
function). No framework, no DOM assumptions beyond what the browser itself
provides, zero runtime dependencies.

Both `imaxt-editorjs`'s live preview and `imaxt-astro`'s final output call
these same functions, so the editing canvas and the published page can
never visually drift apart from each other.

## `imaxt-editorjs` — visual authoring

One [Block Tool](https://editorjs.io/creating-a-block-tool/) class per
block. A block that nests children in MDX (`StatRow`, `Compare`, `Steps`,
`Timeline`, `Scrolly`, `CodeWalk`) is a single tool managing its own
repeatable list of children internally — EditorJS has no stable
nested-block API, so this avoids relying on one. `ImaxtCover` is
deliberately **not** registered here: it's post-level data (the article's
cover), not a block in the body.

## `imaxt-astro` — static-site authoring

Thin `.astro` wrappers. Standalone blocks call the matching `imaxt-core`
render function directly; composite parents (`StatRow`, `Compare`, `Steps`,
`Timeline`, `Scrolly`) stay native Astro components using `<slot />`, so
nesting children works exactly the way Astro slots already work — no
special data shape required on this side.

## `imaxt-mdx` — the compiler between the two

`blocksToMdx` turns EditorJS's saved JSON into the MDX source `imaxt-astro`
(or any hand-written post) already expects. `mdxToBlocks` parses that MDX
back into the same JSON, so a visual builder can load an existing post for
editing. Built directly on `mdast-util-from-markdown`/`mdast-util-to-markdown`
with MDX and frontmatter as syntax extensions — no `unified` pipeline,
since there's exactly one parse step and one stringify step. Content this
compiler doesn't recognize (plain prose, non-Imaxt JSX) is preserved
verbatim as a generic block rather than dropped.

## Why four packages instead of one

`imaxt-editorjs` and `imaxt-astro` have mutually exclusive peer
dependencies and runtimes — one is a browser-only Block Tool, the other
only exists at Astro's build time. Folding both into one package would
force every consumer to install both dependency trees regardless of which
one they actually use.
