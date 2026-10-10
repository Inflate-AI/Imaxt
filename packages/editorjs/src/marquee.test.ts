import { describe, expect, test } from 'bun:test';
import { renderMarquee } from '@inflate-ai/imaxt-core';
import { MarqueeTool } from './marquee.ts';

describe('MarqueeTool', () => {
  test('exposes a toolbox entry', () => {
    expect(MarqueeTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates when words change', () => {
    const tool = new MarqueeTool({ data: { words: ['Embed', 'Filter'] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderMarquee({ words: ['Embed', 'Filter'] }));

    const wordsInput = wrapper.querySelector<HTMLInputElement>('input')!;
    wordsInput.value = 'Rank, Repeat';
    wordsInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toContain('Rank');
    expect(preview.innerHTML).toContain('Repeat');
  });

  test('save() round-trips and validate() requires at least one word', () => {
    const tool = new MarqueeTool({ data: { words: ['a'] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ words: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
