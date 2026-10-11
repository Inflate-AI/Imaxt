# Roadmap

Imaxt is young - this says where it's headed, not where it has to go.
Priorities shift with real usage and contributions; treat the grouping
below as sequencing, not a release schedule with dates or version
numbers attached. Have an opinion on any of it? Open a discussion or an
issue.

## Shipped

- Four packages: `imaxt-core` (the render engine), `imaxt-editorjs`
  (visual authoring), `imaxt-mdx` (JSON ↔ MDX compiler), `imaxt-astro`
  (static-site components)
- **40 typographic blocks** plus the post cover, each documented with
  its data shape from both EditorJS and Astro/MDX - the v1.0.0 release
  locks this as the stable API surface going forward
- Published to npm under `@inflate-ai`, releasing via [Trusted
  Publishing](https://docs.npmjs.com/trusted-publishers/) (OIDC) - no
  long-lived registry token, triggered by merging a Changesets version
  PR
- **Proven in production**: migrated `saranmahadev/blog`'s posts onto
  the published packages, including fixing four real upstream bugs
  (tone coverage, a label-association accessibility violation, and two
  slot/style-passthrough gaps) surfaced by that migration

## Now

- **A demo site.** A small Astro site, built with Imaxt itself, that
  renders every block with real content - doubles as living
  documentation and a visual baseline.
- **Visual regression coverage.** Screenshot every block (EditorJS
  canvas and Astro render) with Playwright, so a CSS change can't
  silently break a block the unit tests don't reach.
- **An accessibility pass.** Several blocks already carry ARIA roles and
  respect `prefers-reduced-motion` ad hoc; audit all of them against
  WCAG 2.1 AA deliberately, not incidentally.

## Next

- **A second framework adapter.** `imaxt-core`'s render functions are
  already framework-agnostic - a thin React (Next.js) wrapper is the
  natural second consumer, and the real test of whether the
  core/adapter split holds up outside Astro.
- **A formal theming contract.** The CSS custom properties in
  `imaxt-core`'s stylesheet are today's de facto API; document and
  stabilize them as a real theming surface, then ship a second built-in
  theme to prove it isn't shaped around one site.
- **EditorJS authoring polish.** Keyboard shortcuts, drag-to-reorder,
  and a consistent inline toolbar across the blocks that currently roll
  their own editing UI.
- **MDX compiler hardening.** Expand round-trip fidelity tests against
  hand-written (not just generated) MDX, and decide how the compiler
  should behave when it meets content it didn't write - unknown
  components, non-Imaxt JSX.

## Later

- **A plugin/registry model for new blocks**, so a block can be authored
  and published independently of this monorepo instead of requiring a
  PR here.
- **CMS adapters** - structured-content integrations (Sanity, Keystatic,
  Contentful) that map onto the same EditorJS JSON shape `imaxt-mdx`
  already compiles.
- **i18n and RTL.** Several blocks (Marquee, CurvedText, Scrolly) make
  layout assumptions that haven't been tested right-to-left.
- **A second or third published theme**, once the theming contract above
  has a track record.

## How blocks get added

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-a-block) and
[docs/blocks/README.md](./docs/blocks/README.md#adding-a-new-block) -
every new block goes through an OpenSpec change like the rest of this
codebase.
