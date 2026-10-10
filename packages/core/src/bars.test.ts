import { describe, expect, test } from 'bun:test';
import { renderBars } from './bars.ts';

describe('renderBars', () => {
  test('every value and label is present as text', () => {
    const html = renderBars({
      items: [
        { label: 'Model A', value: 72 },
        { label: 'Model B', value: 81 },
      ],
      unit: '%',
    });
    expect(html).toContain('Model A');
    expect(html).toContain('72%');
    expect(html).toContain('Model B');
    expect(html).toContain('81%');
  });

  test('bar width is proportional to max', () => {
    const html = renderBars({ items: [{ label: 'a', value: 50 }], max: 100 });
    expect(html).toContain('--w:50%');
  });

  test('bar width defaults max to the largest item value', () => {
    const html = renderBars({
      items: [
        { label: 'a', value: 20 },
        { label: 'b', value: 40 },
      ],
    });
    expect(html).toContain('--w:100%');
    expect(html).toContain('--w:50%');
  });

  test('clamps width between 2% and 100%', () => {
    const html = renderBars({ items: [{ label: 'a', value: 0 }], max: 10 });
    expect(html).toContain('--w:2%');
  });
});
