# Imaxt documentation

Imaxt is a set of typographic article blocks — no images, no icons, just type
doing the work of figures — built once as a framework-agnostic rendering
engine and exposed as [EditorJS](https://editorjs.io) tools, [Astro](https://astro.build)
components, and an MDX compiler that moves content between them.

## Start here

- **[Getting started](./getting-started.md)** — install each package, see a
  minimal example for EditorJS, Astro, and the MDX compiler.
- **[Architecture](./architecture.md)** — the four packages, how they relate,
  and why they're split the way they are.
- **[Publishing](./publishing.md)** — the release process, for maintainers.

## Blocks

- **[Block reference](./blocks/README.md)** — every block: its data shape,
  how to use it from EditorJS, and how to use it from Astro/MDX.

This is the part meant to grow. Adding a new block means adding one page
under `docs/blocks/` and one row in its index — nothing else here needs to
change.

## Project docs

- [`CONTRIBUTING.md`](../CONTRIBUTING.md) — development setup, the TDD/OpenSpec
  workflow this repo follows, and how to propose a change.
- [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md)
- [`SECURITY.md`](../SECURITY.md) — how to report a vulnerability.
- [`openspec/`](../openspec/) — the spec-driven change history: every
  capability's requirements, and the proposal/design/tasks behind every
  past and in-flight change.
