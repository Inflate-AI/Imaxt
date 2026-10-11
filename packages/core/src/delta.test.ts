import { describe, expect, test } from 'bun:test';
import { renderDelta } from './delta.ts';

describe('renderDelta', () => {
  test('renders label, from, and to as text', () => {
    const html = renderDelta({ label: 'Latency', from: 120, to: 80, unit: 'ms' });
    expect(html).toContain('Latency');
    expect(html).toContain('120');
    expect(html).toContain('80');
    expect(html).toContain('ms');
  });

  test('numeric increase renders an increase direction', () => {
    const html = renderDelta({ label: 'Users', from: 10, to: 20 });
    expect(html).toContain('data-direction="up"');
  });

  test('numeric decrease renders a decrease direction', () => {
    const html = renderDelta({ label: 'Latency', from: 120, to: 80 });
    expect(html).toContain('data-direction="down"');
  });

  test('non-numeric values render with no direction indicator', () => {
    const html = renderDelta({ label: 'Status', from: 'Beta', to: 'GA' });
    expect(html).not.toContain('data-direction');
    expect(html).toContain('Beta');
    expect(html).toContain('GA');
  });
});
