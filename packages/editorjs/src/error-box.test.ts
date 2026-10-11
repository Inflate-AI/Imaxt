import { describe, expect, test } from 'bun:test';
import { renderErrorBox } from '@inflate-ai/imaxt-core';
import { ErrorBoxTool } from './error-box.ts';

describe('ErrorBoxTool', () => {
  test('exposes a toolbox entry', () => {
    expect(ErrorBoxTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new ErrorBoxTool({ data: { title: 'TypeError', message: 'x' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderErrorBox({ title: 'TypeError', message: 'x' }));
  });

  test('save() round-trips and validate() requires a title and message', () => {
    const tool = new ErrorBoxTool({ data: { title: 'TypeError', message: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ title: '', message: 'x' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
