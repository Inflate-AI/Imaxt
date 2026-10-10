import { describe, expect, test } from 'bun:test';
import { renderCompare, renderSide } from './compare.ts';

describe('renderSide', () => {
  test('defaults to "after" kind with the accent tone and a slab surface', () => {
    const html = renderSide({ html: 'One small API' });
    expect(html).toContain('data-kind="after"');
    expect(html).toContain('data-tone="accent"');
    expect(html).toContain('imx-slab');
  });

  test('"before" kind has no tone and no slab surface', () => {
    const html = renderSide({ html: 'Three pipelines', kind: 'before' });
    expect(html).toContain('data-kind="before"');
    expect(html).not.toContain('data-tone');
    expect(html).not.toContain('imx-slab');
  });

  test('renders an optional label, escaped', () => {
    const html = renderSide({ html: 'x', label: '<Before>' });
    expect(html).toContain('&lt;Before&gt;');
  });

  test('an explicit tone overrides the kind-based default', () => {
    const html = renderSide({ html: 'x', kind: 'before', tone: 'rose' });
    expect(html).toContain('data-tone="rose"');
  });
});

describe('renderCompare', () => {
  test('renders exactly two sides with a VS marker', () => {
    const html = renderCompare({
      sides: [{ html: 'Before text', kind: 'before' }, { html: 'After text' }],
    });
    expect(html.indexOf('Before text')).toBeLessThan(html.indexOf('After text'));
    expect(html).toContain('imx-vs');
    expect(html).toContain('role="group"');
  });
});
