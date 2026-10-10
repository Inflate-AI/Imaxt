# TypeLab

An interactive variable-font playground: adjust weight/width/optical-size
and other axes live, then copy the resulting CSS.

## Data shape

```ts
type FamilyKey = 'archivo' | 'fraunces' | 'source-serif';

interface TypeLabData {
  sample?: string;   // default: "Typography is the interface"
  family?: FamilyKey; // default: 'fraunces'
}
```

Only the three families (and their actual variable-font axes) `imaxt-core`
ships are offered — this isn't a generic font picker.

## EditorJS

`TypeLabTool` wraps `imaxt-core`'s `renderTypeLab`/`attachTypeLab`
directly, so the same interactive playground runs inside the editor
canvas.

## Astro / MDX

```mdx
<TypeLab sample="Same letters, different voice" />
```

## Notes

- Ported from a React island in the original design to vanilla
  TypeScript in `imaxt-core`, specifically so it needs no framework
  runtime in either the EditorJS canvas or an Astro page.
- In Astro, it renders a static shell immediately and defers attaching
  its interactivity until the component scrolls into view
  (`IntersectionObserver`), not on initial page load.
