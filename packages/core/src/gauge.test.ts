import { describe, expect, test } from 'bun:test';
import { renderGauge } from './gauge.ts';

describe('renderGauge', () => {
  test('fill proportion matches value over max', () => {
    const html = renderGauge({ value: 50, max: 100 });
    expect(html).toContain('--p:50%');
  });

  test('value is present as selectable text', () => {
    const html = renderGauge({ value: 42, max: 100, unit: '%' });
    expect(html).toContain('42');
  });

  test('label renders when given', () => {
    const html = renderGauge({ value: 3, max: 5, label: 'Capacity' });
    expect(html).toContain('Capacity');
  });
});
