# Compare / Side

Exactly two sides, side by side on wide viewports and stacked on narrow
ones — before/after, or option A against option B.

## Data shape

```ts
interface SideData {
  html: string;               // this side's body (plain, <strong>, <em>, <br>)
  label?: string;
  kind?: 'before' | 'after';   // default: 'after'. 'before' has no slab/tone by default.
  tone?: string;                // explicit tone overrides the kind-based default
}

interface CompareData {
  sides: [SideData, SideData]; // always exactly two
  wide?: boolean;
}
```

## EditorJS

`CompareTool` is composite but fixed-count: it always manages exactly two
Side entries and offers no add/remove control. There is no separate
`SideTool`.

## Astro / MDX

```mdx
<Compare>
  <Side kind="before" label="Before">Three pipelines, three sets of bugs</Side>
  <Side label="After">One small API, one set of bugs</Side>
</Compare>
```

## Notes

- `kind="after"` defaults to the `accent` tone (a filled slab); `kind="before"`
  defaults to no tone (a dashed outline) unless you set one explicitly.
