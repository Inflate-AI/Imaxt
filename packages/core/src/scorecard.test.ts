import { describe, expect, test } from 'bun:test';
import { renderScorecard } from './scorecard.ts';

describe('renderScorecard', () => {
  test('every item renders its label and value in order', () => {
    const html = renderScorecard({
      items: [
        { label: 'MRR', value: 42000, unit: '$' },
        { label: 'Churn', value: '2.1', unit: '%' },
      ],
    });
    expect(html.indexOf('MRR')).toBeLessThan(html.indexOf('Churn'));
    expect(html).toContain('42000');
    expect(html).toContain('2.1');
  });

  test('delta renders as text when given', () => {
    const html = renderScorecard({ items: [{ label: 'MRR', value: 1, delta: '+12%' }] });
    expect(html).toContain('+12%');
  });
});
