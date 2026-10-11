import { describe, expect, test } from 'bun:test';
import { renderFaq } from '@inflate-ai/imaxt-core';
import { FaqTool } from './faq.ts';

describe('FaqTool', () => {
  test('exposes a toolbox entry', () => {
    expect(FaqTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new FaqTool({ data: { items: [{ q: 'Is this free?', a: 'Yes.' }] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderFaq({ items: [{ q: 'Is this free?', a: 'Yes.' }] }));
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new FaqTool({ data: { items: [{ q: 'Q', a: 'A' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
