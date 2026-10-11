# @inflate-ai/imaxt-core

## 0.1.4

### Patch Changes

- 9c2e811: `TypeLab`'s sliders and sample-text input now have `id`/`for` associations between each control and its `<label>`, restoring what the original React island did with `useId()`. The server-rendered version had dropped this (axe-core flagged it as a critical "form elements must have labels" violation during the blog integration). The id is derived deterministically from the sample text, so `renderTypeLab` stays a pure function.

## 0.1.3

### Patch Changes

- a599cab: `CodeWalk` now accepts pre-rendered code markup - a `html` field on `CodeWalkData`, or (in `@inflate-ai/imaxt-astro`) a default slot - used in place of the plain-text rendering of `code`. `code` stays required: it's still the canonical, editable value for `@inflate-ai/imaxt-editorjs`. This lets an Astro/MDX consumer pass syntax-highlighted markup (e.g. from Astro's own `<Code>`) while `attachCodeWalk`'s line-dimming still works unchanged, since it only looks for `.line` elements regardless of their origin.
- eb4b07a: Restore the `white` tone, dropped from the exported `TONES`/`Tone` type during the original extraction even though its `[data-tone="white"]` CSS rule was carried over - `resolveTone('white')` was silently falling back to `'ink'`.

## 0.1.2

### Patch Changes

- abf5cc9: `ImaxtCover` now accepts an optional `style` string, appended after the `aspect-ratio` declaration on its root element - a generic escape hatch for a consumer that needs to tweak layout (e.g. a box-shadow or margin) without wrapping the component in an extra element.

## 0.1.1

### Patch Changes

- ae34a00: Add a live npm version badge to each package's README, and verify the automated Trusted Publishing release pipeline end to end.
