import { describe, expect, test } from 'bun:test';
import { renderChecklist } from './checklist.ts';

describe('renderChecklist', () => {
  test('done and not-done items render distinct text glyphs', () => {
    const html = renderChecklist({
      items: [
        { text: 'Write tests', done: true },
        { text: 'Ship it', done: false },
      ],
    });
    const doneIndex = html.indexOf('Write tests');
    const notDoneIndex = html.indexOf('Ship it');
    expect(html.slice(0, doneIndex)).toContain('✓');
    expect(html.slice(doneIndex, notDoneIndex)).not.toContain('✓');
  });

  test('renders an optional title', () => {
    const html = renderChecklist({ items: [{ text: 'A' }], title: 'Launch checklist' });
    expect(html).toContain('Launch checklist');
  });
});
