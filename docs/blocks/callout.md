# Callout

A severity-leveled aside, distinguished by a text label rather than an
icon, per Imaxt's typography-only visual language.

## Data shape

```ts
type CalloutKind = 'note' | 'warning' | 'danger' | 'tip';

interface CalloutData {
  kind?: CalloutKind;   // default: note
  title?: string;
  html: string;
}
```

## EditorJS

`CalloutTool` is a simple field-based tool: a kind selector, an optional
title, and a rich-text body, like `Sidenote`.

## Astro / MDX

```mdx
<Callout kind="warning" title="Before you deploy">
  Rotate the API key first.
</Callout>
```
