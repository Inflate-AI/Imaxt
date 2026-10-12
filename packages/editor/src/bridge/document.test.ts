import { describe, expect, test } from 'bun:test';
import { createHeadlessEditor } from '@lexical/headless';
import { EDITOR_NODES } from '../nodes/index.ts';
import { parseDocumentIntoEditor, serializeEditorToDocument } from './document.ts';

function newEditor() {
  return createHeadlessEditor({
    namespace: 'test',
    nodes: EDITOR_NODES,
    onError: (e) => {
      throw e;
    },
  });
}

function roundTrip(source: string): string {
  const editor = newEditor();
  parseDocumentIntoEditor(editor, source);
  // toMarkdown always emits a trailing newline; that's formatting, not data.
  return serializeEditorToDocument(editor).trimEnd();
}

describe('document bridge: plain Markdown', () => {
  test('a heading, bold/italic/code/link prose, and a blockquote round-trip', () => {
    const source = [
      '# Chunking strategies',
      '',
      "A good pipeline keeps **retrieval** boring: chunk once, embed once, and *never* mutate a chunk's `id` after it ships. See [the RAG survey](https://example.com/rag) for the taxonomy.",
      '',
      '> Boring is dependable.',
    ].join('\n');
    expect(roundTrip(source)).toBe(source);
  });

  test('a GFM table round-trips structurally', () => {
    const source = [
      '| Strategy | Recall | Notes |',
      '| --- | --- | --- |',
      '| Fixed-size | Medium | Simplest, worst at boundaries |',
      '| Semantic | High | Costs an extra embedding pass |',
    ].join('\n');
    const result = roundTrip(source);
    expect(result).toContain('Fixed-size');
    expect(result).toContain('Semantic');
    expect(result).toMatch(/\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|/);
  });

  test('a GFM task list round-trips its checked state', () => {
    const source = ['- [x] Chunk every document', '- [ ] Re-embed on content change'].join('\n');
    expect(roundTrip(source)).toBe(source);
  });

  test('a fenced code block round-trips its exact text', () => {
    const source = ['```js', 'const id = 1;', 'await upsert(id);', '```'].join('\n');
    expect(roundTrip(source)).toBe(source);
  });

  test('a bulleted list with nested formatting round-trips', () => {
    const source = ['- First item', '- Second **item**'].join('\n');
    expect(roundTrip(source)).toBe(source);
  });

  test('an image on its own line round-trips', () => {
    const source = '![a diagram](https://example.com/diagram.png)';
    expect(roundTrip(source)).toBe(source);
  });
});

describe('document bridge: Imaxt blocks', () => {
  test('an Imaxt block round-trips with zero conversion, alongside plain prose', () => {
    // Multi-line ("flow") JSX authoring, the same form blockToMdastNode's
    // own serializer always produces - so this is the form any document
    // the editor itself writes will actually reparse. A Statement's `html`
    // field round-trips through native Markdown emphasis (`*text*`), the
    // same as imaxt-mdx's own compiler tests - not literal `<em>` JSX tags,
    // which its html-field parser doesn't treat as an inline mark.
    const source = [
      'Some plain prose before the block.',
      '',
      '<Statement tone="mint" align="center">',
      '  Boring is *dependable*.',
      '</Statement>',
      '',
      'And prose after it.',
    ].join('\n');
    expect(roundTrip(source)).toBe(source);
  });

  test('a table, a checklist, and an Imaxt block share one document losslessly', () => {
    const source = [
      '# Report',
      '',
      '| A | B |',
      '| --- | --- |',
      '| 1 | 2 |',
      '',
      '- [x] Done',
      '- [ ] Pending',
      '',
      '<Callout kind="tip" title="Heads up">',
      '  Worth knowing.',
      '</Callout>',
    ].join('\n');
    const result = roundTrip(source);
    expect(result).toContain('<Callout');
    expect(result).toContain('Worth knowing.');
    expect(result).toMatch(/\|\s*-+\s*\|\s*-+\s*\|/);
    expect(result).toContain('[x] Done');
  });
});
