# Imaxt

Typographic article blocks — no images, no icons, just type doing the work of figures.
Built once as a framework-agnostic rendering engine, then exposed as EditorJS tools for
visual authoring and as Astro components for static sites, with a compiler that moves
content between EditorJS's JSON and plain MDX.

## Packages

| Package | What it is |
| --- | --- |
| [`@inflate-ai/imaxt-core`](./packages/core) | Framework-agnostic render functions, design tokens/CSS and vanilla-JS interactivity for every block. The single source of truth the other packages build on. |
| [`@inflate-ai/imaxt-editorjs`](./packages/editorjs) | [EditorJS](https://editorjs.io) Block Tools for every block, for visual article authoring. |
| [`@inflate-ai/imaxt-mdx`](./packages/mdx) | Bidirectional compiler between EditorJS block JSON and MDX source. |
| [`@inflate-ai/imaxt-astro`](./packages/astro) | Thin [Astro](https://astro.build) components for sites that author content directly in `.mdx`. |

## Blocks

Statement, Stat/StatRow, PullQuote, Compare/Side, Steps/Step, Timeline/Event, Bars,
Sidenote, CodeWalk, Marquee, Heatmap, CurvedText, Scrolly/Beat, TypeLab, and the
typographic post cover (ImaxtCover).

## Development

This is a [Bun](https://bun.sh) workspace.

```sh
bun install
bun test        # run all package tests
bun run build   # build all packages
bun run lint    # biome
bun run typecheck
```

Each package has its own `README.md` with usage details. Development follows an
[OpenSpec](https://github.com/Fission-AI/OpenSpec) spec-driven workflow — see `openspec/`
for active and archived change proposals — and TDD: tests are written before the
implementation they cover.

## License

MIT, see [LICENSE](./LICENSE).
