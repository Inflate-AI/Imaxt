import { describe, expect, test } from 'bun:test';
import { renderTakeaways } from '@inflate-ai/imaxt-core';
import { TakeawaysTool } from './takeaways.ts';

describe('TakeawaysTool', () => {
  test('exposes a toolbox entry', () => {
    expect(TakeawaysTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new TakeawaysTool({ data: { items: ['First'] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderTakeaways({ items: ['First'] }));
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new TakeawaysTool({ data: { items: ['First'] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
