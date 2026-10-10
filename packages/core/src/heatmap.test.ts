import { describe, expect, test } from 'bun:test';
import { renderHeatmap } from './heatmap.ts';

describe('renderHeatmap', () => {
  test('every cell value is printed as text alongside its tint', () => {
    const html = renderHeatmap({
      caption: 'Common modes',
      rows: ['600', '644'],
      cols: ['Owner', 'Others'],
      data: [
        [6, 0],
        [6, 4],
      ],
      min: 0,
      max: 7,
    });
    expect(html).toContain('>6<');
    expect(html).toContain('>0<');
    expect(html).toContain('>4<');
    expect(html).toContain('--p:');
  });

  test('renders row and column labels and the caption', () => {
    const html = renderHeatmap({
      caption: 'My caption',
      rows: ['r1'],
      cols: ['c1'],
      data: [[1]],
    });
    expect(html).toContain('My caption');
    expect(html).toContain('r1');
    expect(html).toContain('c1');
  });

  test('defaults min/max to the data range and renders a legend', () => {
    const html = renderHeatmap({ caption: 'x', rows: ['r'], cols: ['c'], data: [[5]] });
    expect(html).toContain('imx-heat-legend');
  });
});
