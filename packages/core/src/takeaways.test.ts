import { describe, expect, test } from 'bun:test';
import { renderTakeaways } from './takeaways.ts';

describe('renderTakeaways', () => {
  test('every item renders as text in order', () => {
    const html = renderTakeaways({ items: ['First point', 'Second point'] });
    expect(html.indexOf('First point')).toBeLessThan(html.indexOf('Second point'));
  });

  test('renders an optional title', () => {
    const html = renderTakeaways({ items: ['A'], title: 'Key takeaways' });
    expect(html).toContain('Key takeaways');
  });
});
