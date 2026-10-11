import { describe, expect, test } from 'bun:test';
import { renderStamp } from './stamp.ts';

describe('renderStamp', () => {
  test('text is present as real text content', () => {
    const html = renderStamp({ text: 'DRAFT' });
    expect(html).toContain('DRAFT');
  });

  test('uses a given angle', () => {
    const html = renderStamp({ text: 'DRAFT', angle: 12 });
    expect(html).toContain('--a:12deg');
  });
});
