import { describe, expect, test } from 'bun:test';
import { imaxtTools } from './index.ts';

describe('imaxtTools', () => {
  test('registers every block tool', () => {
    expect(Object.keys(imaxtTools).sort()).toEqual(
      [
        'banner',
        'bars',
        'callout',
        'changelog',
        'checklist',
        'codeWalk',
        'compare',
        'curvedText',
        'delta',
        'diff',
        'dropCap',
        'errorBox',
        'faq',
        'fileTree',
        'footnote',
        'formula',
        'funnel',
        'gauge',
        'glossary',
        'heatmap',
        'marquee',
        'matrix',
        'pullQuote',
        'ranked',
        'redacted',
        'scorecard',
        'scrolly',
        'sidenote',
        'sparkline',
        'stamp',
        'statRow',
        'statement',
        'steps',
        'takeaways',
        'terminal',
        'ticker',
        'timeline',
        'typeLab',
        'versus',
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
