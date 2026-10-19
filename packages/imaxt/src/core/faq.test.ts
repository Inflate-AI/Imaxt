import { describe, expect, test } from 'bun:test';
import { renderFaq } from './faq.ts';

describe('renderFaq', () => {
  test('works with no client-side JavaScript via native disclosure', () => {
    const html = renderFaq({ items: [{ q: 'Is this free?', a: 'Yes.' }] });
    expect(html).toContain('<details');
    expect(html).toContain('<summary');
    expect(html).toContain('Is this free?');
    expect(html).toContain('Yes.');
  });

  test('renders every item in order', () => {
    const html = renderFaq({
      items: [
        { q: 'First?', a: 'A' },
        { q: 'Second?', a: 'B' },
      ],
    });
    expect(html.indexOf('First?')).toBeLessThan(html.indexOf('Second?'));
  });
});
