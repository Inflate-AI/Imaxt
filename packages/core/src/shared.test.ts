import { describe, expect, test } from 'bun:test';
import { classNames, escapeHtml, prefersReducedMotion, resolveTone, TONES } from './shared.ts';

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
