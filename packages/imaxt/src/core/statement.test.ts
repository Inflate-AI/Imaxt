import { describe, expect, test } from 'bun:test';
import { renderStatement } from './statement.ts';

describe('renderStatement', () => {
  test('wraps body html and defaults align to left, tone to ink', () => {
    const html = renderStatement({ html: 'Every project rebuilds <strong>plumbing</strong>.' });
    expect(html).toContain('Every project rebuilds <strong>plumbing</strong>.');
    expect(html).toContain('data-align="left"');
    expect(html).toContain('data-tone="ink"');
  });

  test('honors an explicit tone and center align', () => {
    const html = renderStatement({
      html: 'Boring is <em>dependable</em>.',
      tone: 'mint',
      align: 'center',
    });
    expect(html).toContain('data-tone="mint"');
    expect(html).toContain('data-align="center"');
  });

  test('applies wide and bleed layout classes when set', () => {
    const html = renderStatement({ html: 'x', wide: true, bleed: true });
    expect(html).toContain('imx-wide');
    expect(html).toContain('imx-bleed');
  });

  test('omits wide/bleed classes by default', () => {
    const html = renderStatement({ html: 'x' });
    expect(html).not.toContain('imx-wide');
    expect(html).not.toContain('imx-bleed');
  });
});
