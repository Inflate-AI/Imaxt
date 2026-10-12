import { describe, expect, test } from 'bun:test';
import {
  autoOnColor,
  classNames,
  escapeHtml,
  isCustomTone,
  prefersReducedMotion,
  resolveTone,
  TONES,
  toneAttrs,
} from './shared.ts';

describe('TONES', () => {
  test('is exactly the seven documented tones', () => {
    expect(TONES).toEqual(['mint', 'lilac', 'sky', 'rose', 'accent', 'ink', 'white']);
  });
});

describe('resolveTone', () => {
  test('passes through a valid tone', () => {
    expect(resolveTone('mint')).toBe('mint');
  });

  test('falls back to ink when omitted', () => {
    expect(resolveTone(undefined)).toBe('ink');
  });

  test('falls back to ink for an invalid value', () => {
    expect(resolveTone('not-a-tone')).toBe('ink');
  });
});

describe('isCustomTone', () => {
  test('recognizes 6-digit and 3-digit hex colors', () => {
    expect(isCustomTone('#5b3df0')).toBe(true);
    expect(isCustomTone('#fff')).toBe(true);
  });

  test('rejects preset names and garbage', () => {
    expect(isCustomTone('mint')).toBe(false);
    expect(isCustomTone(undefined)).toBe(false);
    expect(isCustomTone('#zzzzzz')).toBe(false);
  });
});

describe('autoOnColor', () => {
  test('picks dark text on a light background', () => {
    expect(autoOnColor('#ffffff')).toBe('#1c1c1c');
  });

  test('picks light text on a dark background', () => {
    expect(autoOnColor('#1c1c1c')).toBe('#f4f1e8');
  });
});

describe('toneAttrs', () => {
  test('renders a preset tone as a plain data-tone attribute', () => {
    expect(toneAttrs('mint')).toBe(' data-tone="mint"');
  });

  test('falls back to ink for an unrecognized, non-color value', () => {
    expect(toneAttrs('not-a-tone')).toBe(' data-tone="ink"');
  });

  test('renders a custom hex tone with inline contrast-safe styling', () => {
    const attrs = toneAttrs('#5b3df0');
    expect(attrs).toContain('data-tone="custom"');
    expect(attrs).toContain('--imx-tone:#5b3df0');
    expect(attrs).toContain('--imx-on:#f4f1e8');
  });
});

describe('escapeHtml', () => {
  test('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<b> & "quoted" 'single'`)).toBe(
      '&lt;b&gt; &amp; &quot;quoted&quot; &#39;single&#39;',
    );
  });

  test('leaves plain text untouched', () => {
    expect(escapeHtml('plain text 123')).toBe('plain text 123');
  });
});

describe('classNames', () => {
  test('joins truthy class names and drops falsy ones', () => {
    expect(classNames('a', false, 'b', undefined, null, '', 'c')).toBe('a b c');
  });
});

describe('prefersReducedMotion', () => {
  test('returns false when matchMedia is unavailable (SSR)', () => {
    const original = (globalThis as { matchMedia?: unknown }).matchMedia;
    // @ts-expect-error - simulating an SSR environment with no matchMedia
    delete globalThis.matchMedia;
    expect(prefersReducedMotion()).toBe(false);
    (globalThis as { matchMedia?: unknown }).matchMedia = original;
  });

  test('reflects matchMedia when available', () => {
    const original = globalThis.matchMedia;
    globalThis.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
    })) as typeof matchMedia;
    expect(prefersReducedMotion()).toBe(true);
    globalThis.matchMedia = original;
  });
});
