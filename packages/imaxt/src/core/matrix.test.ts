import { describe, expect, test } from 'bun:test';
import { renderMatrix } from './matrix.ts';

describe('renderMatrix', () => {
  test('renders a real table with rows and cols', () => {
    const html = renderMatrix({
      rows: ['Free', 'Pro'],
      cols: ['Exports', 'Support'],
      cells: [
        ['yes', 'no'],
        ['yes', 'yes'],
      ],
    });
    expect(html).toContain('<table');
    expect(html).toContain('Free');
    expect(html).toContain('Exports');
  });

  test('cell value is always present as text, not color-only', () => {
    const html = renderMatrix({
      rows: ['Free'],
      cols: ['Exports'],
      cells: [['partial']],
    });
    expect(html).toContain('partial');
  });

  test('caption renders when given', () => {
    const html = renderMatrix({
      rows: ['Free'],
      cols: ['Exports'],
      cells: [['yes']],
      caption: 'Plan comparison',
    });
    expect(html).toContain('Plan comparison');
  });
});
