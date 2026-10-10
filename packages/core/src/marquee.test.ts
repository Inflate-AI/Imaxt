import { describe, expect, test } from 'bun:test';
import { renderMarquee } from './marquee.ts';

describe('renderMarquee', () => {
  test('every word is present as text', () => {
    const html = renderMarquee({ words: ['Embed', 'Filter', 'Rank'] });
    expect(html).toContain('Embed');
    expect(html).toContain('Filter');
    expect(html).toContain('Rank');
  });

  test('renders a duplicate set for a seamless loop, hidden by reduced-motion CSS', () => {
    const html = renderMarquee({ words: ['A'] });
    expect(html).toContain('imx-marquee-set');
    expect(html).toContain('dup');
  });

  test('sets the animation duration from `seconds`', () => {
    const html = renderMarquee({ words: ['A'], seconds: 10 });
    expect(html).toContain('--dur:10s');
  });
});
