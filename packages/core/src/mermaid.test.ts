import { describe, expect, test } from 'bun:test';
import { attachMermaid, renderMermaid } from './mermaid.ts';

describe('renderMermaid', () => {
  test('embeds the diagram source as hidden, escaped text (not evaluated as HTML)', () => {
    const html = renderMermaid({ source: 'graph TD;\n  A-->B;' });
    expect(html).toContain('graph TD;');
    expect(html).toContain('imx-mermaid-source');
    expect(html).toContain('hidden');
  });

  test('caption is present as text content when given', () => {
    const html = renderMermaid({ source: 'graph TD;\n  A-->B;', caption: 'A simple flow' });
    expect(html).toContain('A simple flow');
  });

  test('shows a loading state before the client renders the SVG', () => {
    const html = renderMermaid({ source: 'graph TD;\n  A-->B;' });
    expect(html).toContain('imx-mermaid-canvas');
    expect(html).toContain('aria-busy="true"');
  });
});

describe('attachMermaid', () => {
  test('is a no-op (and disposes cleanly) when nothing matches', () => {
    document.body.innerHTML = '<p>no diagrams here</p>';
    const dispose = attachMermaid(document);
    expect(() => dispose()).not.toThrow();
  });
});
