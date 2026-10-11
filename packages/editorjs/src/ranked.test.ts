import { describe, expect, test } from 'bun:test';
import { renderRanked } from '@inflate-ai/imaxt-core';
import { RankedTool } from './ranked.ts';

describe('RankedTool', () => {
  test('exposes a toolbox entry', () => {
    expect(RankedTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new RankedTool({ data: { items: [{ label: 'Model A' }] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderRanked({ items: [{ label: 'Model A' }] }));
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new RankedTool({ data: { items: [{ label: 'A' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
