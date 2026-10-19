import { describe, expect, test } from 'bun:test';
import { renderCurvedText } from './curved-text.ts';

describe('renderCurvedText', () => {
  test('keeps the text as real, selectable text for every shape', () => {
    for (const shape of ['arc', 'wave', 'circle'] as const) {
      const html = renderCurvedText({ text: 'Drafted', shape });
      expect(html).toContain('Drafted');
    }
  });

  test('is in the accessibility tree by default (role=img, aria-label)', () => {
    const html = renderCurvedText({ text: 'Drag the sliders' });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Drag the sliders"');
  });

  test('decorative instances are excluded from the accessibility tree', () => {
    const html = renderCurvedText({ text: 'Drafted', decorative: true });
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain('aria-label');
    expect(html).toContain('aria-hidden="true"');
  });

  test('a circle can carry a mark and spin', () => {
    const html = renderCurvedText({ text: 'Drafted', shape: 'circle', mark: 'D', spin: true });
    expect(html).toContain('imx-curved-mark');
    expect(html).toContain('>D<');
    expect(html).toContain('imx-spin');
  });

  test('spin only applies to circle shapes', () => {
    const html = renderCurvedText({ text: 'x', shape: 'arc', spin: true });
    expect(html).not.toContain('imx-spin');
  });
});
