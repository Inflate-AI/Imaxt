import { describe, expect, test } from 'bun:test';
import { renderRedacted } from './redacted.ts';

describe('renderRedacted', () => {
  test('works with no client-side JavaScript via native disclosure', () => {
    const html = renderRedacted({ html: 'The launch date is March 3rd.' });
    expect(html).toContain('<details');
    expect(html).toContain('<summary');
    expect(html).toContain('The launch date is March 3rd.');
  });

  test('revealLabel becomes the accessible name', () => {
    const html = renderRedacted({ html: 'x', revealLabel: 'Click to reveal' });
    expect(html).toContain('aria-label="Click to reveal"');
  });
});
