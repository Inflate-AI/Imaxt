# Design

## Zero-JS disclosure via native `<details>`

`Faq` and `Footnote` both need a reveal/collapse interaction. Rather than
add another `attach*` client behavior, both render a native
`<details>`/`<summary>` pair, which the browser handles with no JavaScript
at all - a stronger version of the "no client JS" precedent `Callout`/
`Takeaways`/`Glossary`/`Checklist`/`Versus` already follow by being fully
static.

## Footnote is a self-contained reference, not a document-wide list

EditorJS Block Tools are block-level units; there is no supported way for
a tool to inject an inline marker into a sibling paragraph's running text,
and no document-wide counter a pure render function could use (render
functions are stateless per the existing architecture). So `Footnote`
renders as one self-contained unit - a small marker plus its definition in
a native disclosure - placed in the flow where the author wants the
annotation, rather than a numbered-list-at-the-bottom-of-the-post pattern.
The author supplies their own `marker` (defaulting to `*`) rather than it
being computed from document position.

## Versus vs. Compare

`Compare` is composite: each `Side` is a full nested Astro/MDX child
carrying arbitrary rich content. `Versus` is deliberately lighter -  a
single data object with two `{ label, html }` entries, no children, no
EditorJS sub-item slots - for the common case of framing two short named
things against each other (e.g. "Postgres vs. SQLite") without the
overhead of a composite tool. Both coexist; an author picks based on how
much content each side needs.

## Data shapes

```ts
type CalloutKind = 'note' | 'warning' | 'danger' | 'tip';
interface CalloutData { kind?: CalloutKind; title?: string; html: string }

interface FaqItem { q: string; a: string }
interface FaqData { items: FaqItem[] }

interface TakeawaysData { items: string[]; title?: string }

interface FootnoteData { marker?: string; html: string }

interface GlossaryItem { term: string; definition: string }
interface GlossaryData { items: GlossaryItem[] }

interface VersusSide { label: string; html: string }
interface VersusData { sides: [VersusSide, VersusSide]; vsLabel?: string; tone?: string }

interface ChecklistItem { text: string; done?: boolean }
interface ChecklistData { items: ChecklistItem[]; title?: string }
```

## Rendering notes

- **Callout**: `kind` defaults to `note`; each kind renders a distinct
  typographic label (no icons, per Imaxt's typography-only visual
  language) - "Note"/"Warning"/"Danger"/"Tip".
- **Checklist**: each item's done/not-done state renders as a distinct
  glyph character (`✓`/`□`) that is itself real text, not a
  color-only signal.
- **Versus**: reuses the existing `.imx-vs` "VS" marker visual language
  from `Compare`'s CSS, under its own `.imx-versus` class so the two
  blocks can evolve independently.
