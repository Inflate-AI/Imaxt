import { describe, expect, test } from 'bun:test';
import { renderCodeWalk } from '@inflate-ai/imaxt-core';
import { CodeWalkTool } from './code-walk.ts';

describe('CodeWalkTool', () => {
  test('exposes a toolbox entry', () => {
    expect(CodeWalkTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial code and steps', () => {
    const data = { code: 'const x = 1;', steps: [{ lines: '1', title: 'Declare' }] };
    const tool = new CodeWalkTool({ data } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-ej-preview')?.innerHTML).toBe(renderCodeWalk(data));
  });

  test('editing the code field updates save()', () => {
    const tool = new CodeWalkTool({
      data: { code: 'a', steps: [{ lines: '1', title: 't' }] },
    } as never);
    const wrapper = tool.render();
    const textarea = wrapper.querySelector<HTMLTextAreaElement>('textarea')!;
    textarea.value = 'changed';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().code).toBe('changed');
  });

  test('adding and removing steps updates save()', () => {
    const tool = new CodeWalkTool({
      data: { code: 'a', steps: [{ lines: '1', title: 't' }] },
    } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().steps.length).toBe(2);
    wrapper.querySelectorAll<HTMLButtonElement>('.imx-ej-remove')[0]?.click();
    expect(tool.save().steps.length).toBe(1);
  });

  test('save() round-trips through JSON and validate() requires code and steps', () => {
    const tool = new CodeWalkTool({
      data: { code: 'a', steps: [{ lines: '1', title: 't' }] },
    } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ code: '', steps: saved.steps })).toBe(false);
    expect(tool.validate({ code: 'a', steps: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
