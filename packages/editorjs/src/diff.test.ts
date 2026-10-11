import { describe, expect, test } from 'bun:test';
import { renderDiff } from '@inflate-ai/imaxt-core';
import { DiffTool } from './diff.ts';

describe('DiffTool', () => {
  test('exposes a toolbox entry', () => {
    expect(DiffTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new DiffTool({ data: { before: 'a', after: 'b' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderDiff({ before: 'a', after: 'b' }));

    const afterInput = wrapper.querySelector<HTMLTextAreaElement>('[data-field="after"]')!;
    afterInput.value = 'c';
    afterInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toBe(renderDiff({ before: 'a', after: 'c' }));
  });

  test('save() round-trips', () => {
    const tool = new DiffTool({ data: { before: 'a', after: 'b' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate(saved)).toBe(true);
  });
});
