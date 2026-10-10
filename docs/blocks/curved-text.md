# CurvedText

Text on an arc, a wave, or a ring — still real, selectable text, never an
image.

## Data shape

```ts
interface CurvedTextData {
  text: string;
  shape?: 'arc' | 'wave' | 'circle'; // default: 'arc'
  mark?: string;                      // a short glyph in the middle of a circle
  tone?: string;                       // mint | lilac | sky | rose | accent | ink
  spin?: boolean;                      // circle only; off under reduced motion
  decorative?: boolean;                // excludes it from the accessibility tree
}
```

## EditorJS

`CurvedTextTool` — text input, a shape select, a mark input, spin/decorative
checkboxes, plus a tone picker.

## Astro / MDX

```mdx
<CurvedText text="Drag the sliders" shape="arc" />
<CurvedText text="Drafted" shape="circle" mark="D" tone="mint" spin decorative />
```

## Notes

- `decorative` sets `aria-hidden` and drops the `role="img"`/`aria-label`
  pair — use it when the text repeats nearby content rather than adding
  new information.
