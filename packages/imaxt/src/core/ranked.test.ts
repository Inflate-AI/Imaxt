import { describe, expect, test } from 'bun:test';
import { renderRanked } from './ranked.ts';

describe('renderRanked', () => {
  test('rank position follows array order', () => {
    const html = renderRanked({
      items: [{ label: 'Model A' }, { label: 'Model B' }, { label: 'Model C' }],
    });
    expect(html.indexOf('Model A')).toBeLessThan(html.indexOf('Model B'));
    expect(html.indexOf('Model B')).toBeLessThan(html.indexOf('Model C'));
  });

  test('numeric delta is readable as text, not color-only', () => {
    const html = renderRanked({ items: [{ label: 'Model A', delta: 3 }] });
    expect(html).toContain('3');
  });

  test('"new" delta renders a new indicator', () => {
    const html = renderRanked({ items: [{ label: 'Model A', delta: 'new' }] });
    expect(html.toLowerCase()).toContain('new');
  });

  test('value and unit render as text', () => {
    const html = renderRanked({ items: [{ label: 'Model A', value: '92' }], unit: '%' });
    expect(html).toContain('92');
    expect(html).toContain('%');
  });
});
