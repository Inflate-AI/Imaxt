import { describe, expect, test } from 'bun:test';
import { renderEvent, renderTimeline } from './timeline.ts';

describe('renderEvent', () => {
  test('renders a date, title and body', () => {
    const html = renderEvent({ date: 'Step 1', title: 'Propose', html: 'A leader suggests.' });
    expect(html).toContain('Step 1');
    expect(html).toContain('Propose');
    expect(html).toContain('A leader suggests.');
  });
});

describe('renderTimeline', () => {
  test('preserves the given event order', () => {
    const html = renderTimeline({
      items: [
        { date: '1', title: 'Propose', html: 'a' },
        { date: '2', title: 'Accept', html: 'b' },
      ],
    });
    expect(html.indexOf('Propose')).toBeLessThan(html.indexOf('Accept'));
    expect(html).toContain('imx-timeline');
  });
});
