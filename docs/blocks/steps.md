# Steps / Step

An ordered sequence, numbered in document order.

## Data shape

```ts
interface StepData {
  title: string;
  html: string; // this step's body (plain, <strong>, <em>, <br>)
}

interface StepsData {
  items: StepData[];
}
```

## EditorJS

`StepsTool` is composite: one tool manages a repeatable list of Step
entries (title + body), with add/remove controls. There is no separate
`StepTool`.

## Astro / MDX

```mdx
<Steps>
  <Step title="Chunk">Split each document into pieces.</Step>
  <Step title="Embed">Turn every chunk into a vector.</Step>
  <Step title="Write">Store it under a stable id.</Step>
</Steps>
```
