import { describe, expect, test } from 'bun:test';
import { renderCurvedText } from '@inflate-ai/imaxt-core';
import { CurvedTextTool } from './curved-text.ts';

describe('CurvedTextTool', () => {
  test('exposes a toolbox entry', () => {
    expect(CurvedTextTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new CurvedTextTool({ data: { text: 'Drafted', shape: 'circle' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    const expected = document.createElement('div');
    expected.innerHTML = renderCurvedText({ text: 'Drafted', shape: 'circle' });
    expect(preview.innerHTML).toBe(expected.innerHTML);

    const textInput = wrapper.querySelector<HTMLInputElement>('input[type="text"]')!;
    textInput.value = 'Changed';
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toContain('Changed');
  });

  test('save() round-trips and validate() requires text', () => {
    const tool = new CurvedTextTool({ data: { text: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ text: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
