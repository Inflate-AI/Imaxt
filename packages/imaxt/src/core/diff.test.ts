import { describe, expect, test } from 'bun:test';
import { renderDiff } from './diff.ts';

describe('renderDiff', () => {
  test('added and removed lines carry a text prefix', () => {
    const html = renderDiff({ before: 'const a = 1;', after: 'const a = 2;' });
    expect(html).toContain('>-</span>');
    expect(html).toContain('>+</span>');
  });

  test('unchanged lines render with no prefix', () => {
    const html = renderDiff({
      before: 'const a = 1;\nconst b = 2;',
      after: 'const a = 1;\nconst b = 3;',
    });
    const lines = html.split('imx-diff-line');
    const unchanged = lines.find((l) => l.includes('const a = 1;'));
    expect(unchanged).toBeDefined();
    expect(unchanged).not.toContain('>-</span>');
    expect(unchanged).not.toContain('>+</span>');
  });

  test('renders every line of before and after', () => {
    const html = renderDiff({ before: 'one\ntwo', after: 'one\nthree' });
    expect(html).toContain('one');
    expect(html).toContain('two');
    expect(html).toContain('three');
  });
});
