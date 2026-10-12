import { describe, expect, test } from 'bun:test';
import { renderEmbed } from '@inflate-ai/imaxt-core';
import { EmbedTool } from './embed.ts';

describe('EmbedTool', () => {
  test('exposes a toolbox entry', () => {
    expect(EmbedTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new EmbedTool({ data: { url: 'https://example.com' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderEmbed({ url: 'https://example.com' }));
  });

  test('save() round-trips and validate() requires a url', () => {
    const tool = new EmbedTool({ data: { url: 'https://example.com' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ url: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
