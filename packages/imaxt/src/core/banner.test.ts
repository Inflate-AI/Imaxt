import { describe, expect, test } from 'bun:test';
import { renderBanner } from './banner.ts';

describe('renderBanner', () => {
  test('text is present as real text content', () => {
    const html = renderBanner({ text: 'Launching soon' });
    expect(html).toContain('Launching soon');
  });
});
