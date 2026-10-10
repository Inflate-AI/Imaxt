import { describe, expect, test } from 'bun:test';
import { renderStep, renderSteps } from './steps.ts';

describe('renderStep', () => {
  test('renders a title and body', () => {
    const html = renderStep({ title: 'Chunk', html: 'Split each document.' });
    expect(html).toContain('imx-step-t');
    expect(html).toContain('Chunk');
    expect(html).toContain('Split each document.');
  });
});

describe('renderSteps', () => {
  test('preserves the given item order', () => {
    const html = renderSteps({
      items: [
        { title: 'Chunk', html: 'a' },
        { title: 'Embed', html: 'b' },
        { title: 'Write', html: 'c' },
      ],
    });
    expect(html.indexOf('Chunk')).toBeLessThan(html.indexOf('Embed'));
    expect(html.indexOf('Embed')).toBeLessThan(html.indexOf('Write'));
    expect(html).toContain('imx-steps');
  });
});
