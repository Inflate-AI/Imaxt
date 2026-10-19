import { describe, expect, test } from 'bun:test';
import { renderChangelog } from './changelog.ts';

describe('renderChangelog', () => {
  test('entries render in given order', () => {
    const html = renderChangelog({
      entries: [
        { version: '0.2.0', items: ['Added X'] },
        { version: '0.1.0', items: ['Initial release'] },
      ],
    });
    expect(html.indexOf('0.2.0')).toBeLessThan(html.indexOf('0.1.0'));
  });

  test('renders date and items', () => {
    const html = renderChangelog({
      entries: [{ version: '0.2.0', date: '2026-10-11', items: ['Added X', 'Fixed Y'] }],
    });
    expect(html).toContain('2026-10-11');
    expect(html).toContain('Added X');
    expect(html).toContain('Fixed Y');
  });
});
