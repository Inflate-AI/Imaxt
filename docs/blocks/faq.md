# Faq

A question/answer list that reveals each answer via native
`<details>`/`<summary>` - no client-side JavaScript required.

## Data shape

```ts
interface FaqItem {
  q: string;
  a: string;
}

interface FaqData {
  items: FaqItem[];
}
```

## EditorJS

`FaqTool` manages a repeatable list of question/answer rows, following
the same pattern as `BarsTool`.

## Astro / MDX

```mdx
<Faq items={[
  { q: "Is this free?", a: "Yes, under the MIT license." },
  { q: "Does it need a build step?", a: "No - it's plain HTML and CSS." },
]} />
```
