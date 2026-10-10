import { describe, expect, test } from 'bun:test';
import { attachScrolly, renderBeat, renderScrolly } from './scrolly.ts';

const BEATS = [
  { stage: 'Chunk', sub: 'step 1', html: 'Split each document.' },
  { stage: 'Embed', sub: 'step 2', html: 'Turn every chunk into a vector.' },
];

describe('renderBeat', () => {
  test('renders its own stage and sub label inline with its content', () => {
    const html = renderBeat(BEATS[0]!);
    expect(html).toContain('Chunk');
    expect(html).toContain('step 1');
    expect(html).toContain('Split each document.');
  });
});

describe('renderScrolly', () => {
  test('without JavaScript, every beat shows its own inline label (the fallback)', () => {
    const html = renderScrolly({ items: BEATS });
    expect(html).toContain('Chunk');
    expect(html).toContain('Embed');
    expect(html).toContain('imx-beat-inline');
  });

  test('defaults tone to sky', () => {
    const html = renderScrolly({ items: BEATS });
    expect(html).toContain('data-tone="sky"');
  });
});

describe('attachScrolly', () => {
  test('builds one pinned slide per beat and marks the first on', () => {
    const root = document.createElement('div');
    root.innerHTML = renderScrolly({ items: BEATS });
    const dispose = attachScrolly(root);

    const slides = root.querySelectorAll('.imx-slide');
    expect(slides.length).toBe(2);
    expect(slides[0]?.classList.contains('on')).toBe(true);
    expect(root.querySelector('.imx-scrolly')?.hasAttribute('data-js')).toBe(true);

    expect(() => dispose()).not.toThrow();
  });
});
