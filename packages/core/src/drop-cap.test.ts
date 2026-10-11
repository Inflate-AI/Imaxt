import { describe, expect, test } from 'bun:test';
import { renderDropCap } from './drop-cap.ts';

describe('renderDropCap', () => {
  test('first character is distinguished, text order preserved', () => {
    const html = renderDropCap({ html: 'Lorem ipsum dolor sit amet.' });
    expect(html).toContain('imx-dropcap-l');
    expect(html.indexOf('L')).toBeLessThan(html.indexOf('orem'));
    const textOnly = html.replace(/<[^>]+>/g, '');
    expect(textOnly).toContain('Lorem ipsum dolor sit amet.');
  });
});
