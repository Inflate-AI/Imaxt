import { describe, expect, test } from 'bun:test';
import { renderEmbed } from './embed.ts';

describe('renderEmbed', () => {
  test('renders a link, not an iframe', () => {
    const html = renderEmbed({ url: 'https://example.com/video' });
    expect(html).toContain('<a');
    expect(html).toContain('href="https://example.com/video"');
    expect(html).not.toContain('<iframe');
  });

  test('caption is present as text content when given', () => {
    const html = renderEmbed({ url: 'https://example.com', caption: 'A great talk' });
    expect(html).toContain('A great talk');
  });
});
