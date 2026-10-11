---
"@inflate-ai/imaxt-core": patch
"@inflate-ai/imaxt-astro": patch
---

`ImaxtCover` now accepts an optional `style` string, appended after the `aspect-ratio` declaration on its root element - a generic escape hatch for a consumer that needs to tweak layout (e.g. a box-shadow or margin) without wrapping the component in an extra element.
