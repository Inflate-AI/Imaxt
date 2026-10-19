import { describe, expect, test } from 'bun:test';
import { renderPullQuote } from './pull-quote.ts';

describe('renderPullQuote', () => {
  test('renders the quoted html with no attribution by default', () => {
    const html = renderPullQuote({ html: 'The best API is a short one.' });
    expect(html).toContain('The best API is a short one.');
    expect(html).not.toContain('imx-quote-by');
  });

  test('renders an attribution when `by` is given, escaped', () => {
    const html = renderPullQuote({ html: 'Quote', by: '<Design> rule' });
    expect(html).toContain('imx-quote-by');
    expect(html).toContain('&lt;Design&gt; rule');
  });
});
