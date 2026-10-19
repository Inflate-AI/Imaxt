# Imaxt

Imaxt is one package for typographic article blocks and a native React editor.
The editor persists the established Imaxt Markdown/MDX component format.

## Install

```sh
bun add @inflate-ai/imaxt
```

Import the framework-neutral block renderers from `@inflate-ai/imaxt/core` and
the React editor from `@inflate-ai/imaxt/editor`.

```tsx
import '@inflate-ai/imaxt/styles.css';
import '@inflate-ai/imaxt/editor.css';
import { ImaxtEditor } from '@inflate-ai/imaxt/editor';
<ImaxtEditor onChange={(next) => save(next)} />;
```

`ImaxtEditor` accepts `initialValue` and calls `onChange` with Markdown/MDX
strings. The editor's Lexical state and MDX codec are implementation details;
they are not public persistence APIs.

## API

- `@inflate-ai/imaxt/core`: block data types, `render*` functions, styles, and
  hydration helpers.
- `@inflate-ai/imaxt/editor`: `ImaxtEditor` and the image adapter API.
- `@inflate-ai/imaxt/styles.css`: block styles.
- `@inflate-ai/imaxt/editor.css`: editor styles.

See [docs/getting-started.md](./docs/getting-started.md) and
[docs/architecture.md](./docs/architecture.md) for the public contract.

## Development

```sh
bun install
bun test
bun run build
bun run lint
bun run typecheck
```

## License

MIT, see [LICENSE](./LICENSE).
