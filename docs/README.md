# Imaxt documentation

Imaxt is a set of typographic article blocks, built once as a framework-agnostic
rendering engine with a native React editor. The editor stores Markdown/GFM and
Imaxt's established MDX block syntax.

## Start here

- **[Getting started](./getting-started.md)** — install the package and use the
  renderers or React editor.
- **[Architecture](./architecture.md)** — the public package entry points and
  the editor's Markdown/MDX contract.
- **[Publishing](./publishing.md)** — the release process, for maintainers.

## Blocks

- **[Block reference](./blocks/README.md)** — every block and its data shape.

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
