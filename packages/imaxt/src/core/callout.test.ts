import { describe, expect, test } from 'bun:test';
import { renderCallout } from './callout.ts';

describe('renderCallout', () => {
  test('defaults kind to note', () => {
    const html = renderCallout({ html: 'Body text' });
    expect(html).toContain('data-kind="note"');
    expect(html).toContain('Note');
  });

  test('kind renders a distinct text label', () => {
    const html = renderCallout({ html: 'x', kind: 'danger' });
    expect(html).toContain('data-kind="danger"');
    expect(html).toContain('Danger');
  });

  test('renders an optional title', () => {
    const html = renderCallout({ html: 'x', title: 'Heads up' });
    expect(html).toContain('Heads up');
  });
});
