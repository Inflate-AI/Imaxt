import { describe, expect, test } from 'bun:test';
import { renderSparkline } from './sparkline.ts';

describe('renderSparkline', () => {
  test('carries a text alternative summarizing the trend', () => {
    const html = renderSparkline({ values: [12, 18, 9, 24] });
    expect(html).toContain('role="img"');
    expect(html).toMatch(/aria-label="[^"]+"/);
  });

  test('renders an svg polyline for the values', () => {
    const html = renderSparkline({ values: [1, 2, 3] });
    expect(html).toContain('<svg');
    expect(html).toContain('<polyline');
  });

  test('label renders when given', () => {
    const html = renderSparkline({ values: [1, 2], label: 'Weekly signups' });
    expect(html).toContain('Weekly signups');
  });
});
