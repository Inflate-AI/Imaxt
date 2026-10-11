import { describe, expect, test } from 'bun:test';
import { renderVersus } from './versus.ts';

describe('renderVersus', () => {
  test('always renders exactly two sides', () => {
    const html = renderVersus({
      sides: [
        { label: 'Postgres', html: 'Relational' },
        { label: 'SQLite', html: 'Embedded' },
      ],
    });
    expect(html).toContain('Postgres');
    expect(html).toContain('SQLite');
    expect(html).toContain('imx-versus');
  });

  test('renders a vs label', () => {
    const html = renderVersus({
      sides: [
        { label: 'A', html: 'x' },
        { label: 'B', html: 'y' },
      ],
      vsLabel: 'OR',
    });
    expect(html).toContain('OR');
  });
});
