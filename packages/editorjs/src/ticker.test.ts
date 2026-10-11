import { describe, expect, test } from 'bun:test';
import { renderTicker } from '@inflate-ai/imaxt-core';
import { TickerTool } from './ticker.ts';

describe('TickerTool', () => {
  test('exposes a toolbox entry', () => {
    expect(TickerTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new TickerTool({ data: { phrases: ['Embed'] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderTicker({ phrases: ['Embed'] }));
  });

  test('save() round-trips and validate() requires at least one phrase', () => {
    const tool = new TickerTool({ data: { phrases: ['Embed'] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ phrases: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
