import { describe, expect, test } from 'bun:test';
import { renderDropCap } from '@inflate-ai/imaxt-core';
import { DropCapTool } from './drop-cap.ts';

describe('DropCapTool', () => {
  test('exposes a toolbox entry', () => {
    expect(DropCapTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new DropCapTool({ data: { html: 'Lorem ipsum' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderDropCap({ html: 'Lorem ipsum' }));

    const editable = wrapper.querySelector<HTMLElement>('[contenteditable]')!;
    editable.innerHTML = 'New text';
    editable.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toBe(renderDropCap({ html: 'New text' }));
  });

  test('save() round-trips and validate() requires content', () => {
    const tool = new DropCapTool({ data: { html: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ html: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
