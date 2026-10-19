import { describe, expect, test } from 'bun:test';
import { renderSidenote } from './sidenote.ts';

describe('renderSidenote', () => {
  test('defaults the label to "Note"', () => {
    const html = renderSidenote({ html: 'Numbers are placeholders.' });
    expect(html).toContain('>Note<');
    expect(html).toContain('Numbers are placeholders.');
  });

  test('uses a given label, escaped', () => {
    const html = renderSidenote({ html: 'x', label: 'Mock <data>' });
    expect(html).toContain('Mock &lt;data&gt;');
  });
});
