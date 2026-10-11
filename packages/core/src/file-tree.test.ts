import { describe, expect, test } from 'bun:test';
import { renderFileTree } from './file-tree.ts';

describe('renderFileTree', () => {
  test('folder is distinguished by text, not an icon', () => {
    const html = renderFileTree({
      tree: [{ name: 'src', children: [{ name: 'index.ts' }] }],
    });
    expect(html).toContain('src/');
    expect(html).toContain('index.ts');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<svg');
  });

  test('renders nested children', () => {
    const html = renderFileTree({
      tree: [{ name: 'src', children: [{ name: 'core', children: [{ name: 'bars.ts' }] }] }],
    });
    expect(html.indexOf('src/')).toBeLessThan(html.indexOf('core/'));
    expect(html.indexOf('core/')).toBeLessThan(html.indexOf('bars.ts'));
  });
});
