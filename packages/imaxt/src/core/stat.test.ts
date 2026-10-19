import { describe, expect, test } from 'bun:test';
import { attachStatCountUp, renderStat, renderStatRow } from './stat.ts';

describe('renderStat', () => {
  test('marks a numeric value for count-up but always prints the final value', () => {
    const html = renderStat({ value: '5', unit: 'ms', label: 'p95 query time', tone: 'mint' });
    expect(html).toContain('data-to="5"');
    expect(html).toContain('>5<');
    expect(html).toContain('ms');
    expect(html).toContain('p95 query time');
    expect(html).toContain('data-tone="mint"');
  });

  test('does not mark a non-numeric value for count-up', () => {
    const html = renderStat({ value: '10×', label: 'fewer calls' });
    expect(html).not.toContain('data-to=');
    expect(html).toContain('10×');
  });

  test('renders an optional note', () => {
    const html = renderStat({ value: '0', label: 'images', note: 'placeholder' });
    expect(html).toContain('imx-stat-n');
    expect(html).toContain('placeholder');
  });

  test('defaults tone to ink', () => {
    const html = renderStat({ value: '1', label: 'x' });
    expect(html).toContain('data-tone="ink"');
  });
});

describe('renderStatRow', () => {
  test('renders each item in order', () => {
    const html = renderStatRow({
      items: [
        { value: '5', label: 'a' },
        { value: '6', label: 'b' },
      ],
    });
    expect(html.indexOf('>a<')).toBeLessThan(html.indexOf('>b<'));
    expect(html).toContain('imx-statrow');
  });
});

describe('attachStatCountUp', () => {
  test('leaves the final text untouched under reduced motion', () => {
    globalThis.matchMedia = (() => ({ matches: true })) as unknown as typeof matchMedia;
    const root = document.createElement('div');
    root.innerHTML = renderStat({ value: '42', label: 'x' });
    const dispose = attachStatCountUp(root);
    expect(root.textContent).toContain('42');
    expect(() => dispose()).not.toThrow();
  });

  test('observes numeric stats and disposes cleanly outside reduced motion', () => {
    globalThis.matchMedia = (() => ({ matches: false })) as unknown as typeof matchMedia;
    const root = document.createElement('div');
    root.innerHTML = renderStat({ value: '42', label: 'x' });
    const dispose = attachStatCountUp(root);
    expect(() => dispose()).not.toThrow();
  });
});
