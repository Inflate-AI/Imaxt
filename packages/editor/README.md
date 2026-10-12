# @inflate-ai/imaxt-editor

A Medium-style Markdown/MDX editor built on [Lexical](https://lexical.dev),
whose native document model **is** Markdown/MDX - full standard Markdown
(headings, lists, tables, checklists, quotes, code, links, images) as a
first-class, standalone capability, with Imaxt's typographic blocks
(`Statement`, `Callout`, `Matrix`, ...) inserted through the same `/` menu,
on the same document, with zero conversion step.

Try it: [live demo](https://inflate-ai.github.io/Imaxt/).

## Install

```sh
bun add @inflate-ai/imaxt-editor
```

`react`/`react-dom` 18 or 19 are peer dependencies.

## Usage

```tsx
import '@inflate-ai/imaxt-core/styles.css'; // Imaxt block rendering
import '@inflate-ai/imaxt-editor/styles.css'; // editor chrome
import { ImaxtEditor } from '@inflate-ai/imaxt-editor';

function Page() {
  return (
    <ImaxtEditor
      initialValue="# Hello\n\nStart writing."
      onChange={(markdown) => console.log(markdown)}
    />
  );
}
```

The editor is **uncontrolled** after mount: `initialValue` loads once, and
from then on the editor owns its own document (the same way a native
`<textarea defaultValue>` works). Read `onChange` to persist the current
MDX/Markdown source; there is no `value` prop to push content back in - to
load different content, remount the component (e.g. with a different
`key`).

## Theming

The editor's chrome (toolbar, slash menu, placeholders, block borders)
reads its colors and fonts from the exact same CSS custom properties
`@inflate-ai/imaxt-core` and Blog's own `tokens.css` already use:
`--paper`, `--paper2`, `--card`, `--text`, `--muted`, `--line`, `--hair`,
`--accent`, `--accent-lt`, `--on-accent`, `--font-sans`, `--font-serif`,
`--font-mono`, `--font-display`.

That means it matches whatever theme is already loaded on the page with
**zero configuration** - load Blog's `tokens.css` (or `imaxt-core`'s own
defaults) and the editor matches automatically.

To configure it explicitly, pass a `theme` object - each field maps to one
of the CSS variables above:

```tsx
<ImaxtEditor
  theme={{
    paper: '#f6f3ea',
    accent: '#0f7b4d',
    onAccent: '#ffffff',
    fontDisplay: "'Archivo Variable', sans-serif",
    // ...any subset of the token list
  }}
  colorScheme="dark" // or "light"; omit to follow the page/OS
/>
```

`colorScheme` is written as `data-theme` on the editor's root element -
the same attribute Blog's own `:root[data-theme='dark']` mechanism reads,
so it composes with a host page's existing dark-mode toggle rather than
fighting it.

See `packages/editor-demo` for a full example switching between two
different theme presets and light/dark.

## Images

Image handling is intentionally storage-agnostic: the editor has no
opinion on *where* an uploaded file ends up. It depends on a small
interface:

```ts
interface ImageStorageAdapter {
  upload(file: File): Promise<{ ref: string; previewUrl: string }>;
  resolve(ref: string): string | Promise<string>;
}
```

`upload()` only needs to return something **immediately renderable**
(`previewUrl`) plus a stable `ref` to persist in the document - any slower
"real" upload (to a server, a bucket, wherever) can keep running after
`upload()` returns; the editor just needs `resolve()` to reflect the
final result the next time it's called for that `ref`.

The default (used when no `imageAdapter` prop is given) is a trivial
in-memory adapter: inserted images become local object URLs, nothing
leaves the browser. Pass your own to add a real backend:

```ts
import type { ImageStorageAdapter } from '@inflate-ai/imaxt-editor';

const cache = new Map<string, { previewUrl: string; resolvedUrl?: string }>();

const backendAdapter: ImageStorageAdapter = {
  async upload(file) {
    const ref = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file); // shows instantly
    cache.set(ref, { previewUrl });

    // Runs in the background - the image is already visible via previewUrl.
    uploadToMyBackend(file).then((resolvedUrl) => {
      cache.set(ref, { previewUrl, resolvedUrl });
    });

    return { ref, previewUrl };
  },
  resolve(ref) {
    const entry = cache.get(ref);
    return entry?.resolvedUrl ?? entry?.previewUrl ?? ref;
  },
};
```

```tsx
<ImaxtEditor imageAdapter={backendAdapter} />
```

## Imaxt blocks

Every Imaxt block type is reachable from the `/` menu. Most are editable
through a generic, config-driven form (see `blocks/block-config.ts`);
`Matrix`, `Heatmap`, and `FileTree` have their own dedicated editing UI,
matching `imaxt-editorjs`'s own split between its ~34 mechanical tools and
its three tools with real custom logic.

## What's out of scope here

Wiring this into Prox (replacing its Editor.js-based draft editor) and
wiring it into Blog (a web-based authoring surface) are each their own,
separate integration - this package makes no assumption about either.
