# @inflate-ai/imaxt-astro

## 0.1.4

### Patch Changes

- Updated dependencies [9c2e811]
  - @inflate-ai/imaxt-core@0.1.4

## 0.1.3

### Patch Changes

- a599cab: `CodeWalk` now accepts pre-rendered code markup - a `html` field on `CodeWalkData`, or (in `@inflate-ai/imaxt-astro`) a default slot - used in place of the plain-text rendering of `code`. `code` stays required: it's still the canonical, editable value for `@inflate-ai/imaxt-editorjs`. This lets an Astro/MDX consumer pass syntax-highlighted markup (e.g. from Astro's own `<Code>`) while `attachCodeWalk`'s line-dimming still works unchanged, since it only looks for `.line` elements regardless of their origin.
- Updated dependencies [a599cab]
- Updated dependencies [eb4b07a]
  - @inflate-ai/imaxt-core@0.1.3

## 0.1.2

### Patch Changes

- abf5cc9: `ImaxtCover` now accepts an optional `style` string, appended after the `aspect-ratio` declaration on its root element - a generic escape hatch for a consumer that needs to tweak layout (e.g. a box-shadow or margin) without wrapping the component in an extra element.
- Updated dependencies [abf5cc9]
  - @inflate-ai/imaxt-core@0.1.2

## 0.1.1

### Patch Changes

- ae34a00: Add a live npm version badge to each package's README, and verify the automated Trusted Publishing release pipeline end to end.
- Updated dependencies [ae34a00]
  - @inflate-ai/imaxt-core@0.1.1
