import { describe, expect, test } from 'bun:test';
import { attachCodeWalk, renderCodeWalk } from './code-walk.ts';

const DATA = {
  code: 'const id = `${doc.id}`;\nawait index.upsert({ id, vector });',
  steps: [
    { lines: '1', title: 'Stable id', text: 'Same chunk, same id.' },
    { lines: '2', title: 'Upsert', text: 'Replaces instead of duplicating.' },
  ],
};

describe('renderCodeWalk', () => {
  test('every code line and every step stays visible with no JavaScript', () => {
    const html = renderCodeWalk(DATA);
    expect(html).toContain('doc.id');
    expect(html).toContain('index.upsert');
    expect(html).toContain('Stable id');
    expect(html).toContain('Same chunk, same id.');
    expect(html).toContain('Upsert');
    expect(html).toContain('Replaces instead of duplicating.');
  });

  test('escapes code content', () => {
    const html = renderCodeWalk({ code: 'const x = a < b;', steps: [{ lines: '1', title: 't' }] });
    expect(html).toContain('&lt;');
  });

  test('uses pre-rendered html in place of the plain-text code when given', () => {
    const html = renderCodeWalk({
      code: 'const x = 1;',
      html: '<pre class="astro-code"><code><span class="line">const x = 1;</span></code></pre>',
      steps: [{ lines: '1', title: 't' }],
    });
    expect(html).toContain('astro-code');
    expect(html.match(/<pre/g)?.length).toBe(1);
  });
});

describe('attachCodeWalk', () => {
  test('clicking a step dims lines outside its range and marks it pressed', () => {
    const root = document.createElement('div');
    root.innerHTML = renderCodeWalk(DATA);
    const dispose = attachCodeWalk(root);

    const steps = root.querySelectorAll<HTMLButtonElement>('.imx-walk-step');
    const lines = root.querySelectorAll<HTMLElement>('.imx-walk-code .line');
    expect(steps.length).toBe(2);
    expect(lines.length).toBe(2);

    steps[1]?.dispatchEvent(new Event('click', { bubbles: true }));
    expect(lines[0]?.classList.contains('dim')).toBe(true);
    expect(lines[1]?.classList.contains('dim')).toBe(false);
    expect(steps[1]?.getAttribute('aria-pressed')).toBe('true');
    expect(steps[0]?.getAttribute('aria-pressed')).toBe('false');

    expect(() => dispose()).not.toThrow();
  });
});
