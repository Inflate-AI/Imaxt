import { describe, expect, test } from 'bun:test';
import { renderBanner } from '@inflate-ai/imaxt-core';
import { BannerTool } from './banner.ts';

describe('BannerTool', () => {
  test('exposes a toolbox entry', () => {
    expect(BannerTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new BannerTool({ data: { text: 'Launching soon' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderBanner({ text: 'Launching soon' }));
  });

  test('save() round-trips and validate() requires text', () => {
    const tool = new BannerTool({ data: { text: 'Launching soon' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ text: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
