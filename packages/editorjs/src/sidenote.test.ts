import { describe, expect, test } from 'bun:test';
import { renderSidenote } from '@inflate-ai/imaxt-core';
import { SidenoteTool } from './sidenote.ts';

describe('SidenoteTool', () => {
  test('exposes a toolbox entry', () => {
    expect(SidenoteTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new SidenoteTool({ data: { html: 'Note body', label: 'Mock data' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderSidenote({ html: 'Note body', label: 'Mock data' }));

    const editable = wrapper.querySelector<HTMLElement>('[contenteditable]')!;
    editable.innerHTML = 'New body';
    editable.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toContain('New body');
  });

  test('save() round-trips and validate() requires content', () => {
    const tool = new SidenoteTool({ data: { html: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ html: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
