import { describe, expect, test } from 'bun:test';
import { renderFunnel } from './funnel.ts';

describe('renderFunnel', () => {
  test('stage width is proportional to the first stage', () => {
    const html = renderFunnel({
      stages: [
        { label: 'Visitors', value: 1000 },
        { label: 'Signups', value: 500 },
      ],
    });
    expect(html).toContain('--w:100%');
    expect(html).toContain('--w:50%');
  });

  test('every stage value is readable as text', () => {
    const html = renderFunnel({
      stages: [
        { label: 'Visitors', value: 1000 },
        { label: 'Signups', value: 500 },
      ],
      unit: '',
    });
    expect(html).toContain('1000');
    expect(html).toContain('500');
  });
});
