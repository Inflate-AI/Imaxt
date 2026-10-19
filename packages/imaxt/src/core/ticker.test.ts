import { describe, expect, test } from 'bun:test';
import { attachTicker, renderTicker } from './ticker.ts';

describe('renderTicker', () => {
  test('every phrase is present as text', () => {
    const html = renderTicker({ phrases: ['Embed', 'Filter', 'Rank'] });
    expect(html).toContain('Embed');
    expect(html).toContain('Filter');
    expect(html).toContain('Rank');
  });
});

describe('attachTicker', () => {
  test('cycles the active phrase over time', () => {
    document.body.innerHTML = renderTicker({ phrases: ['Embed', 'Filter', 'Rank'], seconds: 1 });
    attachTicker(document);
    const root = document.querySelector<HTMLElement>('.imx-ticker')!;
    const items = root.querySelectorAll('.imx-ticker-i');
    expect(items[0]?.getAttribute('data-active')).toBe('true');
  });

  test('does nothing under reduced motion (every phrase stays visible)', () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as never;

    document.body.innerHTML = renderTicker({ phrases: ['Embed', 'Filter'] });
    attachTicker(document);
    const root = document.querySelector<HTMLElement>('.imx-ticker')!;
    expect(root.dataset.js).toBeUndefined();

    globalThis.matchMedia = originalMatchMedia;
  });
});
