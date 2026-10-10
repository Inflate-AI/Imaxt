# Imaxt

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Built with Bun](https://img.shields.io/badge/built%20with-Bun-f472b6)](https://bun.sh)

Typographic article blocks — no images, no icons, just type doing the work
of figures. Built once as a framework-agnostic rendering engine, then
exposed as [EditorJS](https://editorjs.io) tools for visual authoring and
as [Astro](https://astro.build) components for static sites, with a
compiler that moves content between EditorJS's JSON and plain MDX.

## Packages

| Package | What it is |
| --- | --- |
| [`@inflate-ai/imaxt-core`](./packages/core) | Framework-agnostic render functions, design tokens/CSS and vanilla-JS interactivity for every block. The single source of truth the other packages build on. |
| [`@inflate-ai/imaxt-editorjs`](./packages/editorjs) | EditorJS Block Tools for every block, for visual article authoring. |
| [`@inflate-ai/imaxt-mdx`](./packages/mdx) | Bidirectional compiler between EditorJS block JSON and MDX source. |
| [`@inflate-ai/imaxt-astro`](./packages/astro) | Thin Astro components for sites that author content directly in `.mdx`. |

```sh
bun add @inflate-ai/imaxt-core                           # the render engine
bun add @inflate-ai/imaxt-editorjs @editorjs/editorjs    # a visual builder
bun add @inflate-ai/imaxt-mdx                            # EditorJS JSON <-> MDX
bun add @inflate-ai/imaxt-astro astro                    # an Astro site authoring .mdx
```

See **[docs/getting-started.md](./docs/getting-started.md)** for a working
example of each.

## Blocks

Statement, Stat/StatRow, PullQuote, Compare/Side, Steps/Step, Timeline/Event,
Bars, Sidenote, CodeWalk, Marquee, Heatmap, CurvedText, Scrolly/Beat, TypeLab,
and the typographic post cover (ImaxtCover) — every one documented, with its
data shape and usage from both EditorJS and Astro/MDX, in the
**[block reference](./docs/blocks/README.md)**.

## Documentation

- **[docs/getting-started.md](./docs/getting-started.md)** — install and a
  minimal example per package.
- **[docs/architecture.md](./docs/architecture.md)** — why four packages,
  and how they relate.
- **[docs/blocks/](./docs/blocks/README.md)** — every block's reference
  page. This is the part designed to grow: a new block is one new file, not
  an edit to a growing document.
- **[docs/publishing.md](./docs/publishing.md)** — the release process, for
  maintainers.

## Development

This is a [Bun](https://bun.sh) workspace.

```sh
bun install
bun test        # run all package tests
bun run build   # build all packages
bun run lint    # biome
bun run typecheck
```

Development follows an [OpenSpec](https://github.com/Fission-AI/OpenSpec)
spec-driven workflow (see `openspec/` for active and archived changes) and
TDD: tests are written before the implementation they cover. See
**[CONTRIBUTING.md](./CONTRIBUTING.md)** before opening a PR.

## Community

- [ROADMAP.md](./ROADMAP.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [SECURITY.md](./SECURITY.md)

## License

MIT, see [LICENSE](./LICENSE).
