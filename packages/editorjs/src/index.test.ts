import { describe, expect, test } from 'bun:test';
import { imaxtTools } from './index.ts';

describe('imaxtTools', () => {
  test('registers every block tool', () => {
    expect(Object.keys(imaxtTools).sort()).toEqual(
      [
        'bars',
        'codeWalk',
        'compare',
        'curvedText',
        'delta',
        'funnel',
        'gauge',
        'heatmap',
        'marquee',
        'matrix',
        'pullQuote',
        'ranked',
        'scorecard',
        'scrolly',
        'sidenote',
        'sparkline',
        'statRow',
        'statement',
        'steps',
        'timeline',
        'typeLab',
      ].sort(),
    );
  });

  test('does not register ImaxtCover as a body tool', () => {
    const names = Object.keys(imaxtTools).map((k) => k.toLowerCase());
    expect(names.some((n) => n.includes('cover'))).toBe(false);
    const titles = Object.values(imaxtTools).map((Tool) => Tool.toolbox.title.toLowerCase());
    expect(titles.some((t) => t.includes('cover'))).toBe(false);
  });
});
