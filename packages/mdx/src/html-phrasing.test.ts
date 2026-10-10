import { describe, expect, test } from 'bun:test';
import type { PhrasingContent } from 'mdast';
import { htmlToPhrasing, phrasingToHtml } from './html-phrasing.ts';

describe('htmlToPhrasing', () => {
  test('parses plain text', () => {
    expect(htmlToPhrasing('hello world')).toEqual([{ type: 'text', value: 'hello world' }]);
  });

  test('parses strong/b and em/i as nested phrasing content', () => {
    expect(htmlToPhrasing('a <strong>bold</strong> b')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'strong', children: [{ type: 'text', value: 'bold' }] },
      { type: 'text', value: ' b' },
    ]);
    expect(htmlToPhrasing('<b>x</b><i>y</i><em>z</em>')).toEqual([
      { type: 'strong', children: [{ type: 'text', value: 'x' }] },
      { type: 'emphasis', children: [{ type: 'text', value: 'y' }] },
      { type: 'emphasis', children: [{ type: 'text', value: 'z' }] },
    ]);
  });

  test('parses <br> as a break', () => {
    expect(htmlToPhrasing('a<br>b')).toEqual([
      { type: 'text', value: 'a' },
      { type: 'break' },
      { type: 'text', value: 'b' },
    ]);
  });

  test('decodes basic HTML entities in text', () => {
    expect(htmlToPhrasing('a &amp; b &lt;c&gt;')).toEqual([{ type: 'text', value: 'a & b <c>' }]);
  });
});

describe('phrasingToHtml', () => {
  test('round-trips every construct htmlToPhrasing supports', () => {
    const samples = [
      'hello world',
      'a <strong>bold</strong> b',
      '<b>x</b><i>y</i><em>z</em>',
      'a<br>b',
    ];
    for (const html of samples) {
      expect(phrasingToHtml(htmlToPhrasing(html) as PhrasingContent[])).toBe(
        html
          .replace(/<b>/g, '<strong>')
          .replace(/<\/b>/g, '</strong>')
          .replace(/<i>/g, '<em>')
          .replace(/<\/i>/g, '</em>'),
      );
    }
  });

  test('escapes HTML-significant characters in text nodes', () => {
    expect(phrasingToHtml([{ type: 'text', value: 'a < b & c' }])).toBe('a &lt; b &amp; c');
  });
});
