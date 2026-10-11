import { describe, expect, test } from 'bun:test';
import { renderFootnote } from './footnote.ts';

describe('renderFootnote', () => {
  test('works with no client-side JavaScript via native disclosure', () => {
    const html = renderFootnote({ html: 'A citation.' });
    expect(html).toContain('<details');
    expect(html).toContain('<summary');
    expect(html).toContain('A citation.');
  });

  test('defaults marker to *', () => {
    const html = renderFootnote({ html: 'x' });
    expect(html).toContain('>*<');
  });

  test('uses a given marker', () => {
    const html = renderFootnote({ html: 'x', marker: '1' });
    expect(html).toContain('>1<');
  });
});
