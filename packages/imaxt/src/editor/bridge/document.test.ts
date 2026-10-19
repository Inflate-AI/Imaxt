import { describe, expect, test } from 'bun:test';
import { createHeadlessEditor } from '@lexical/headless';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { gfm } from 'micromark-extension-gfm';
import { mdxjs } from 'micromark-extension-mdxjs';
import { createDefaultBlock } from '../blocks/block-defaults.ts';
import { EDITOR_NODES } from '../nodes/index.ts';
import { parseDocumentIntoEditor, serializeEditorToDocument } from './document.ts';
import { imaxtBlockToMdastNode, mdastNodeToImaxtBlock } from './mdx.ts';

function newEditor() {
  return createHeadlessEditor({
    namespace: 'test',
    nodes: EDITOR_NODES,
    onError: (e) => {
      throw e;
    },
  });
}

function roundTrip(source: string) {
  const editor = newEditor();
  parseDocumentIntoEditor(editor, source);
  return serializeEditorToDocument(editor).trimEnd();
}

function roundTripBlockThroughMdx(block: ReturnType<typeof createDefaultBlock>) {
  const source = toMarkdown(
    { type: 'root', children: [imaxtBlockToMdastNode(block)] } as never,
    { extensions: [mdxToMarkdown(), gfmToMarkdown()] } as never,
  );
  const tree = fromMarkdown(roundTrip(source), {
    extensions: [mdxjs(), gfm()],
    mdastExtensions: [mdxFromMarkdown(), gfmFromMarkdown()],
  }) as unknown as { children: unknown[] };
  return mdastNodeToImaxtBlock(tree.children[0]);
}

describe('Markdown/MDX document bridge', () => {
  test('round-trips standard Markdown and GFM structures', () => {
    const source = [
      '# Report',
      '',
      'A **bold**, *italic*, `inline` [link](https://example.com).',
      '',
      '> Quoted text.',
      '',
      '- [x] Done',
      '- [ ] Pending',
      '',
      '| A | B |',
      '| --- | --- |',
      '| 1 | 2 |',
      '',
      '```ts',
      'const answer = 42;',
      '```',
    ].join('\n');
    const result = roundTrip(source);
    expect(result).toContain('# Report');
    expect(result).toContain('[x] Done');
    expect(result).toContain('const answer = 42;');
    expect(result).toMatch(/\|\s*-+\s*\|\s*-+\s*\|/);
  });

  test('round-trips every custom block type through the private MDX codec', () => {
    const types = [
      'statement',
      'pull-quote',
      'sidenote',
      'bars',
      'ranked',
      'matrix',
      'delta',
      'gauge',
      'scorecard',
      'sparkline',
      'funnel',
      'callout',
      'faq',
      'takeaways',
      'footnote',
      'glossary',
      'versus',
      'checklist',
      'terminal',
      'diff',
      'file-tree',
      'error-box',
      'changelog',
      'formula',
      'ticker',
      'drop-cap',
      'redacted',
      'stamp',
      'banner',
      'marquee',
      'heatmap',
      'mermaid',
      'curved-text',
      'type-lab',
      'stat-row',
      'compare',
      'steps',
      'timeline',
      'scrolly',
      'code-walk',
      'embed',
    ] as const;
    for (const type of types) {
      const block = createDefaultBlock(type);
      expect(mdastNodeToImaxtBlock(imaxtBlockToMdastNode(block))).toEqual(block);
      expect(roundTripBlockThroughMdx(block)).toEqual(block);
    }
  });

  test('keeps custom MDX blocks positioned with surrounding Markdown', () => {
    const source = [
      'Before the block.',
      '',
      '<Statement tone="mint">',
      '  Boring is *dependable*.',
      '</Statement>',
      '',
      'After the block.',
    ].join('\n');
    const result = roundTrip(source);
    expect(result).toContain('<Statement tone="mint">');
    expect(result).toContain('Before the block.');
    expect(result).toContain('After the block.');
  });
});
