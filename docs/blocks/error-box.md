# ErrorBox

A styled exception/stack display, with an optional preformatted stack
trace that preserves whitespace.

## Data shape

```ts
interface ErrorBoxData {
  title: string;
  message: string;
  stack?: string;
}
```

## EditorJS

`ErrorBoxTool` is a simple field-based tool: title, message, and an
optional stack-trace textarea.

## Astro / MDX

```mdx
<ErrorBox
  title="TypeError"
  message='Cannot read property "id" of undefined'
  stack={"    at getUser (api.ts:42:11)\n    at handler (routes.ts:8:3)"}
/>
```
