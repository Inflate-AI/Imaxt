import { describe, expect, test } from 'bun:test';
import { renderErrorBox } from './error-box.ts';

describe('renderErrorBox', () => {
  test('renders title and message', () => {
    const html = renderErrorBox({ title: 'TypeError', message: 'Cannot read property "x"' });
    expect(html).toContain('TypeError');
    expect(html).toContain('Cannot read property');
  });

  test('stack trace preserves whitespace', () => {
    const html = renderErrorBox({
      title: 'Error',
      message: 'x',
      stack: '    at foo (file.ts:1:1)',
    });
    expect(html).toContain('<pre');
    expect(html).toContain('    at foo');
  });
});
